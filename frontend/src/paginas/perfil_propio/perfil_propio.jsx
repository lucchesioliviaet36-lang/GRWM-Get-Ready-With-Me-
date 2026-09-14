import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bannerFotoDePerfilPropio from '../../assets/imagenes/bannerFotoDePerfilPropio.jpg'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'

import closetPropio1 from '../../assets/imagenes/closetPropio1.jpg'
import closetPropio2 from '../../assets/imagenes/closetPropio2.jpg'

import './perfil_propio.css'
import Header from "../../componentes/header/header"
import Footer from "../../componentes/footer/footer"

function PerfilPropio() {
  const navigate = useNavigate();
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');
  const [menuAbierto, setMenuAbierto] = useState(false); 
  
  const publicacionesPorDefecto = [];

  const [listaPublicaciones, setListaPublicaciones] = useState(() => {
    const guardadas = localStorage.getItem('grwm_publicaciones');
    return guardadas ? JSON.parse(guardadas) : [];
  });

  // LISTA 2: Closet personal
  const prendasCloset = [
    { id: 1, img: closetPropio1, nombre: 'Folklore Cardigan', categoria: 'Cardigans' },
    { id: 2, img: closetPropio2, nombre: 'Midnight Cardigan', categoria: 'Cardigans' }
  ];

  // ESTADOS DEL MODAL Y FORMULARIO DE CARGA
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [tipoPublicacion, setTipoPublicacion] = useState('feed'); // 'feed' o 'tienda'
  const [precioPrenda, setPrecioPrenda] = useState('');
  const [nombrePrenda, setNombrePrenda] = useState('');
  const [tallePrenda, setTallePrenda] = useState('M');
  const [descripcion, setDescripcion] = useState('');

  const publicacionesFavoritas = listaPublicaciones.filter(post => post.esFavorito);

  // MANEJAR LA SELECCIÓN DEL ARCHIVO LOCAL
  const handleFileChange = (e) => {
    const file = e.target.files.item(0);
    if (file) {
      setImagenArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Enviar el formulario y guardar en MySQL o 'Mi Tienda'
  const handleCrearPublicacion = async (e) => {
    e.preventDefault();
    if (!imagenPreview) {
      alert("Por favor selecciona una foto.");
      return;
    }

    // 1. Leemos los datos del usuario logueado desde localStorage ('usuario')
    const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));
    const idUsuarioActual = usuarioSesion?.id_usuario; // Tomará el id_usuario: 5

    if (!idUsuarioActual) {
      alert("No se encontró la sesión del usuario. Por favor volvé a iniciar sesión.");
      return;
    }

    if (tipoPublicacion === 'feed') {
      try {
        // 2. Enviamos la publicación a MySQL con id_usuario: 5
        const response = await fetch('http://localhost:3000/api/publicaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            descripcion: descripcion,
            id_usuario: idUsuarioActual, // Envía 5
            id_producto: null
          })
        });

        if (response.ok) {
          const nuevaPub = await response.json();

          const nuevoPost = {
            id: nuevaPub.id_publicacion || Date.now(),
            ruta: `/publicacion/${nuevaPub.id_publicacion}`,
            img: imagenPreview,
            likes: 0,
            esFavorito: false,
            descripcion: descripcion
          };

          const nuevasPublicaciones = [nuevoPost, ...listaPublicaciones];
          setListaPublicaciones(nuevasPublicaciones);
          localStorage.setItem('grwm_publicaciones', JSON.stringify(nuevasPublicaciones));

          alert("¡Tu outfit ha sido publicado en MySQL correctamente!");
        } else {
          alert("Ocurrió un error al guardar la publicación en la base de datos.");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("Error de conexión al intentar publicar.");
      }
    } else {
      // Carga para la tienda
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

      alert("¡Prenda cargada con éxito en Mi Tienda!");
    }

    // Limpiar formulario y cerrar modal
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="contenido">

        {/* PORTADA + PERFIL */}
        <section className="tarjeta-perfil">
          <div className="portada" style={{ backgroundImage: `url(${bannerFotoDePerfilPropio})` }}></div>
          <div className="datos-perfil">
            <div className="avatar">
              <img src={fotoPerfilPropio} alt="Avatar de Taylor Swift" />
            </div>
            <div className="nombre-y-descripcion">
              <h1>Taylor Swift</h1>
              <p className="usuario">@taylor_swift13</p>
              <p className="descripcion">
                Cantante, compositora y amante de la moda <br />
                Compartiendo looks de cada era ♬⋆.˚
              </p>
            </div>
            <div className="estadisticas">
              <div>
                <strong>{listaPublicaciones.length}</strong>
                <span>Publicaciones</span>
              </div>
              <div>
                <strong>1.8k</strong>
                <span>Seguidores</span>
              </div>
              <div>
                <strong>352</strong>
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

        {/* PESTAÑAS INTERACTIVAS */}
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

        {/* GRID DE CONTENIDO */}
        <section className="grid-publicaciones">
          
          {/* VISTA 1: PUBLICACIONES SOCIALES (CLIQUEABLES CON ID DINÁMICO) */}
          {pestanaActiva === 'publicaciones' && listaPublicaciones.map((post) => (
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
          ))}

          {/* VISTA 2: CLOSET VIRTUAL */}
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

          {/* MENSAJES PARA SECCIONES VACÍAS */}
          {pestanaActiva === 'favoritos' && publicacionesFavoritas.length === 0 && (
            <p className="sin-contenido">No tenés publicaciones guardadas en favoritos todavía.</p>
          )}

          {pestanaActiva === 'closet' && prendasCloset.length === 0 && (
            <p className="sin-contenido">No hay prendas agregadas a tu closet aún.</p>
          )}
        </section>

      </main>

      {/* MODAL INTERACTIVO DE CARGA */}
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
                  <option value="feed">Publicación para el feed</option>
                  <option value="tienda">Prenda para vender</option>
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