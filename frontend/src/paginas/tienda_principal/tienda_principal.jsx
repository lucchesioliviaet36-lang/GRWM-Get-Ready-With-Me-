
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tienda_principal.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

const API_URL = "http://localhost:3000";

function obtenerUrlImagen(ruta) {
  if (!ruta) return "";

  if (ruta.startsWith("http://") || ruta.startsWith("https://")) {
    return ruta;
  }

  return `${API_URL}${ruta.startsWith("/") ? "" : "/"}${ruta}`;
}

function TiendaPrincipal() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("Destacados");
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/productos/general`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los productos.");
        }

        const datos = await respuesta.json();
        setProductos(Array.isArray(datos) ? datos : datos.productos || []);
      } catch (error) {
        setErrorProductos(error.message);
      } finally {
        setCargandoProductos(false);
      }
    };

    obtenerProductos();
  }, []);

  const categorias = [
    "Todos",
    ...new Set(
      productos
        .map((producto) => producto.categoria)
        .filter(Boolean)
    ),
  ];

  const productosFiltrados = productos
    .filter((producto) => {
      const nombre = producto.nombre || "";
      const categoria = producto.categoria || "";

      const coincideCategoria =
        categoriaActiva === "Todos" || categoria === categoriaActiva;

      const coincideBusqueda = `${nombre} ${categoria} ${
        producto.id_usuario || ""
      }`
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (orden === "Precio menor") {
        return Number(a.precio) - Number(b.precio);
      }

      if (orden === "Precio mayor") {
        return Number(b.precio) - Number(a.precio);
      }

      return Number(b.id_producto) - Number(a.id_producto);
    });

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

      <main className="contenido-tienda-principal">
        <aside className="sidebar-tienda">
          <h3>Categorías</h3>

          <div className="categorias">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className={
                  categoriaActiva === categoria ? "categoria-activa" : ""
                }
                onClick={() => setCategoriaActiva(categoria)}
              >
                <span>{categoria}</span>

                <small>
                  {categoria === "Todos"
                    ? productos.length
                    : productos.filter(
                        (producto) => producto.categoria === categoria
                      ).length}
                </small>
              </button>
            ))}
          </div>
        </aside>

        <section className="productos-principales">
          <div className="busqueda-tienda">
            <input
              type="search"
              placeholder="Buscar productos o categorías..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

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

          {cargandoProductos && <p>Cargando productos...</p>}

          {errorProductos && <p role="alert">{errorProductos}</p>}

          {!cargandoProductos &&
            !errorProductos &&
            productosFiltrados.length === 0 && (
              <p>No hay productos disponibles en esta categoría.</p>
            )}

          <div className="grid-productos-principal">
            {productosFiltrados.map((producto) => (
              <article
                className="producto-card-principal"
                key={producto.id_producto}
              >
                <div className="imagen-producto">
                  {producto.imagen ? (
                    <img
                      src={obtenerUrlImagen(producto.imagen)}
                      alt={producto.nombre}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="sin-imagen">
                      Sin imagen disponible
                    </span>
                  )}

                  <span className="estado-producto">
                    {producto.estado_producto
                      ? "Disponible"
                      : "No disponible"}
                  </span>

                  <strong className="precio-producto">
                    $
                    {Number(producto.precio || 0).toLocaleString("es-AR")}
                  </strong>
                </div>

                
                <div className="datos-producto">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.categoria || "Sin categoría"}</p>

                  <p className="descripcion-producto">
                    {producto.descripcion || "Sin descripción disponible"}
                  </p>

                  <div className="footer-producto">
                    <span>Vendedor #{producto.id_usuario}</span>

                    <button
                      disabled={!producto.estado_producto}
                      onClick={() => navigate("/pago")}
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
  );
}

export default TiendaPrincipal;
