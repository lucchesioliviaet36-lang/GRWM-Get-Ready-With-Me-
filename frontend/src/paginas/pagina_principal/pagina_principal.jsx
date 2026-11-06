import './pagina_principal.css';
import { useState, useEffect, useCallback, useRef } from 'react';

import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';
import { CrearHistoria } from '../crear_historia/crear_historia';

const API_URL = 'http://localhost:3000';

export default function Feed() {
  const DURACION_HISTORIA = 10000;
  const INTERVALO_BARRA = 100;
  const [siguiendo, setSiguiendo] = useState({});
  const [likes, setLikes] = useState({});
  const [guardados, setGuardados] = useState({});
  const [corazonGrande, setCorazonGrande] = useState(null);
  const [historiaActiva, setHistoriaActiva] = useState(null);
  const [comentario, setComentario] = useState('');
  const [liked, setLiked] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [historias, setHistorias] = useState([]);
  const [cargandoHistorias, setCargandoHistorias] = useState(true);
  const [errorHistorias, setErrorHistorias] = useState('');
  const [pausado, setPaused] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [usuarioGuardado, setUsuarioGuardado] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || {};
    } catch (error) {
      return {};
    }
  });
  const [mostrarCrearHistoria, setMostrarCrearHistoria] = useState(false);
  const clickHistoriaTimer = useRef(null);
  const mantenerPresionadoTimer = useRef(null);
  const mantenerPresionado = useRef(false);
  const ignorarClickDespuesDePausa = useRef(false);
  const tiempoRestanteHistoria = useRef(DURACION_HISTORIA);

  const obtenerFotoPerfil = () => {
    const foto = usuario?.foto_perfil || usuarioGuardado?.foto_perfil;

    if (!foto) return null;
    if (foto.startsWith('http')) return foto;

    return `${API_URL}${foto}`;
  };

  const fotoPerfilHeader = obtenerFotoPerfil();

  const obtenerImagenHistoria = (imagenUrl) => {
    if (!imagenUrl) {
      return 'http://localhost:3000/uploads/default-story.png';
    }

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    return `${API_URL}/${imagenUrl.replace(/^\/+/, '')}`;
  };

  const cerrarHistoria = useCallback(() => {
    setHistoriaActiva(null);
    setProgreso(0);
    setPaused(false);
  }, []);

  const siguienteHistoria = useCallback(() => {
    if (historias.length > 0 && indiceActual < historias.length - 1) {
      const siguienteIndex = indiceActual + 1;
      setIndiceActual(siguienteIndex);
      setHistoriaActiva(historias[siguienteIndex]);
      tiempoRestanteHistoria.current = DURACION_HISTORIA;
      setProgreso(0);
      setLiked(false);
      setComentario('');
    } else {
      cerrarHistoria();
    }
  }, [historias, indiceActual, cerrarHistoria]);

  const cargarHistorias = () => {
    const token = localStorage.getItem('token');
    setCargandoHistorias(true);
    setErrorHistorias('');

    fetch(`${API_URL}/api/historias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then(async (res) => {
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (!res.ok) {
          throw new Error(data?.error || data?.message || `Error al cargar historias (${res.status})`);
        }
        return data;
      })
      .then((data) => {
        console.log('Historias que llegaron del backend:', data);

        if (Array.isArray(data)) {
          setHistorias(data);
        } else if (data && Array.isArray(data.historias)) {
          setHistorias(data.historias);
        } else {
          throw new Error('El servidor devolvió un formato de historias no válido.');
        }
      })
      .catch((err) => {
        console.error('Error al conectar con el backend para historias:', err);
        setErrorHistorias(err.message || 'No se pudieron cargar las historias.');
      })
      .finally(() => {
        setCargandoHistorias(false);
      });
  };

  useEffect(() => {
    cargarHistorias();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/publicaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setPublicaciones(data);
        } else if (data.publicaciones && Array.isArray(data.publicaciones)) {
          setPublicaciones(data.publicaciones);
        } else {
          setPublicaciones([]);
        }

        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al conectar con el backend:', err);
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    if (!historiaActiva || pausado) return;

    const timerProgreso = setInterval(() => {
      tiempoRestanteHistoria.current = Math.max(
        0,
        tiempoRestanteHistoria.current - INTERVALO_BARRA
      );
      setProgreso(100 - (tiempoRestanteHistoria.current / DURACION_HISTORIA) * 100);

      if (tiempoRestanteHistoria.current === 0) {
        siguienteHistoria();
      }
    }, INTERVALO_BARRA);

    return () => clearInterval(timerProgreso);
  }, [historiaActiva, indiceActual, pausado, siguienteHistoria]);

  const abrirHistoria = (historia, index = 0) => {
    if (!historia) return;

    setHistoriaActiva(historia);
    setIndiceActual(index);
    tiempoRestanteHistoria.current = DURACION_HISTORIA;
    setProgreso(0);
    setPaused(false);
    setLiked(false);
    setComentario('');
  };

  const anteriorHistoria = () => {
    if (historias.length > 0 && indiceActual > 0) {
      const anteriorIndex = indiceActual - 1;
      setIndiceActual(anteriorIndex);
      setHistoriaActiva(historias[anteriorIndex]);
      tiempoRestanteHistoria.current = DURACION_HISTORIA;
      setProgreso(0);
      setLiked(false);
      setComentario('');
    }
  };

  const manejarToqueHistoria = () => {
    if (ignorarClickDespuesDePausa.current) {
      ignorarClickDespuesDePausa.current = false;
      return;
    }

    if (clickHistoriaTimer.current) {
      clearTimeout(clickHistoriaTimer.current);
      clickHistoriaTimer.current = null;
      anteriorHistoria();
      return;
    }

    clickHistoriaTimer.current = setTimeout(() => {
      clickHistoriaTimer.current = null;
      tiempoRestanteHistoria.current = DURACION_HISTORIA;
      setProgreso(0);
    }, 250);
  };

  const iniciarMantenerPresionado = (event) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    mantenerPresionado.current = false;
    mantenerPresionadoTimer.current = setTimeout(() => {
      mantenerPresionado.current = true;
      setPaused(true);
    }, 350);
  };

  const terminarMantenerPresionado = () => {
    if (mantenerPresionadoTimer.current) {
      clearTimeout(mantenerPresionadoTimer.current);
      mantenerPresionadoTimer.current = null;
    }

    if (mantenerPresionado.current) {
      mantenerPresionado.current = false;
      ignorarClickDespuesDePausa.current = true;
      setPaused(false);
    }
  };

  const cancelarMantenerPresionado = () => {
    if (mantenerPresionadoTimer.current) {
      clearTimeout(mantenerPresionadoTimer.current);
      mantenerPresionadoTimer.current = null;
    }

    if (mantenerPresionado.current) {
      mantenerPresionado.current = false;
      setPaused(false);
    }
  };

  useEffect(() => () => {
    if (clickHistoriaTimer.current) clearTimeout(clickHistoriaTimer.current);
    if (mantenerPresionadoTimer.current) clearTimeout(mantenerPresionadoTimer.current);
  }, []);

  const handleEnviarComentario = (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    alert(`Mensaje enviado a ${historiaActiva?.usuario ?? 'usuario'}`);
    setComentario('');
  };

  const sugerencias = [
    {
      nombre: 'Lucía M.',
      handle: 'luciatrends',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'
    },
    {
      nombre: 'Marcos V.',
      handle: 'marcos_fit',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop'
    },
    {
      nombre: 'Sonia Vintage',
      handle: 'sonia_retro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop'
    }
  ];

  const toggleSeguir = (handle) => {
    setSiguiendo((prev) => ({ ...prev, [handle]: !prev[handle] }));
  };

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGuardar = (id) => {
    setGuardados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDobleClic = (id) => {
    setLikes((prev) => ({ ...prev, [id]: true }));
    setCorazonGrande(id);
    setTimeout(() => {
      setCorazonGrande(null);
    }, 900);
  };

  const miId = usuarioGuardado?.id ?? usuarioGuardado?.id_usuario ?? null;
  const tieneMiHistoria = historias.some((historia) => Number(historia.id_usuario) === Number(miId));
  const historiaActivaEsPropia = miId !== null
    && Number(historiaActiva?.id_usuario) === Number(miId);
  const fotoPerfilHistoriaActiva = historiaActivaEsPropia
    ? fotoPerfilHeader || `${API_URL}/uploads/default-avatar.png`
    : obtenerImagenHistoria(historiaActiva?.imagen_url);

  const handleHistoriaCreada = (historia) => {
    const historiaNueva = {
      ...historia,
      usuario: historia.usuario || usuarioGuardado?.username || 'Tu historia',
    };

    setHistorias((actuales) => [
      historiaNueva,
      ...actuales.filter((actual) => (actual.id_historia || actual.id) !== (historiaNueva.id_historia || historiaNueva.id)),
    ]);
    setHistoriaActiva(historiaNueva);
    setIndiceActual(0);
    tiempoRestanteHistoria.current = DURACION_HISTORIA;
    setProgreso(0);
    setPaused(false);
    setLiked(false);
    setComentario('');
    setErrorHistorias('');
    setMostrarCrearHistoria(false);
  };

  return (
    <div className="feed-page">
      <Header />

      <div className="feed-body">
        <aside className="sidebar">
          <div className="card-box">
            <h3>Tendencias para ti</h3>
            <ul className="trends-list">
              <li><span>#OOTDMinimal</span><small>1.2k posts</small></li>
              <li><span>#CottageCore</span><small>1.2k posts</small></li>
              <li><span>#StreetwearSp</span><small>1.2k posts</small></li>
              <li><span>#SecondHandFinds</span><small>1.2k posts</small></li>
              <li><span>#Y2KRevival</span><small>1.2k posts</small></li>
            </ul>
          </div>

          {mostrarCrearHistoria && (
            <CrearHistoria
              onVolver={() => setMostrarCrearHistoria(false)}
              onHistoriaCreada={handleHistoriaCreada}
            />
          )}

          <div className="card-box">
            <h3>Sugerencias</h3>
            <ul className="suggestions-list">
              {sugerencias.map((persona) => (
                <li key={persona.handle}>
                  <img src={persona.avatar} alt={persona.nombre} />
                  <div className="suggestion-info">
                    <strong>{persona.nombre}</strong>
                    <small>@{persona.handle}</small>
                  </div>
                  <button
                    className={`btn-follow ${siguiendo[persona.handle] ? 'siguiendo' : ''}`}
                    onClick={() => toggleSeguir(persona.handle)}
                  >
                    {siguiendo[persona.handle] ? 'Siguiendo' : 'Seguir'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="feed-content">
          <div className="feed-inner">
            <section className="stories-bar">
              {cargandoHistorias && <span className="stories-status">Cargando historias...</span>}
              {errorHistorias && (
                <div className="stories-error" role="alert">
                  <span>{errorHistorias}</span>
                  <button type="button" onClick={cargarHistorias}>Reintentar</button>
                </div>
              )}
              <div
                className="story-item"
                onClick={() => {
                  const miHistoriaIndex = historias.findIndex((historia) => Number(historia.id_usuario) === Number(miId));
                  const miHistoria = historias[miHistoriaIndex];

                  if (miHistoria) {
                    abrirHistoria(miHistoria, miHistoriaIndex);
                  } else {
                    setMostrarCrearHistoria(true);
                  }
                }}
              >
                <div className="avatar-ring user-story">
                  {fotoPerfilHeader ? (
                    <img src={fotoPerfilHeader} alt="Tu historia" />
                  ) : (
                    <img src="http://localhost:3000/uploads/default-avatar.png" alt="Tu historia" />
                  )}

                  {!tieneMiHistoria && <span className="badge-mas">+</span>}
                </div>
                <span>Tu historia</span>
              </div>

              {historias
                .map((historia, index) => {
                  if (Number(historia.id_usuario) === Number(miId)) return null;

                  const historiaId = historia.id_historia || historia.id;

                  return (
                    <div
                      className="story-item"
                      key={historiaId}
                      onClick={() => abrirHistoria(historia, index)}
                    >
                      <div className="avatar-ring">
                        <img
                          src={obtenerImagenHistoria(historia.imagen_url)}
                          alt={historia.usuario || 'Historia'}
                        />
                      </div>
                      <span>{historia.usuario || `Usuario #${historia.id_usuario}`}</span>
                    </div>
                  );
                })}
            </section>

            {historiaActiva && (
              <div className="story-modal-overlay" onClick={() => setHistoriaActiva(null)}>
                <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="story-progress"
                    role="progressbar"
                    aria-label="Tiempo de la historia"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progreso)}
                  >
                    <div className="story-progress-fill" style={{ width: `${progreso}%` }} />
                  </div>
                  <div className="story-header">
                    <img
                      src={fotoPerfilHistoriaActiva}
                      alt={historiaActivaEsPropia ? 'Tu foto de perfil' : (historiaActiva.usuario || 'Historia')}
                      className="story-header-avatar"
                    />
                    <div className="story-header-info">
                      <span>{historiaActiva.usuario || `Usuario #${historiaActiva.id_usuario}`}</span>
                      <time dateTime={historiaActiva.fecha_creacion || undefined}>
                        {historiaActiva.fecha_creacion
                          ? new Date(historiaActiva.fecha_creacion).toLocaleString('es-AR')
                          : ''}
                      </time>
                    </div>
                    <button className="story-close-btn" onClick={() => setHistoriaActiva(null)}>✕</button>
                  </div>

                  <div
                    className="story-body"
                    onClick={manejarToqueHistoria}
                    onPointerDown={iniciarMantenerPresionado}
                    onPointerUp={terminarMantenerPresionado}
                    onPointerCancel={cancelarMantenerPresionado}
                  >
                    <img src={obtenerImagenHistoria(historiaActiva.imagen_url)} alt="Historia" />
                  </div>

                  <div className="story-footer">
                    <form className="story-comment-form" onSubmit={handleEnviarComentario}>
                      <input
                        type="text"
                        placeholder={`Enviar mensaje a ${historiaActiva.usuario || 'usuario'}...`}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                      {comentario.trim() && (
                        <button type="submit" className="story-send-btn">Enviar</button>
                      )}
                    </form>

                    <button
                      className={`story-like-btn ${liked ? 'liked' : ''}`}
                      onClick={() => setLiked(!liked)}
                    >
                      {liked ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="feed-footer">
        <Footer />
      </footer>
    </div>
  );
}
