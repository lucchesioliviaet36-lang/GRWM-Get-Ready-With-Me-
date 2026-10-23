import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './perfil_propio.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
const API_URL = "http://localhost:3000";

function PerfilPropio() {
  const navigate = useNavigate();
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');

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

  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [publicando, setPublicando] = useState(false);

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
    const token = localStorage.getItem('token');
    if (!token) return;

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
        const usuarioReal = datos?.usuario || datos;

        if (usuarioReal && (usuarioReal.id_usuario || usuarioReal.id)) {
          setUsuarioSesion(usuarioReal);
          localStorage.setItem('usuario', JSON.stringify(usuarioReal));
        }
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
      });
  }, []);

  // Cargar publicaciones favoritas
  useEffect(() => {
    const idUsuarioActual =
      usuarioSesion?.id_usuario || usuarioSesion?.id;

    if (pestanaActiva !== 'favoritos' || !idUsuarioActual) return;

    const cargarFavoritos = async () => {
      try {
        const token = localStorage.getItem('token');

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
        const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('token');

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
      setMostrarModal(false);

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
                : 'linear-gradient(135deg, #ebdcd3 0%, #d8c2af 100%)',
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
            <div className="avatar" style={{ backgroundColor: '#f3e8ee' }}>
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
            </div>

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

              <div>
                <strong>0</strong>
                <span>Seguidores</span>
              </div>

              <div>
                <strong>0</strong>
                <span>Siguiendo</span>
              </div>

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
                para subir tu primer outfit! ✨
              </p>
            ) : (
              listaPublicaciones.map((post) => (
                <button
                  key={post.id}
                  className="post"
                  type="button"
                  onClick={() => navigate(`/publicacion/${post.id}`)}
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
                    onClick={() => navigate(`/publicacion/${idPost}`)}
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
    </div>
  );
}

export default PerfilPropio;