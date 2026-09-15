import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import closetPropio1 from '../../assets/imagenes/closetPropio1.jpg'
import closetPropio2 from '../../assets/imagenes/closetPropio2.jpg'
import './perfil_propio.css'
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

// 🛠️ Función auxiliar para validar imágenes almacenadas en localStorage
const obtenerImagenValida = (key) => {
  const val = localStorage.getItem(key);
  if (!val || val === 'null' || val === 'undefined' || val.trim() === '') {
    return null;
  }
  return val;
};

function PerfilPropio() {
  const navigate = useNavigate();
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');

  const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || {};

  const nombreMostrar = usuarioSesion.nombre 
    ? `${usuarioSesion.nombre} ${usuarioSesion.apellido || ''}`.trim() 
    : (usuarioSesion.username || 'Mi Usuario');
    
  const usuarioTag = usuarioSesion.username ? `@${usuarioSesion.username}` : '@usuario';
  const descripcionMostrar = usuarioSesion.descripcion || '';

  // 🖼️ Obtención segura del Banner y Avatar
  const bannerImg = obtenerImagenValida('grwm_banner');
  const fotoPerfil = obtenerImagenValida('grwm_foto_perfil') || usuarioSesion.foto_perfil || null;

  const [listaPublicaciones, setListaPublicaciones] = useState(() => {
    const guardadas = localStorage.getItem('grwm_publicaciones');
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const prendasCloset = [
    { id: 1, img: closetPropio1, nombre: 'Folklore Cardigan', categoria: 'Cardigans' },
    { id: 2, img: closetPropio2, nombre: 'Midnight Cardigan', categoria: 'Cardigans' }
  ];

  const [publicacionesFavoritas, setPublicacionesFavoritas] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [tipoPublicacion, setTipoPublicacion] = useState('feed');
  const [precioPrenda, setPrecioPrenda] = useState('');
  const [nombrePrenda, setNombrePrenda] = useState('');
  const [tallePrenda, setTallePrenda] = useState('M');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    const cargarFavoritosBD = async () => {
      const idUsuarioActual = usuarioSesion?.id_usuario;
      if (!idUsuarioActual) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/publicaciones/favoritos/usuario/${idUsuarioActual}`
        );
        if (response.ok) {
          const data = await response.json();
          setPublicacionesFavoritas(data);
        }
      } catch (error) {
        console.error("Error al cargar publicaciones favoritas:", error);
      }
    };

    if (pestanaActiva === 'favoritos') {
      cargarFavoritosBD();
    }
  }, [pestanaActiva, usuarioSesion?.id_usuario]);

  useEffect(() => {
    const guardadas = localStorage.getItem('grwm_publicaciones');
    if (guardadas) {
      setListaPublicaciones(JSON.parse(guardadas));
    }
  }, [pestanaActiva]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file) {
        setImagenArchivo(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCrearPublicacion = (e) => {
    e.preventDefault();
    if (!imagenPreview) {
      alert("Por favor selecciona una foto.");
      return;
    }

    if (tipoPublicacion === 'feed') {
      const nuevoPost = {
        id: Date.now(),
        ruta: `/publicacion_nueva_${Date.now()}`,
        img: imagenPreview,
        likes: 0,
        esFavorito: false,
        descripcion: descripcion
      };

      const nuevasPublicaciones = [nuevoPost, ...listaPublicaciones];
      setListaPublicaciones(nuevasPublicaciones);
      localStorage.setItem('grwm_publicaciones', JSON.stringify(nuevasPublicaciones));
      alert("¡Tu outfit ha sido publicado en tu Feed!");
    } else {
      const nuevoProducto = {
        id: Date.now(),
        nombre: nombrePrenda || 'Prenda de Closet',
        precio: Number(precioPrenda) || 0,
        descripcion: descripcion,
        img: imagenPreview,
        talle: tallePrenda,
        disponible: true
      };

      const tiendaActual = JSON.parse(localStorage.getItem('grwm_tienda_productos')) || [];
      const nuevaTienda = [nuevoProducto, ...tiendaActual];
      localStorage.setItem('grwm_tienda_productos', JSON.stringify(nuevaTienda));
      
      alert("¡Prenda cargada con éxito! Ya se encuentra disponible en 'Mi Tienda'.");
    }

    setImagenArchivo(null);
    setImagenPreview('');
    setTipoPublicacion('feed');
    setPrecioPrenda('');
    setNombrePrenda('');
    setTallePrenda('M');
    setDescripcion('');
    setMostrarModal(false);
  };

  return (
    <div className="pagina-perfil">
      <Header/>

      <main className="contenido">

        <section className="tarjeta-perfil">
          
          {/* BANNER CENTRADO */}
          <div 
            className="portada" 
            style={{ 
              backgroundImage: bannerImg ? `url("${bannerImg}")` : 'linear-gradient(135deg, #ebdcd3 0%, #d8c2af 100%)',
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
          
          <div className="datos-perfil">
            
            <div className="avatar" style={{ backgroundColor: '#f3e8ee' }}>
              {fotoPerfil ? (
                <img src={fotoPerfil} alt={`Avatar de ${nombreMostrar}`} />
              ) : (
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#8b5274" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>

            <div className="nombre-y-descripcion">
              <h1>{nombreMostrar}</h1>
              <p className="usuario">{usuarioTag}</p>
              {descripcionMostrar && <p className="descripcion">{descripcionMostrar}</p>}
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
                <button className="btn-editar" onClick={() => navigate('/editar_perfil')}>Editar Perfil</button>
                <button className="btn-tienda" onClick={() => navigate('/miTienda')}>
                  Mi Tienda
                </button>
                <button className="btn-cargar" onClick={() => setMostrarModal(true)}>
                  + Publicar
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="pestanas">
          <button className={pestanaActiva === 'publicaciones' ? 'activa' : ''} onClick={() => setPestanaActiva('publicaciones')}>
            Publicaciones
          </button>
          <button className={pestanaActiva === 'closet' ? 'activa' : ''} onClick={() => setPestanaActiva('closet')}>
            Mi Closet
          </button>
          <button className={pestanaActiva === 'favoritos' ? 'activa' : ''} onClick={() => setPestanaActiva('favoritos')}>
            Favoritos
          </button>
        </div>

        <section className="grid-publicaciones">
          
          {pestanaActiva === 'publicaciones' && (
            listaPublicaciones.length === 0 ? (
              <p className="sin-contenido">No tenés publicaciones cargadas aún. ¡Hacé clic en '+ Publicar' para subir tu primer outfit! ✨</p>
            ) : (
              listaPublicaciones.map((post) => (
                <button 
                  key={post.id} 
                  className="post" 
                  type="button" 
                  onClick={() => navigate(`/publicacion/${post.id}`)}
                >
                  <div className="foto-post">
                    <img src={post.img} alt={`Publicación ${post.id}`} />
                  </div>
                  <div className="pie-post">
                    <span>♡ {post.likes}</span>
                  </div>
                </button>
              ))
            )
          )}

          {pestanaActiva === 'closet' && prendasCloset.map((prenda) => (
            <div key={prenda.id} className="post" style={{ cursor: 'default' }}>
              <div className="foto-post">
                <img src={prenda.img} alt={prenda.nombre} />
              </div>
              <div className="pie-post">
                <span>{prenda.categoria}</span>
                <strong className="tag-prenda">{prenda.nombre}</strong>
              </div>
            </div>
          ))}

          {pestanaActiva === 'favoritos' && (
            publicacionesFavoritas.length === 0 ? (
              <p className="sin-contenido">No tenés publicaciones guardadas en favoritos todavía.</p>
            ) : (
              publicacionesFavoritas.map((fav) => {
                const idPost = fav.id_publicacion || fav.id;
                const postOriginal = listaPublicaciones.find(p => String(p.id) === String(idPost));
                const imgAMostrar = postOriginal?.img || closetPropio1;
                const likesAMostrar = postOriginal?.likes || 0;

                return (
                  <button 
                    key={fav.id_favorito || idPost} 
                    className="post" 
                    type="button" 
                    onClick={() => navigate(`/publicacion/${idPost}`)}
                  >
                    <div className="foto-post">
                      <img src={imgAMostrar} alt={`Publicación ${idPost}`} />
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
            <h2>Cargar prenda o look</h2>
            
            <form onSubmit={handleCrearPublicacion}>
              
              <div className="form-grupo">
                <label>Sube una foto de tu prenda:</label>
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
                <label>¿Qué tipo de publicación es?</label>
                <select 
                  value={tipoPublicacion} 
                  onChange={(e) => setTipoPublicacion(e.target.value)}
                  className="modal-select"
                >
                  <option value="feed">Publicación para el feed </option>
                  <option value="tienda">Prenda para vender </option>
                </select>
              </div>

              {tipoPublicacion === 'tienda' && (
                <>
                  <div className="form-grupo">
                    <label>Nombre de la prenda:</label>
                    <input 
                      type="text" 
                      value={nombrePrenda} 
                      onChange={(e) => setNombrePrenda(e.target.value)}
                      placeholder="Ej: Campera de Jean Vintage"
                      required
                      className="modal-input"
                    />
                  </div>

                  <div className="form-grupo-fila">
                    <div className="form-grupo-medio">
                      <label>Precio (ARS):</label>
                      <input 
                        type="number" 
                        value={precioPrenda} 
                        onChange={(e) => setPrecioPrenda(e.target.value)}
                        placeholder="Ej: 45000"
                        required
                        className="modal-input"
                      />
                    </div>
                    <div className="form-grupo-medio">
                      <label>Talle:</label>
                      <select 
                        value={tallePrenda} 
                        onChange={(e) => setTallePrenda(e.target.value)}
                        className="modal-select"
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="form-grupo">
                <label>Descripción:</label>
                <textarea
                  placeholder="Contanos más sobre esta prenda o look..."
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
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-publicar-modal">
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer/>

    </div>
  );
}

export default PerfilPropio;