import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./tienda_principal.css"
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'
import fotoPropia2 from '../../assets/imagenes/fotoPropia2.jpg'
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'
import closetPropio1 from '../../assets/imagenes/closetPropio1.jpg'
import closetPropio2 from '../../assets/imagenes/closetPropio2.jpg'

function TiendaPrincipal() {

  const navigate = useNavigate()

  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('Destacados')

  const productos = [
    {
      id: 1,
      nombre: 'Blazer Oversize Vintage',
      categoria: 'Ropa',
      estado: 'Excelente',
      precio: 85,
      usuario: '@taylor_swift13',
      imagen: fotoPropia1
    },
    {
      id: 2,
      nombre: 'Bolso de Cuero Vintage',
      categoria: 'Bolsos',
      estado: 'Como nuevo',
      precio: 120,
      usuario: '@mora_closet',
      imagen: fotoPropia2
    },
    {
      id: 3,
      nombre: 'Cadena Plateada',
      categoria: 'Joyería',
      estado: 'Nuevo',
      precio: 45,
      usuario: '@fashion_style',
      imagen: fotoPropia3
    },
    {
      id: 4,
      nombre: 'Zapatillas Retro Pastel',
      categoria: 'Calzado',
      estado: 'Buen estado',
      precio: 95,
      usuario: '@hugo_out',
      imagen: fotoPropia4
    },
    {
      id: 5,
      nombre: 'Cárdigan Marrón Suave',
      categoria: 'Ropa',
      estado: 'Excelente',
      precio: 55,
      usuario: '@clogan_style',
      imagen: closetPropio1
    },
    {
      id: 6,
      nombre: 'Gafas de Sol Retro',
      categoria: 'Accesorios',
      estado: 'Como nuevo',
      precio: 35,
      usuario: '@luciatrends',
      imagen: closetPropio2
    },
    {
      id: 7,
      nombre: 'Campera Floral Vintage',
      categoria: 'Ropa',
      estado: 'Excelente',
      precio: 90,
      usuario: '@vintage_closet',
      imagen: fotoPropia2
    },
    {
      id: 8,
      nombre: 'Vestido Negro Clásico',
      categoria: 'Ropa',
      estado: 'Nuevo',
      precio: 75,
      usuario: '@sofia.aria',
      imagen: fotoPropia4
    }
  ]

  const categorias = [
    { nombre: 'Todos', cantidad: '12.4k' },
    { nombre: 'Ropa', cantidad: '5.2k' },
    { nombre: 'Accesorios', cantidad: '2.1k' },
    { nombre: 'Calzado', cantidad: '1.8k' },
    { nombre: 'Bolsos', cantidad: '1.5k' },
    { nombre: 'Joyería', cantidad: '1.8k' }
  ]

  const productosFiltrados = productos
    .filter((producto) => {
      const coincideCategoria =
        categoriaActiva === 'Todos' ||
        producto.categoria === categoriaActiva

      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.usuario.toLowerCase().includes(busqueda.toLowerCase())

      return coincideCategoria && coincideBusqueda
    })
    .sort((a, b) => {
      if (orden === 'Precio menor') {
        return a.precio - b.precio
      }

      if (orden === 'Precio mayor') {
        return b.precio - a.precio
      }

      return a.id - b.id
    })

  const comprar = (producto) => {
    alert(`¡Compraste "${producto.nombre}" por $${producto.precio}!`)
  }

  return (
    <div className="pagina-tienda-principal">

      {/* HEADER */}

      <header className="header-tienda-principal">

        <button
          className="logo-tienda-principal"
          onClick={() => navigate('/perfil_propio')}
        >
          ✧ <span>GRWM</span>
        </button>

        <button className="boton-busqueda"
          type="button"
          onClick={() => navigate('/busqueda')}>🔍︎
        </button>

        <nav className="nav-tienda-principal">

          <button className="nav-activo"
           type="button"
           onClick={() => navigate('/tienda_principal')}>
            Tienda
          </button>

          <button>
            Soporte
          </button>

          <img
            src={fotoPerfilPropio}
            alt="Perfil"
            onClick={() => navigate('/perfil_propio')}
          />

        </nav>

      </header>


      {/* HERO */}

      <section className="hero-tienda">

        <div className="hero-texto">

          <h1>
            Renueva tu clóset con
            <br />
            estilo consciente
          </h1>

          <p>
            Compra prendas únicas de la comunidad y vende lo que ya no usas.
            Moda circular, cuidada e inspirada en tus looks favoritos.
          </p>

        </div>

      </section>


      {/* CONTENIDO */}

      <main className="contenido-tienda-principal">

        {/* SIDEBAR */}

        <aside className="sidebar-tienda">

          <h3>Estado de la prenda</h3>

          <label>
            <input type="checkbox" />
            Nuevo con etiqueta
          </label>

          <label>
            <input type="checkbox" />
            Como nuevo
          </label>

          <label>
            <input type="checkbox" />
            Excelente
          </label>

          <label>
            <input type="checkbox" />
            Buen estado
          </label>


          <div className="categorias">

            <h3>Categorías</h3>

            {categorias.map((categoria) => (

              <button
                key={categoria.nombre}
                className={
                  categoriaActiva === categoria.nombre
                    ? 'categoria-activa'
                    : ''
                }
                onClick={() => setCategoriaActiva(categoria.nombre)}
              >

                <span>{categoria.nombre}</span>
                <small>{categoria.cantidad}</small>

              </button>

            ))}

          </div>

        </aside>


        {/* PRODUCTOS */}

        <section className="productos-principales">

          <div className="barra-productos">

            <span>
              Mostrando <strong>{productosFiltrados.length}</strong> productos
            </span>

            <div className="ordenar">

              <span>Ordenar por:</span>

              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option>Destacados</option>
                <option>Precio menor</option>
                <option>Precio mayor</option>
              </select>

            </div>

          </div>


          <div className="grid-productos-principal">

            {productosFiltrados.map((producto) => (

              <article
                className="producto-card-principal"
                key={producto.id}
              >

                <div className="imagen-producto">

                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                  <span className="estado-producto">
                    {producto.estado}
                  </span>

                  <strong className="precio-producto">
                    ${producto.precio}
                  </strong>

                </div>


                <div className="datos-producto">

                  <h3>{producto.nombre}</h3>

                  <p>
                    {producto.usuario}
                  </p>

                  <div className="footer-producto">

                    <span>
                      ♡ {producto.id * 42}
                    </span>

                    <button
                      onClick={() => comprar(producto)}
                    >
                      Comprar
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default TiendaPrincipal