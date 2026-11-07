import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './perfil_propio.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import ModalSeguimiento from "../../paginas/modal_seguimiento/modal_seguimiento";
import { CrearHistoria } from "../crear_historia/crear_historia";
const API_URL = "http://localhost:3000";

function PerfilPropio() {
  const navigate = useNavigate();
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');

  const [modalSeguimiento, setModalSeguimiento] = useState(null);
  const [mostrarCrearHistoria, setMostrarCrearHistoria] = useState(false);

  const token = localStorage.getItem('token');


    // OBTENER URL DE IMAGEN
  const obtenerImagen = (imagen) => {
    if (!imagen) {
      return "";
    }

    if (
      imagen.startsWith("http") ||
      imagen.startsWith("blob:") ||
      imagen.startsWith("data:")
    ) {
      return imagen;
    }

    return `${API_URL}${imagen}`;
  };

  const [usuarioSesion, setUsuarioSesion] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || {};
    } catch {
      return {};
    }
  });

  const nombreMostrar =
    `${usuarioSesion.nombre || ''} ${usuarioSesion.apellido || ''}`.trim()
    || usuarioSesion.username
    || 'Mi Usuario';

  const usuarioTag = usuarioSesion.username
    ? `@${usuarioSesion.username.replace('@', '')}`
    : '@usuario';

  const descripcionMostrar = usuarioSesion.descripcion || '';
  const fotoPerfil = usuarioSesion.foto_perfil || null;
  const bannerImg = usuarioSesion.banner || null;

  const [listaPublicaciones, setListaPublicaciones] = useState([]);
  const [publicacionesFavoritas, setPublicacionesFavoritas] = useState([]);

  const [seguidores, setSeguidores] = useState(0);
  const [seguidos, setSeguidos] = useState(0);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [publicando, setPublicando] = useState(false);

  const [busquedaMusica, setBusquedaMusica] = useState('');
  const [resultadosMusica, setResultadosMusica] = useState([]);
  const [musicaSeleccionada, setMusicaSeleccionada] = useState(null);
  const [buscandoMusica, setBuscandoMusica] = useState(false);

  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [resultadosUsuarios, setResultadosUsuarios] = useState([]);
  const [usuariosEtiquetados, setUsuariosEtiquetados] = useState([]);
  const [buscandoUsuarios, setBuscandoUsuarios] = useState(false);

  const buscarUsuario = async (texto) => {
    setBusquedaUsuario(texto);

    if (!texto.trim()) {
      setResultadosUsuarios([]);
      return;
    }

    try {
      setBuscandoUsuarios(true);

      const response = await fetch(
        `http://localhost:3000/api/usuarios/buscar?q=${encodeURIComponent(texto)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'No se pudieron buscar usuarios');
      }

      // Evitar mostrar usuarios que ya fueron seleccionados
      const usuariosDisponibles = (data.usuarios || []).filter(
        usuario =>
          !usuariosEtiquetados.some(
            seleccionado =>
              seleccionado.id_usuario === usuario.id_usuario
          )
      );

      setResultadosUsuarios(usuariosDisponibles);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      setResultadosUsuarios([]);
    } finally {
      setBuscandoUsuarios(false);
    }
  };

  const buscarMusica = async (texto) => {
    setBusquedaMusica(texto);
    setMusicaSeleccionada(null);
    setResultadosMusica([]);

    if (!texto.trim()) {
      setBuscandoMusica(false);
      return;
    }

    try {
      setBuscandoMusica(true);

      const response = await fetch(
        `${API_URL}/api/publicaciones/buscar-canciones?q=${encodeURIComponent(texto.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo buscar música');
      }

      // Evita mostrar resultados de una búsqueda anterior
      if (texto === busquedaMusica || texto.trim()) {
        setResultadosMusica(data);
      }
    } catch (error) {
      console.error('Error al buscar canciones:', error);
      setResultadosMusica([]);
    } finally {
      setBuscandoMusica(false);
    }
  };

  // Obtener la cantidad de likes de una publicación
  const obtenerCantidadLikes = async (idPublicacion, token) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/publicaciones/${idPublicacion}/likes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return Number(data.totalLikes) || 0;
    } catch (error) {
      console.error('Error al consultar los likes:', error);
      return 0;
    }
  };

  // Cargar los datos actualizados del perfil
  useEffect(() => {

    fetch('http://localhost:3000/api/usuarios/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo obtener el perfil');
        }
        return res.json();
      })
      .then((datos) => {
        console.log("Datos recibidos del perfil:", datos);

        const usuarioReal = datos?.usuario || datos;
        console.log("Foto recibida:", usuarioReal.foto_perfil);
        console.log("Usuario completo:", usuarioReal);

        if (usuarioReal && (usuarioReal.id_usuario || usuarioReal.id)) {
          setUsuarioSesion(usuarioReal);
          localStorage.setItem('usuario', JSON.stringify(usuarioReal));
        }
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
      });
  }, []);

  // Cargar estadísticas de seguidores y seguidos
  useEffect(() => {
    const idUsuario = usuarioSesion?.id_usuario || usuarioSesion?.id;

    if (!idUsuario || !token) return;

    const cargarEstadisticas = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/usuarios/${idUsuario}/estadisticas-seguimiento`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('No se pudieron cargar las estadísticas');
        }

        const datos = await response.json();

        setSeguidores(Number(datos.seguidores) || 0);
        setSeguidos(Number(datos.seguidos) || 0);

      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    cargarEstadisticas();
  }, [usuarioSesion?.id_usuario, usuarioSesion?.id, token]);

  // Cargar publicaciones favoritas
  useEffect(() => {
    const idUsuarioActual =
      usuarioSesion?.id_usuario || usuarioSesion?.id;

    if (pestanaActiva !== 'favoritos' || !idUsuarioActual) return;

    const cargarFavoritos = async () => {
      try {

        const response = await fetch(
          `http://localhost:3000/api/publicaciones/favoritos/usuario/${idUsuarioActual}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('No se pudieron cargar los favoritos');
        }

        const data = await response.json();

        // Aceptar tanto una lista directa como una respuesta con propiedad favoritos
        const favoritos = Array.isArray(data)
          ? data
          : data.favoritos || data.publicaciones || [];

        const favoritosOrdenados = [...favoritos].sort(
          (a, b) =>
            new Date(b.fecha_guardado).getTime() -
            new Date(a.fecha_guardado).getTime()
        );

        setPublicacionesFavoritas(favoritosOrdenados);
        
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    };

    cargarFavoritos();
  }, [
    pestanaActiva,
    usuarioSesion?.id_usuario,
    usuarioSesion?.id
  ]);

  // Cargar las publicaciones propias desde el backend
  useEffect(() => {
    const idUsuario = usuarioSesion?.id_usuario || usuarioSesion?.id;

    if (!idUsuario) return;

    const cargarPublicaciones = async () => {
      try {

        const response = await fetch(
          'http://localhost:3000/api/publicaciones',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('No se pudieron cargar las publicaciones');
        }

        const data = await response.json();

        const publicacionesPropias = data.filter(
          (post) => Number(post.id_usuario) === Number(idUsuario)
        );

        const propias = await Promise.all(
          publicacionesPropias.map(async (post) => ({
            id: post.id_publicacion,
            ruta: `/publicacion/${post.id_publicacion}`,
            img: post.imagen_url
              ? `http://localhost:3000${post.imagen_url}`
              : '',
            likes: await obtenerCantidadLikes(post.id_publicacion, token),
            esFavorito: false,
            descripcion: post.descripcion || ''
          }))
        );

        setListaPublicaciones(propias);
      } catch (error) {
        console.error('Error al cargar publicaciones:', error);
      }
    };

    cargarPublicaciones();
  }, [usuarioSesion?.id_usuario, usuarioSesion?.id]);

  // Seleccionar una sola imagen
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Seleccioná un archivo de imagen válido.');
      e.target.value = '';
      return;
    }

    setImagenArchivo(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagenPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Crear una publicación para el feed
  const handleCrearPublicacion = async (e) => {
    e.preventDefault();

    if (publicando) return;

    if (!imagenArchivo || !imagenPreview) {
      alert('Por favor seleccioná una foto.');
      return;
    }

    const idUsuario = usuarioSesion?.id_usuario || usuarioSesion?.id;

    if (!idUsuario) {
      alert('No se encontró el usuario de la sesión. Volvé a iniciar sesión.');
      return;
    }

    if (!token) {
      alert('Tu sesión expiró. Volvé a iniciar sesión.');
      return;
    }

    try {
      setPublicando(true);

      const formData = new FormData();
      formData.append('imagen', imagenArchivo);
      formData.append('id_usuario', String(idUsuario));
      formData.append('descripcion', descripcion);

      formData.append(
        'usuariosEtiquetados',
        JSON.stringify(usuariosEtiquetados.map(usuario => usuario.id_usuario))
      );

      formData.append('musica_url', musicaSeleccionada?.url || '');
      formData.append('musica_titulo', musicaSeleccionada?.titulo || '');
      formData.append('musica_artista', musicaSeleccionada?.artista || '');
      formData.append('musica_imagen', musicaSeleccionada?.imagen || '');

      const response = await fetch(
        'http://localhost:3000/api/publicaciones',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detalle ||
          data.error ||
          data.mensaje ||
          'No se pudo crear la publicación'
        );
      }

      // Recargar las publicaciones desde la base de datos
      const respuestaPublicaciones = await fetch(
        'http://localhost:3000/api/publicaciones',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (respuestaPublicaciones.ok) {
        const publicaciones = await respuestaPublicaciones.json();

        const propias = publicaciones.filter(
          (post) => Number(post.id_usuario) === Number(idUsuario)
        );

        const postsFormateados = await Promise.all(
          propias.map(async (post) => ({
            id: post.id_publicacion,
            ruta: `/publicacion/${post.id_publicacion}`,
            img: post.imagen_url
              ? `http://localhost:3000${post.imagen_url}`
              : '',
            likes: await obtenerCantidadLikes(post.id_publicacion, token),
            esFavorito: false,
            descripcion: post.descripcion || ''
          }))
        );

        setListaPublicaciones(postsFormateados);
      } else if (data.id_publicacion) {
        setListaPublicaciones((prev) => [
          {
            id: data.id_publicacion,
            ruta: `/publicacion/${data.id_publicacion}`,
            img: data.imagen_url
              ? `http://localhost:3000${data.imagen_url}`
              : '',
            likes: 0,
            esFavorito: false,
            descripcion: data.descripcion || descripcion
          },
          ...prev
        ]);
      }

      setImagenArchivo(null);
      setImagenPreview('');
      setDescripcion('');

      setBusquedaUsuario('');
      setResultadosUsuarios([]);
      setUsuariosEtiquetados([]);

      setMostrarModal(false);
      setBusquedaMusica('');
      setResultadosMusica([]);
      setMusicaSeleccionada(null);

      alert('¡Tu publicación se creó con éxito!');
    } catch (error) {
      console.error('Error al crear publicación:', error);
      alert(`No se pudo publicar: ${error.message}`);
    } finally {
      setPublicando(false);
    }
  };

  const cerrarModal = () => {
    if (publicando) return;

    setMostrarModal(false);
    setImagenArchivo(null);
    setImagenPreview('');
    setDescripcion('');
    setBusquedaMusica('');
    setResultadosMusica([]);
    setMusicaSeleccionada(null);

      setBusquedaUsuario('');
      setResultadosUsuarios([]);
      setUsuariosEtiquetados([]);

  };

  return (
    <div className="pagina-perfil">
      <Header />

      <main className="contenido">
        <section className="tarjeta-perfil">
          <div
            className="portada"
            style={{
              backgroundImage: bannerImg
                  ? `url("${obtenerImagen(bannerImg)}")`
                  : 'linear-gradient(135deg, #f8eaf1 0%, #e9cbdc 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!bannerImg && (
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b5274"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.35 }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          <div className="datos-perfil">
            <button
              type="button"
              className="avatar avatar-clickable"
              style={{ backgroundColor: '#f3e8ee' }}
              onClick={() => setMostrarCrearHistoria(true)}
              aria-label="Crear una historia"
              title="Crear una historia"
            >
              {fotoPerfil ? (<img
                src={obtenerImagen(fotoPerfil)}
                alt={`Avatar de ${nombreMostrar}`}
              />
              ) : (
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8b5274"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            <div className="nombre-y-descripcion">
              <h1>{nombreMostrar}</h1>
              <p className="usuario">{usuarioTag}</p>
              {descripcionMostrar && (
                <p className="descripcion">{descripcionMostrar}</p>
              )}
            </div>

            <div className="estadisticas">
              <div>
                <strong>{listaPublicaciones.length}</strong>
                <span>Publicaciones</span>
              </div>

              <button
                  type="button"
                  className="estadistica-seguimiento"
                  onClick={() => setModalSeguimiento('seguidores')}
              >
                  <strong>{seguidores}</strong>
                  <span>Seguidores</span>
              </button>

              <button
                  type="button"
                  className="estadistica-seguimiento"
                  onClick={() => setModalSeguimiento('seguidos')}
              >
                  <strong>{seguidos}</strong>
                  <span>Siguiendo</span>
              </button>

              <div className="botones">
                <button
                  className="btn-editar"
                  onClick={() => navigate('/editar_perfil')}
                >
                  Editar Perfil
                </button>

                <button
                  className="btn-tienda"
                  onClick={() => navigate('/miTienda')}
                >
                  Mi Tienda
                </button>

                <button
                  className="btn-cargar"
                  onClick={() => setMostrarModal(true)}
                >
                  + Publicar
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="pestanas">
          <button
            className={pestanaActiva === 'publicaciones' ? 'activa' : ''}
            onClick={() => setPestanaActiva('publicaciones')}
          >
            Publicaciones
          </button>

          <button
            className={pestanaActiva === 'favoritos' ? 'activa' : ''}
            onClick={() => setPestanaActiva('favoritos')}
          >
            Favoritos
          </button>
        </div>

        <section className="grid-publicaciones">
          {pestanaActiva === 'publicaciones' && (
            listaPublicaciones.length === 0 ? (
              <p className="sin-contenido">
                No tenés publicaciones cargadas aún. ¡Hacé clic en '+ Publicar'
                para subir tu primer outfit! 
              </p>
            ) : (
              listaPublicaciones.map((post) => (
                <button
                  key={post.id}
                  className="post"
                  type="button"
                  onClick={() => navigate(`/publicacion/${post.id}`, { state: { desdePerfilPropio: true } })}
                >
                  <div className="foto-post">
                    <img
                      src={post.img}
                      alt={`Publicación ${post.id}`}
                    />
                  </div>

                  <div className="pie-post">
                    <span>♡ {post.likes}</span>
                  </div>
                </button>
              ))
            )
          )}

          {pestanaActiva === 'favoritos' && (
            publicacionesFavoritas.length === 0 ? (
              <p className="sin-contenido">
                No tenés publicaciones guardadas en favoritos todavía.
              </p>
            ) : (
              publicacionesFavoritas.map((fav) => {
                const idPost = fav.id_publicacion || fav.id;

                const postOriginal = listaPublicaciones.find(
                  (post) => String(post.id) === String(idPost)
                );

                const imgAMostrar =
                  postOriginal?.img ||
                  (fav.imagen_url
                    ? `http://localhost:3000${fav.imagen_url}`
                    : '');

                const likesAMostrar = postOriginal?.likes || 0;

                return (
                  <button
                    key={fav.id_favorito || idPost}
                    className="post"
                    type="button"
                    onClick={() => navigate(`/publicacion/${idPost}`, { state: { desdePerfilPropio: true } })}
                  >
                    <div className="foto-post">
                      <img
                        src={imgAMostrar}
                        alt={`Publicación ${idPost}`}
                      />
                    </div>

                    <div className="pie-post">
                      <span>♡ {likesAMostrar}</span>
                    </div>
                  </button>
                );
              })
            )
          )}
        </section>
      </main>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2>Crear publicación</h2>

            <form onSubmit={handleCrearPublicacion}>
              <div className="form-grupo">
                <label>Subí una foto de tu look:</label>

                <div className="upload-container">
                  <label className="btn-upload">
                    <span>🗁 Seleccionar archivo</span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {imagenPreview && (
                    <div className="preview-container">
                      <img src={imagenPreview} alt="Vista previa" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-grupo">
                <label>Descripción:</label>

                <textarea
                  placeholder="Contanos más sobre tu look..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  rows="3"
                  className="modal-textarea"
                />
              </div>

              <div className="form-grupo">
                <label>Etiquetar usuarios (opcional):</label>

                <input
                  type="text"
                  placeholder="Buscá por nombre de usuario..."
                  value={busquedaUsuario}
                  onChange={(e) => buscarUsuario(e.target.value)}
                />

                {buscandoUsuarios && <p>Buscando usuarios...</p>}

                {resultadosUsuarios.length > 0 && (
                  <div className="resultados-usuarios">
                    {resultadosUsuarios.map((usuario) => (
                      <button
                        key={usuario.id_usuario}
                        type="button"
                        className="resultado-usuario"
                        onClick={() => {
                          setUsuariosEtiquetados((prev) => [...prev, usuario]);
                          setResultadosUsuarios([]);
                          setBusquedaUsuario('');
                        }}
                      >
                        <div className="usuario-info">
                          <div className="usuario-foto">
                            {usuario.foto_perfil ? (
                              <img
                                src={
                                  usuario.foto_perfil.startsWith("http")
                                    ? usuario.foto_perfil
                                    : `http://localhost:3000${usuario.foto_perfil}`
                                }
                                alt=""
                                className="usuario-foto-img"
                              />
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#8b5274"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            )}
                          </div>

                          <strong>@{usuario.username}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {usuariosEtiquetados.length > 0 && (
                  <div className="usuarios-seleccionados">
                    <p>Usuarios etiquetados:</p>

                    {usuariosEtiquetados.map((usuario) => (
                      <div key={usuario.id_usuario} className="usuario-seleccionado">
                        <span>@{usuario.username}</span>

                        <button
                          type="button"
                          onClick={() => {
                            setUsuariosEtiquetados((prev) =>
                              prev.filter(
                                (u) => u.id_usuario !== usuario.id_usuario
                              )
                            );
                          }}
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-grupo buscador-musica">
                <label> Agregar una canción (opcional)</label>

                <input
                  type="text"
                  placeholder="Buscá por título o artista..."
                  value={busquedaMusica}
                  onChange={(e) => buscarMusica(e.target.value)}
                />

                {buscandoMusica && (
                  <p>Buscando canciones...</p>
                )}

                {resultadosMusica.length > 0 && !musicaSeleccionada && (
                  <div className="resultados-musica">
                    {resultadosMusica.map((cancion) => (
                      <button
                        key={cancion.videoId}
                        type="button"
                        className="resultado-cancion"
                        onClick={() => {
                          setMusicaSeleccionada(cancion);
                          setBusquedaMusica(cancion.titulo);
                          setResultadosMusica([]);
                        }}
                      >
                        {cancion.imagen && (
                          <img
                            src={cancion.imagen}
                            alt=""
                            width="80"
                          />
                        )}

                        <span>
                          <strong>{cancion.titulo}</strong>
                          <small>{cancion.artista}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {musicaSeleccionada && (
                  <div className="cancion-seleccionada">
                    <p>
                      Canción elegida: <strong>{musicaSeleccionada.titulo}</strong>
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setMusicaSeleccionada(null);
                        setBusquedaMusica('');
                        setResultadosMusica([]);
                      }}
                    >
                      Cambiar canción
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-acciones">
                <button
                  type="button"
                  className="btn-cancelar-modal"
                  onClick={cerrarModal}
                  disabled={publicando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-publicar-modal"
                  disabled={publicando}
                >
                  {publicando ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />

      {modalSeguimiento && (
          <ModalSeguimiento
              idUsuario={usuarioSesion?.id_usuario || usuarioSesion?.id}
              pestanaInicial={modalSeguimiento}
              onCerrar={() => setModalSeguimiento(null)}
              onSeleccionarUsuario={(id) => {
                  setModalSeguimiento(null);
                  navigate(`/perfil_usuario/${id}`);
              }}
          />
      )}

      {mostrarCrearHistoria && (
        <CrearHistoria onVolver={() => setMostrarCrearHistoria(false)} />
      )}

    </div>
  );
}

export default PerfilPropio;