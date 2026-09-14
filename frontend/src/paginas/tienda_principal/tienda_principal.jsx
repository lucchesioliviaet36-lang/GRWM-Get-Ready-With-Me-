import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./tienda_principal.css"
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

function TiendaPrincipal() {

  const navigate = useNavigate()

  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('Destacados')
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([])

  const productos = [
    {
      id: 1,
      nombre: 'Blazer Oversize Vintage',
      categoria: 'Ropa',
      estado: 'Excelente',
      precio: 85,
      usuario: '@taylor_swift13',
      imagen: '[https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop)'
    },
    {
      id: 2,
      nombre: 'Bolso de Cuero Vintage',
      categoria: 'Bolsos',
      estado: 'Como nuevo',
      precio: 120,
      usuario: '@mora_closet',
      imagen: '[https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop)'
    },
    {
      id: 3,
      nombre: 'Cadena Plateada',
      categoria: 'Joyería',
      estado: 'Nuevo con etiqueta',
      precio: 45,
      usuario: '@fashion_style',
      imagen: '[https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop)'
    },
    {
      id: 4,
      nombre: 'Zapatillas Retro Pastel',
      categoria: 'Calzado',
      estado: 'Buen estado',
      precio: 95,
      usuario: '@hugo_out',
      imagen: '[https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop)'
    },
    {
      id: 5,
      nombre: 'Cárdigan Marrón Suave',
      categoria: 'Ropa',
      estado: 'Excelente',
      precio: 55,
      usuario: '@clogan_style',
      imagen: '[https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop)'
    },
    {
      id: 6,
      nombre: 'Gafas de Sol Retro',
      categoria: 'Accesorios',
      estado: 'Como nuevo',
      precio: 35,
      usuario: '@luciatrends',
      imagen: '[https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop)'
    },
    {
      id: 7,
      nombre: 'Campera Floral Vintage',
      categoria: 'Ropa',
      estado: 'Excelente',
      precio: 90,
      usuario: '@vintage_closet',
      imagen: '[https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop)'
    },
    {
      id: 8,
      nombre: 'Vestido Negro Clásico',
      categoria: 'Ropa',
      estado: 'Nuevo con etiqueta',
      precio: 75,
      usuario: '@sofia.aria',
      imagen: '[https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop](https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop)'
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

  const manejarCambioEstado = (estado) => {
    if (estadosSeleccionados.includes(estado)) {
      setEstadosSeleccionados(estadosSeleccionados.filter((e) => e !== estado))
    } else {
      setEstadosSeleccionados([...estadosSeleccionados, estado])
    }
  }

  const productosFiltrados = productos
    .filter((producto) => {
      const coincideCategoria =
        categoriaActiva === 'Todos' ||
        producto.categoria === categoriaActiva

      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.usuario.toLowerCase().includes(busqueda.toLowerCase())

      const coincideEstado =
        estadosSeleccionados.length === 0 ||
        estadosSeleccionados.includes(producto.estado)

      return coincideCategoria && coincideBusqueda && coincideEstado
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

  return (
    <div className="pagina-tienda-principal">

      <Header />

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
            <input
              type="checkbox"
              checked={estadosSeleccionados.includes('Nuevo con etiqueta')}
              onChange={() => manejarCambioEstado('Nuevo con etiqueta')}
            />
            Nuevo con etiqueta
          </label>

          <label>
            <input
              type="checkbox"
              checked={estadosSeleccionados.includes('Como nuevo')}
              onChange={() => manejarCambioEstado('Como nuevo')}
            />
            Como nuevo
          </label>

          <label>
            <input
              type="checkbox"
              checked={estadosSeleccionados.includes('Excelente')}
              onChange={() => manejarCambioEstado('Excelente')}
            />
            Excelente
          </label>

          <label>
            <input
              type="checkbox"
              checked={estadosSeleccionados.includes('Buen estado')}
              onChange={() => manejarCambioEstado('Buen estado')}
            />
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
                      onClick={() => navigate('/pago')}
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

      <Footer />

    </div>
  )
}

export default TiendaPrincipal