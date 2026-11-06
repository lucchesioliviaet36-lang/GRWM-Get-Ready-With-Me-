import './pagina_principal.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';
import { CrearHistoria } from '../crear_historia/crear_historia';

const API_URL = 'http://localhost:3000';

export default function Feed() {
  const navigate = useNavigate();
  const DURACION_HISTORIA = 10000;
  const INTERVALO_BARRA = 100;
  const [siguiendo, setSiguiendo] = useState({});
  const [likes, setLikes] = useState({});
  const [guardados, setGuardados] = useState({});
  const [corazonGrande, setCorazonGrande] = useState(null);
  const [historiaActiva, setHistoriaActiva] = useState(null);
  const [historiasDelVisor, setHistoriasDelVisor] = useState([]);
  const [comentario, setComentario] = useState('');
  const [liked, setLiked] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorPublicaciones, setErrorPublicaciones] = useState('');
  const [historias, setHistorias] = useState([]);
  const [cargandoHistorias, setCargandoHistorias] = useState(true);
  const [errorHistorias, setErrorHistorias] = useState('');
  const [pausado, setPaused] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [indiceActual, setIndiceActual] = useState(0);
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
    const foto = usuarioGuardado?.foto_perfil;

    if (!foto) return null;
    if (foto.startsWith('http')) return foto;

    return `${API_URL}${foto}`;
  };

  const fotoPerfilHeader = obtenerFotoPerfil();

  const obtenerAvatarUsuario = (fotoPerfil) => {
    if (!fotoPerfil) return `${API_URL}/uploads/default-avatar.png`;
    if (fotoPerfil.startsWith('http')) return fotoPerfil;
    return `${API_URL}/${fotoPerfil.replace(/^\/+/, '')}`;
  };

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
    if (historiasDelVisor.length > 0 && indiceActual < historiasDelVisor.length - 1) {
      const siguienteIndex = indiceActual + 1;
      setIndiceActual(siguienteIndex);
      setHistoriaActiva(historiasDelVisor[siguienteIndex]);
      tiempoRestanteHistoria.current = DURACION_HISTORIA;
      setProgreso(0);
      setLiked(false);
      setComentario('');
    } else {
      cerrarHistoria();
    }
  }, [historiasDelVisor, indiceActual, cerrarHistoria]);

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
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        if (!res.ok) {
          throw new Error(data?.error || data?.message || `Error al cargar publicaciones (${res.status})`);
        }

        return data;
      })
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setPublicaciones(data);
        } else if (data.publicaciones && Array.isArray(data.publicaciones)) {
          setPublicaciones(data.publicaciones);
        } else {
          throw new Error('El servidor devolvió un formato de publicaciones no válido.');
        }

      })
      .catch((err) => {
        console.error('Error al conectar con el backend:', err);
        setErrorPublicaciones(err.message || 'No se pudieron cargar las publicaciones.');
      })
      .finally(() => {
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

  const abrirHistoria = (historia, index = 0, grupoHistorias = historias) => {
    if (!historia) return;

    setHistoriasDelVisor(grupoHistorias);
    setHistoriaActiva(historia);
    setIndiceActual(index);
    tiempoRestanteHistoria.current = DURACION_HISTORIA;
    setProgreso(0);
    setPaused(false);
    setLiked(false);
    setComentario('');
  };

  const anteriorHistoria = () => {
    if (historiasDelVisor.length > 0 && indiceActual > 0) {
      const anteriorIndex = indiceActual - 1;
      setIndiceActual(anteriorIndex);
      setHistoriaActiva(historiasDelVisor[anteriorIndex]);
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

  const miId = usuarioGuardado?.id_usuario ?? usuarioGuardado?.id ?? usuarioGuardado?.user_id ?? null;
  const miUsername = usuarioGuardado?.username?.replace(/^@/, '').toLowerCase();
  const gruposHistorias = Array.from(
    historias.reduce((grupos, historia) => {
      const username = historia.usuario?.toLowerCase();
      const clave = historia.id_usuario != null
        ? `id:${historia.id_usuario}`
        : `username:${username || historia.usuario}`;
      const grupo = grupos.get(clave) || {
        historias: [],
        usuario: historia.usuario,
        foto_perfil: historia.foto_perfil
      };
      grupo.historias.push(historia);
      if (!grupo.foto_perfil && historia.foto_perfil) {
        grupo.foto_perfil = historia.foto_perfil;
      }
      grupos.set(clave, grupo);
      return grupos;
    }, new Map()).values()
  );
  const esMiGrupoHistoria = (grupo) => {
    const historia = grupo.historias[0];
    const coincideId = miId != null && Number(historia.id_usuario) === Number(miId);
    const coincideUsername = miUsername
      && grupo.usuario?.replace(/^@/, '').toLowerCase() === miUsername;
    return Boolean(coincideId || coincideUsername);
  };
  const miGrupoHistoria = gruposHistorias.find(esMiGrupoHistoria);
  const tieneMiHistoria = Boolean(miGrupoHistoria);
  const historiaActivaEsPropia = Boolean(historiaActiva && (
    (miId != null && Number(historiaActiva.id_usuario) === Number(miId))
    || (miUsername && historiaActiva.usuario?.replace(/^@/, '').toLowerCase() === miUsername)
  ));
  const fotoPerfilHistoriaActiva = historiaActivaEsPropia
    ? obtenerAvatarUsuario(fotoPerfilHeader || miGrupoHistoria?.foto_perfil)
    : obtenerAvatarUsuario(historiaActiva?.foto_perfil);

  const handleHistoriaCreada = (historia) => {
    const historiaNueva = {
      ...historia,
      usuario: historia.usuario || usuarioGuardado?.username || 'Tu historia',
    };

    setHistorias((actuales) => [
      historiaNueva,
      ...actuales.filter((actual) => (actual.id_historia || actual.id) !== (historiaNueva.id_historia || historiaNueva.id)),
    ]);
    setHistoriasDelVisor([historiaNueva]);
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
                  if (miGrupoHistoria) {
                    abrirHistoria(miGrupoHistoria.historias[0], 0, miGrupoHistoria.historias);
                  } else {
                    setMostrarCrearHistoria(true);
                  }
                }}
              >
                <div className="avatar-ring user-story">
                  <img
                    src={obtenerAvatarUsuario(fotoPerfilHeader || miGrupoHistoria?.foto_perfil)}
                    alt="Tu historia"
                  />

                  {!tieneMiHistoria && <span className="badge-mas">+</span>}
                </div>
                <span>Tu historia</span>
              </div>

              {gruposHistorias
                .filter((grupo) => !esMiGrupoHistoria(grupo))
                .map((grupo) => {
                  const historia = grupo.historias[0];
                  const historiaId = historia.id_usuario ?? historia.id_historia ?? historia.id;

                  return (
                    <div
                      className="story-item"
                      key={historiaId}
                      onClick={() => abrirHistoria(historia, 0, grupo.historias)}
                    >
                      <div className="avatar-ring">
                        <img
                          src={obtenerAvatarUsuario(grupo.foto_perfil)}
                          alt={historia.usuario || 'Historia'}
                        />
                      </div>
                      <span>{historia.usuario || `Usuario #${historia.id_usuario}`}</span>
                    </div>
                  );
                })}
            </section>

            <section className="posts-grid" aria-label="Publicaciones">
              {cargando && <p className="posts-status">Cargando publicaciones...</p>}
              {errorPublicaciones && (
                <p className="posts-status posts-error" role="alert">{errorPublicaciones}</p>
              )}
              {!cargando && !errorPublicaciones && publicaciones.length === 0 && (
                <p className="posts-status">Todavía no hay publicaciones.</p>
              )}
              {!errorPublicaciones && publicaciones.map((publicacion) => {
                const publicacionId = publicacion.id_publicacion || publicacion.id;
                const autor = publicacion.usuario;
                const imagenAutor = autor?.foto_perfil
                  ? obtenerImagenHistoria(autor.foto_perfil)
                  : `${API_URL}/uploads/default-avatar.png`;

                return (
                  <article className="post-card" key={publicacionId}>
                    <div className="post-header">
                      <div className="user-info">
                        <img className="user-avatar" src={imagenAutor} alt="" />
                        <strong>{autor?.username || `Usuario #${publicacion.id_usuario}`}</strong>
                      </div>
                    </div>
                    {publicacion.imagen_url ? (
                      <button
                        type="button"
                        className="image-container"
                        onClick={() => navigate(`/publicacion/${publicacionId}`)}
                        aria-label={`Ver publicación de ${autor?.username || 'un usuario'}`}
                      >
                        <img
                          src={obtenerImagenHistoria(publicacion.imagen_url)}
                          alt={publicacion.descripcion || 'Imagen de la publicación'}
                        />
                      </button>
                    ) : (
                      <div className="post-no-image">Esta publicación no tiene imagen.</div>
                    )}
                    <p className="post-description">
                      {publicacion.descripcion || 'Sin descripción'}
                    </p>
                    {publicacion.musica_titulo && (
                      <p className="post-music">
                        {publicacion.musica_titulo}
                        {publicacion.musica_artista && ` · ${publicacion.musica_artista}`}
                      </p>
                    )}
                  </article>
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
                    {historiaActivaEsPropia || !historiaActiva.id_usuario ? (
                      <img
                        src={fotoPerfilHistoriaActiva}
                        alt={historiaActivaEsPropia ? 'Tu foto de perfil' : (historiaActiva.usuario || 'Historia')}
                        className="story-header-avatar"
                      />
                    ) : (
                      <button
                        type="button"
                        className="story-header-avatar-button"
                        onClick={() => navigate(`/perfil_usuario/${historiaActiva.id_usuario}`)}
                        aria-label={`Ver perfil de ${historiaActiva.usuario || 'este usuario'}`}
                      >
                        <img
                          src={fotoPerfilHistoriaActiva}
                          alt=""
                          className="story-header-avatar"
                        />
                      </button>
                    )}
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
