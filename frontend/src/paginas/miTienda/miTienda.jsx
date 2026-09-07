import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg' 
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import './miTienda.css'

function MiTienda() {
  const navigate = useNavigate();

  // Lista base (los productos por defecto que Taylor ya vende)
  const productosPorDefecto = [
    {
      id: 1,
      nombre: 'Tapado de Hilo (Outfit Publicación 1)',
      precio: 75000,
      descripcion: 'El outfit completo modelado en mi publicación número 1. Tejido a mano, talle holgado súper cómodo.',
      img: fotoPropia1,
      talle: 'M'
    },
    {
      id: 3,
      nombre: 'Blazer Sastrero (Outfit Publicación 3)',
      precio: 95000,
      descripcion: 'Blazer sastre vintage con corte impecable y hombreras sutiles. Una prenda temporal única.',
      img: fotoPropia3,
      talle: 'S'
    }
  ];

  // Leemos del localStorage lo subido, y si no hay nada guardado aún, usamos los valores por defecto
  const [productos] = useState(() => {
    const tiendaGuardada = localStorage.getItem('grwm_tienda_productos');
    if (tiendaGuardada) {
      const parsed = JSON.parse(tiendaGuardada);
      return parsed.length > 0 ? parsed : productosPorDefecto;
    }
    localStorage.setItem('grwm_tienda_productos', JSON.stringify(productosPorDefecto));
    return productosPorDefecto;
  });

  const handleComprar = (productoNombre) => {
    alert(`¡Iniciando la compra de: ${productoNombre}!`);
  };

  return (
    <div className="pagina-tienda">
      
      {/* BARRA SUPERIOR CONSTANTE */}
      <header className="barra-superior-tienda">
        <button
          className="logo-tienda"
          type="button"
          onClick={() => navigate('/perfil_propio')}
        >
          ✧ <span>GRWM</span>
        </button>

        <div className="buscador-tienda">
          <span>🔍︎</span>
          <input type="text" placeholder="Buscar en mi tienda..." />
        </div>

        <nav className="menu-tienda">
          <button onClick={() => navigate('/perfil_propio')}>Mi perfil</button>
          <button onClick={() => navigate('/miTienda')} className="activo">Mi Tienda</button>
          <button onClick={() => navigate('/')}>Página Principal</button>
          <div 
            className="mini-avatar-tienda" 
            onClick={() => navigate('/perfil_propio')}
            style={{ cursor: 'pointer' }}
          >
            <img src={fotoPerfilPropio} alt="Foto de perfil" />
          </div>
        </nav>
      </header>

      {/* CONTENIDO DE LA TIENDA */}
      <main className="contenido-tienda">
        
        <button className="volver-tienda" onClick={() => navigate('/perfil_propio')}>
          ← Volver al Perfil
        </button>

        <div className="cabecera-tienda">
          <h1>Mi Tienda</h1>
          <p>Adquirí las prendas exclusivas de mis publicaciones. ¡Envíos a todo el país! 📦✨</p>
        </div>

        {/* GRID DE PRODUCTOS EN VENTA */}
        <section className="grid-productos">
          {productos.map((prod) => (
            <div key={prod.id} className="tarjeta-producto">
              <div className="contenedor-foto-producto">
                <img src={prod.img} alt={prod.nombre} />
                <span className="talle-tag">Talle {prod.talle}</span>
              </div>

              <div className="info-producto">
                <h3>{prod.nombre}</h3>
                <p className="descripcion-producto">{prod.descripcion}</p>
                
                <div className="precio-y-accion">
                  <span className="precio-tag">${prod.precio.toLocaleString('es-AR')}</span>
                  <button 
                    className="btn-comprar" 
                    onClick={() => handleComprar(prod.nombre)}
                  >
                    Comprar Prenda
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}

export default MiTienda;