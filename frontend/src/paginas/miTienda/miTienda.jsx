import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './miTienda.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

function MiTienda() {
  const navigate = useNavigate();

  // Productos cargados desde la base de datos
  const [productos, setProductos] = useState([]);

  // Mostrar / ocultar formulario para publicar producto
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);

  // Estados generales
  const [cargando, setCargando] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState("");


  // =========================
  // OBTENER PRODUCTOS
  // =========================

  const obtenerProductos = async () => {
    try {

      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Debes iniciar sesión para ver tu tienda");
        return;
      }

      const respuesta = await fetch(
        "http://localhost:3000/api/productos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          datos.message ||
          "No se pudieron obtener los productos"
        );
        return;
      }

      setProductos(datos.productos || []);

    } catch (error) {

      console.error(
        "Error obteniendo productos:",
        error
      );

      setError(
        "No se pudo conectar con el servidor"
      );

    } finally {

      setCargando(false);

    }
  };


  useEffect(() => {
    obtenerProductos();
  }, []);


  // =========================
  // PUBLICAR PRODUCTO
  // =========================

  const handlePublicarProducto = async (e) => {
    e.preventDefault();

    setError("");

    if (
      nombre.trim() === "" ||
      categoria.trim() === "" ||
      descripcion.trim() === "" ||
      precio === "" ||
      !imagen
    ) {
      setError("Complete todos los campos");
      return;
    }

    if (Number(precio) <= 0) {
      setError("El precio debe ser mayor a cero");
      return;
    }

    try {

      setPublicando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Debes iniciar sesión para publicar productos"
        );
        return;
      }

      // Como enviamos una imagen usamos FormData
      const formData = new FormData();

      formData.append("nombre", nombre.trim());
      formData.append("categoria", categoria.trim());
      formData.append("descripcion", descripcion.trim());
      formData.append("precio", precio);
      formData.append("imagen", imagen);


      const respuesta = await fetch(
        "http://localhost:3000/api/productos",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );


      const datos = await respuesta.json();


      if (!respuesta.ok) {

        setError(
          datos.message ||
          "No se pudo publicar el producto"
        );

        return;
      }


      // Agregamos inmediatamente el nuevo producto a la tienda
      setProductos((productosActuales) => [
        datos.producto,
        ...productosActuales
      ]);


      // Limpiamos el formulario
      setNombre("");
      setCategoria("");
      setDescripcion("");
      setPrecio("");
      setImagen(null);

      // Cerramos el formulario
      setMostrarFormulario(false);

      alert("Producto publicado correctamente");


    } catch (error) {

      console.error(
        "Error publicando producto:",
        error
      );

      setError(
        "No se pudo conectar con el servidor"
      );

    } finally {

      setPublicando(false);

    }
  };


  // =========================
  // ELIMINAR PRODUCTO
  // =========================

  const handleEliminar = async (idProducto) => {

    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Debes iniciar sesión para eliminar productos"
        );
        return;
      }


      const respuesta = await fetch(
        `http://localhost:3000/api/productos/${idProducto}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const datos = await respuesta.json();


      if (!respuesta.ok) {

        alert(
          datos.message ||
          "No se pudo eliminar el producto"
        );

        return;
      }


      // Lo eliminamos también de la pantalla
      setProductos((productosActuales) =>
        productosActuales.filter(
          (producto) =>
            producto.id_producto !== idProducto
        )
      );


      alert("Producto eliminado correctamente");


    } catch (error) {

      console.error(
        "Error eliminando producto:",
        error
      );

      alert(
        "No se pudo conectar con el servidor"
      );

    }
  };


  return (
    <div>
      <div className="pagina-tienda">

        <Header />


        {/* CONTENIDO DE LA TIENDA */}
        <main className="contenido-tienda">

          <button
            className="volver-tienda"
            onClick={() => navigate('/perfil_propio')}
          >
            ← Volver al Perfil
          </button>


          {/* CABECERA */}
          <div className="cabecera-tienda">

            <h1>Mi Tienda</h1>

            <p>
              Publicá tus productos y gestioná todo lo que tenés a la venta.
            </p>


            <button
              type="button"
              className="boton-agregar-producto"
              onClick={() =>
                setMostrarFormulario(!mostrarFormulario)
              }
            >
              {mostrarFormulario
                ? "Cancelar publicación"
                : "+ Publicar producto"
              }
            </button>

          </div>


          {/* ========================= */}
          {/* FORMULARIO NUEVO PRODUCTO */}
          {/* ========================= */}

          {mostrarFormulario && (

            <div className="contenedor-formulario-producto">

              <h2>
                Publicar nuevo producto
              </h2>


              <form
                className="formulario-producto"
                onSubmit={handlePublicarProducto}
              >


                {/* NOMBRE */}
                <div className="form-group-producto">

                  <label htmlFor="nombreProducto">
                    Nombre del producto
                  </label>

                  <input
                    id="nombreProducto"
                    type="text"
                    placeholder="Ej: Campera de jean"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                  />

                </div>


                {/* CATEGORÍA */}
                <div className="form-group-producto">

                  <label htmlFor="categoriaProducto">
                    Categoría
                  </label>

                  <select
                    id="categoriaProducto"
                    value={categoria}
                    onChange={(e) =>
                      setCategoria(e.target.value)
                    }
                  >

                    <option value="">
                      Seleccionar categoría
                    </option>

                    <option value="Remeras">
                      Remeras
                    </option>

                    <option value="Camisas">
                      Camisas
                    </option>

                    <option value="Buzos">
                      Buzos
                    </option>

                    <option value="Camperas">
                      Camperas
                    </option>

                    <option value="Pantalones">
                      Pantalones
                    </option>

                    <option value="Polleras">
                      Polleras
                    </option>

                    <option value="Vestidos">
                      Vestidos
                    </option>

                    <option value="Calzado">
                      Calzado
                    </option>

                    <option value="Accesorios">
                      Accesorios
                    </option>

                    <option value="Otro">
                      Otro
                    </option>

                  </select>

                </div>


                {/* DESCRIPCIÓN */}
                <div className="form-group-producto">

                  <label htmlFor="descripcionProducto">
                    Descripción
                  </label>

                  <textarea
                    id="descripcionProducto"
                    placeholder="Describí el producto..."
                    value={descripcion}
                    onChange={(e) =>
                      setDescripcion(e.target.value)
                    }
                    rows="4"
                  />

                </div>


                {/* PRECIO */}
                <div className="form-group-producto">

                  <label htmlFor="precioProducto">
                    Precio
                  </label>

                  <input
                    id="precioProducto"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 25000"
                    value={precio}
                    onChange={(e) =>
                      setPrecio(e.target.value)
                    }
                  />

                </div>


                {/* IMAGEN */}
                <div className="form-group-producto">

                  <label htmlFor="imagenProducto">
                    Imagen del producto
                  </label>

                  <input
                    id="imagenProducto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setImagen(
                        e.target.files[0] || null
                      )
                    }
                  />


                  {imagen && (

                    <p className="nombre-imagen-producto">
                      Imagen seleccionada: {imagen.name}
                    </p>

                  )}

                </div>


                {/* ERROR */}
                {error && (

                  <div className="error-tienda">
                    {error}
                  </div>

                )}


                {/* BOTONES */}
                <div className="acciones-formulario-producto">

                  <button
                    type="submit"
                    className="boton-publicar-producto"
                    disabled={publicando}
                  >

                    {publicando
                      ? "Publicando..."
                      : "Publicar producto"
                    }

                  </button>


                  <button
                    type="button"
                    className="boton-cancelar-producto"
                    onClick={() =>
                      setMostrarFormulario(false)
                    }
                  >
                    Cancelar
                  </button>

                </div>

              </form>

            </div>

          )}


          {/* ERROR CUANDO EL FORMULARIO ESTÁ CERRADO */}
          {!mostrarFormulario && error && (

            <div className="error-tienda">
              {error}
            </div>

          )}


          {/* CARGANDO */}
          {cargando && (

            <p>
              Cargando productos...
            </p>

          )}


          {/* SIN PRODUCTOS */}
          {!cargando &&
            !error &&
            productos.length === 0 && (

              <div className="sin-productos">

                <p>
                  Todavía no publicaste ningún producto.
                </p>

                <button
                  type="button"
                  className="boton-agregar-producto"
                  onClick={() =>
                    setMostrarFormulario(true)
                  }
                >
                  Publicar mi primer producto
                </button>

              </div>

            )
          }


          {/* ========================= */}
          {/* PRODUCTOS PUBLICADOS */}
          {/* ========================= */}

          {!cargando && productos.length > 0 && (

            <>

              <h2 className="titulo-productos-tienda">
                Mis productos
              </h2>


              <section className="grid-productos">

                {productos.map((prod) => (

                  <div
                    key={prod.id_producto}
                    className="tarjeta-producto"
                  >


                    <div className="contenedor-foto-producto">

                      {prod.imagen && (

                        <img
                          src={
                            `http://localhost:3000${prod.imagen}`
                          }
                          alt={prod.nombre}
                        />

                      )}

                    </div>


                    <div className="info-producto">

                      <h3>
                        {prod.nombre}
                      </h3>


                      <p className="categoria-producto">
                        {prod.categoria}
                      </p>


                      <p className="descripcion-producto">
                        {prod.descripcion}
                      </p>


                      <div className="precio-y-accion">

                        <span className="precio-tag">

                          $
                          {Number(prod.precio)
                            .toLocaleString(
                              'es-AR'
                            )}

                        </span>


                        <button
                          type="button"
                          className="boton-eliminar-producto"
                          onClick={() =>
                            handleEliminar(
                              prod.id_producto
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </section>

            </>

          )}

        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MiTienda;