import { useEffect, useState } from 'react';
import './HistoriasDestacadas.css';

const API_URL = 'http://localhost:3000';

function imagenUrl(url) {
  if (!url) return '';
  if (/^(https?:|blob:|data:)/.test(url)) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

async function leerRespuesta(response) {
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.error || data.message || `Error del servidor (${response.status})`);
  }
  return data;
}

export default function HistoriasDestacadas({ idUsuario, esPropio = false }) {
  const [grupos, setGrupos] = useState([]);
  const [historias, setHistorias] = useState([]);
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [nombre, setNombre] = useState('');
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [portada, setPortada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!idUsuario) {
      setCargando(false);
      return undefined;
    }

    const controller = new AbortController();
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        const [respuestaGrupos, respuestaHistorias] = await Promise.all([
          fetch(`${API_URL}/api/historias-destacadas/usuario/${idUsuario}`, {
            signal: controller.signal
          }),
          esPropio
            ? fetch(`${API_URL}/api/historias`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                signal: controller.signal
              })
            : Promise.resolve(null)
        ]);
        const dataGrupos = await leerRespuesta(respuestaGrupos);
        setGrupos(Array.isArray(dataGrupos.grupos) ? dataGrupos.grupos : []);

        if (respuestaHistorias) {
          const dataHistorias = await leerRespuesta(respuestaHistorias);
          const lista = Array.isArray(dataHistorias) ? dataHistorias : dataHistorias.historias;
          if (!Array.isArray(lista)) {
            throw new Error('El servidor devolvió un formato de historias no válido.');
          }
          setHistorias(lista.filter((historia) => Number(historia.id_usuario) === Number(idUsuario)));
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return;
        console.error('Error al cargar las historias destacadas:', fetchError);
        setError(fetchError.message || 'No se pudieron cargar las historias destacadas.');
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargar();
    return () => controller.abort();
  }, [idUsuario, esPropio, token]);

  const abrirCrear = () => {
    setNombre('');
    setSeleccionadas([]);
    setPortada(null);
    setError('');
    setMostrarCrear(true);
  };

  const alternarHistoria = (idHistoria) => {
    const estabaSeleccionada = seleccionadas.includes(idHistoria);
    const nuevas = estabaSeleccionada
      ? seleccionadas.filter((id) => id !== idHistoria)
      : [...seleccionadas, idHistoria];
    setSeleccionadas(nuevas);

    if (estabaSeleccionada && portada === idHistoria) {
      setPortada(nuevas[0] || null);
    } else if (!estabaSeleccionada && !portada) {
      setPortada(idHistoria);
    }
  };

  const crearGrupo = async (event) => {
    event.preventDefault();
    if (!token) {
      setError('Iniciá sesión para crear un destacado.');
      return;
    }
    if (!nombre.trim() || !seleccionadas.length) {
      setError('Escribí un nombre y elegí al menos una historia.');
      return;
    }

    const historiaPortada = historias.find((historia) => Number(historia.id_historia) === portada);
    setGuardando(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/historias-destacadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          ids_historia: seleccionadas,
          portada_url: historiaPortada?.imagen_url
        })
      });
      const data = await leerRespuesta(response);
      setGrupos((actuales) => [data.grupo, ...actuales]);
      setMostrarCrear(false);
    } catch (saveError) {
      console.error('Error al crear el destacado:', saveError);
      setError(saveError.message || 'No se pudo crear el destacado.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarGrupo = async () => {
    if (!token || !grupoAbierto) return;
    if (!window.confirm(`¿Querés eliminar el destacado "${grupoAbierto.nombre}"?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/historias-destacadas/${grupoAbierto.id_grupo}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await leerRespuesta(response);
      setGrupos((actuales) => actuales.filter((grupo) => grupo.id_grupo !== grupoAbierto.id_grupo));
      setGrupoAbierto(null);
    } catch (deleteError) {
      console.error('Error al eliminar el destacado:', deleteError);
      setError(deleteError.message || 'No se pudo eliminar el destacado.');
    }
  };

  if (cargando && !grupos.length) {
    return <p className="destacados-estado">Cargando historias destacadas...</p>;
  }

  return (
    <section className="historias-destacadas" aria-label="Historias destacadas">
      <div className="destacados-encabezado">
        <h2>Historias destacadas</h2>
        {esPropio && (
          <button type="button" className="destacado-crear-btn" onClick={abrirCrear}>
            <span aria-hidden="true">+</span> Nuevo destacado
          </button>
        )}
      </div>

      {error && !mostrarCrear && <p className="destacados-error" role="alert">{error}</p>}

      {!grupos.length && !error && (
        <p className="destacados-estado">
          {esPropio ? 'Todavía no creaste historias destacadas.' : 'Todavía no hay historias destacadas.'}
        </p>
      )}

      {grupos.length > 0 && (
        <div className="destacados-fila">
          {grupos.map((grupo) => (
            <button
              className="destacado-circulo"
              type="button"
              key={grupo.id_grupo}
              onClick={() => setGrupoAbierto(grupo)}
              aria-label={`Ver destacado ${grupo.nombre}`}
            >
              <span className="destacado-portada">
                {grupo.portada_url
                  ? <img src={imagenUrl(grupo.portada_url)} alt="" />
                  : <span className="destacado-sin-portada">✧</span>}
              </span>
              <span className="destacado-nombre">{grupo.nombre}</span>
            </button>
          ))}
        </div>
      )}

      {mostrarCrear && (
        <div className="destacado-overlay" onClick={() => setMostrarCrear(false)}>
          <section
            className="destacado-dialogo"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destacado-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="destacado-cerrar" type="button" onClick={() => setMostrarCrear(false)} aria-label="Cerrar">×</button>
            <h2 id="destacado-titulo">Crear destacado</h2>
            <form onSubmit={crearGrupo}>
              <label className="destacado-label" htmlFor="destacado-nombre">Nombre</label>
              <input
                id="destacado-nombre"
                className="destacado-nombre-input"
                maxLength={50}
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej.: Looks, Viajes..."
                required
              />
              <p className="destacado-ayuda">Elegí las historias que querés guardar en este círculo.</p>
              <div className="destacado-seleccion">
                {!historias.length && <p className="destacados-estado">Todavía no tenés historias para destacar.</p>}
                {historias.map((historia) => {
                  const idHistoria = Number(historia.id_historia);
                  const seleccionada = seleccionadas.includes(idHistoria);
                  return (
                    <div className={`destacado-historia-opcion${seleccionada ? ' seleccionada' : ''}`} key={idHistoria}>
                      <label className="destacado-historia-seleccionar">
                        <input
                          className="destacado-historia-check"
                          type="checkbox"
                          checked={seleccionada}
                          onChange={() => alternarHistoria(idHistoria)}
                        />
                        <img src={imagenUrl(historia.imagen_url)} alt="" />
                        <span>{new Date(historia.fecha_creacion).toLocaleDateString('es-AR')}</span>
                      </label>
                      <label className="destacado-portada-label">
                        <input
                          className="destacado-portada-radio"
                          type="radio"
                          name="portada-destacado"
                          checked={portada === idHistoria}
                          disabled={!seleccionada}
                          onChange={() => setPortada(idHistoria)}
                        />
                        Portada
                      </label>
                    </div>
                  );
                })}
              </div>
              <p className="destacado-ayuda">Seleccioná el círculo de la derecha para elegir la portada.</p>
              {error && <p className="destacados-error" role="alert">{error}</p>}
              <button className="destacado-guardar-btn" type="submit" disabled={guardando || !historias.length}>
                {guardando ? 'Guardando...' : 'Crear destacado'}
              </button>
            </form>
          </section>
        </div>
      )}

      {grupoAbierto && (
        <div className="destacado-overlay" onClick={() => setGrupoAbierto(null)}>
          <section
            className="destacado-dialogo destacado-vista"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destacado-vista-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="destacado-cerrar" type="button" onClick={() => setGrupoAbierto(null)} aria-label="Cerrar">×</button>
            <h2 id="destacado-vista-titulo">{grupoAbierto.nombre}</h2>
            <div className="destacado-vista-grid">
              {grupoAbierto.historias.map((historia) => (
                <img
                  key={historia.id_historia}
                  src={imagenUrl(historia.imagen_url)}
                  alt={`Historia del ${new Date(historia.fecha_creacion).toLocaleDateString('es-AR')}`}
                />
              ))}
            </div>
            {esPropio && (
              <button type="button" className="destacado-eliminar-btn" onClick={eliminarGrupo}>
                Eliminar destacado
              </button>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
