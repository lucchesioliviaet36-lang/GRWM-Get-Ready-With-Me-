import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bannerFotoDePerfilPropio from '../../assets/imagenes/bannerFotoDePerfilPropio.jpg'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'
import fotoPropia2 from '../../assets/imagenes/fotoPropia2.jpg'
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'

// Importamos tus hermosos cardigans reales (que ahora sí existen en tu carpeta)
import closetPropio1 from '../../assets/imagenes/closetPropio1.jpg'
import closetPropio2 from '../../assets/imagenes/closetPropio2.jpg'

import './perfil_propio.css'

function PerfilPropio() {
  const navigate = useNavigate();
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');

  // LISTA 1: Publicaciones del feed (con persistencia local en el navegador)
  const publicacionesPorDefecto = [
    { id: 1, ruta: '/publicacion1', img: fotoPropia1, likes: 189, esFavorito: false },
    { id: 2, ruta: '/publicacion2', img: fotoPropia2, likes: 245, esFavorito: false },
    { id: 3, ruta: '/publicacion3', img: fotoPropia3, likes: 98, esFavorito: false },
    { id: 4, ruta: '/publicacion4', img: fotoPropia4, likes: 150, esFavorito: false }
  ];

  const [listaPublicaciones, setListaPublicaciones] = useState(() => {
    const guardadas = localStorage.getItem('grwm_publicaciones');
    if (guardadas) {
      const parsed = JSON.parse(guardadas);
      return parsed.length > 0 ? parsed : publicacionesPorDefecto;
    }
    localStorage.setItem('grwm_publicaciones', JSON.stringify(publicacionesPorDefecto));
    return publicacionesPorDefecto;
  });

  // LISTA 2: Tu closet personal (Tus cardigans reales de exhibición, NO SE VENDEN)
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

  
  const handleFileChange = (e) => {
    // Usamos .item(0) para seleccionar de forma segura el primer archivo de la lista
    const file = e.target.files.item(0); 
    
    if (file) {
      setImagenArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result); // Genera el Base64 correcto de la foto seleccionada
      };
      reader.readAsDataURL(file);
    }
  };


  // Enviar el formulario y decidir el destino (Feed de fotos o "Mi Tienda")
  const handleCrearPublicacion = (e) => {
    e.preventDefault();
    if (!imagenPreview) {
      alert("Por favor selecciona una foto.");
      return;
    }

    if (tipoPublicacion === 'feed') {
      // Caso A: Se publica al Feed social común
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
      // Caso B: Se publica como artículo en venta en "Mi Tienda"
      const nuevoProducto = {
        id: Date.now(),
        nombre: nombrePrenda || 'Prenda de Closet',
        precio: Number(precioPrenda) || 0,
        descripcion: descripcion,
        img: imagenPreview,
        talle: tallePrenda,
        disponible: true
      };

      // Leemos del almacenamiento local de la tienda, añadimos el artículo y guardamos
      const tiendaActual = JSON.parse(localStorage.getItem('grwm_tienda_productos')) || [];
      const nuevaTienda = [nuevoProducto, ...tiendaActual];
      localStorage.setItem('grwm_tienda_productos', JSON.stringify(nuevaTienda));
      
      alert("¡Prenda cargada con éxito! Ya se encuentra disponible en 'Mi Tienda'.");
    }

    // Limpiamos los campos y cerramos el modal
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
      
      {/* BARRA SUPERIOR */}
      <header className="barra-superior">
        <div className="logo">
          ✧ <span>GRWM</span>
        </div>
        
        <div className="buscador">
          <span className="icono-busqueda">🔍︎</span>
          <input type="text" placeholder="Buscar outfits, marcas, tendencias..." />
        </div>

        <nav className="menu">
          <button onClick={() => navigate('/perfil_propio')}>Mi perfil</button>
          <button onClick={() => navigate('/miTienda')}>Mi Tienda</button>
          <button onClick={() => navigate('/pagina_principal')}>
            Página Principal
          </button>
          <button onClick={() => navigate('/configuracion')}>Configuración</button>
          <div className="mini-avatar">
            <img src={fotoPerfilPropio} alt="Foto de perfil" />
          </div>
        </nav>
      </header>

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
                Cantante, compositora y amante de la moda -`𖹭´- <br />
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
                <button className="btn-editar">Editar Perfil</button>
                <button className="btn-tienda" onClick={() => navigate('/miTienda')}>
                  Mi Tienda
                </button>
                {/* BOTÓN "PUBLICAR PRENDA" */}
                <button className="btn-cargar" onClick={() => setMostrarModal(true)}>
                  ✚ Publicar
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

        {/* GRID DE CONTENIDO SEGÚN LA PESTAÑA */}
        <section className="grid-publicaciones">
          
          {/* VISTA 1: PUBLICACIONES SOCIALES (FEED) */}
          {pestanaActiva === 'publicaciones' && listaPublicaciones.map((post) => (
            <button key={post.id} className="post" type="button" onClick={() => navigate(post.ruta)}>
              <div className="foto-post">
                <img src={post.img} alt={`Publicación ${post.id}`} />
              </div>
              <div className="pie-post">
                <span>♡ {post.likes}</span>
              </div>
            </button>
          ))}

          {/* VISTA 2: CLOSET VIRTUAL (Tus cardigans reales de exhibición que NO se venden) */}
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
              
              {/* COMPONENTE DE SUBIDA DE ARCHIVO LOCAL */}
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

              {/* SELECTOR DE DESTINO */}
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

              {/* CAMPOS COMPLEMENTARIOS PARA LA TIENDA DE VENTAS */}
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

              {/* DESCRIPCIÓN */}
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

              {/* BOTONES ACCIONES */}
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

    </div>
  );
}

export default PerfilPropio;