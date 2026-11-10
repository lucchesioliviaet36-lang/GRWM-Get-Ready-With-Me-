import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import "./detallePedido.css";

const API_URL = "http://localhost:3000";

function DetallePedido() {
  const navigate = useNavigate();
  const {idPedido} = useParams();
  const [pedido, setPedido] = useState(null);
  const [producto, setProducto] = useState(null);
  const [calificacion, setCalificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");


  const cargarPedido = async () => {
    try {
      setCargando(true);
      setError("");
      const token = localStorage.getItem("token");

      const respuesta = await fetch(`${API_URL}/api/pedidos/${idPedido}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message ||
          "No se pudo cargar el pedido"
        );

      }
      setPedido(datos.pedido);
      setProducto(datos.producto);
      setCalificacion(datos.calificacion || null);

    } catch (error) {
      console.error(
        "Error cargando pedido:",
        error
      );

      setError(error.message);

    } finally {
      setCargando(false);

    }

  };

  useEffect(() => {
    cargarPedido();

  }, [idPedido]);

  const confirmarLlegada = async () => {

    try {
      setProcesando(true);
      setError("");

      const token = localStorage.getItem("token");

      const respuesta = await fetch(`${API_URL}/api/pedidos/${idPedido}/recibido`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {

        throw new Error(
          datos.message ||
          "No se pudo confirmar la entrega"
        );

      }
      navigate( `/calificar/${idPedido}`);

    } catch (error) {
      console.error(
        "Error confirmando entrega:",
        error
      );
      setError(error.message);

    } finally {
      setProcesando(false);

    }

  };

  if (cargando) {

    return (

      <div className="detalle-pedido-page">
        <Header />
        <main className="detalle-pedido-cargando">
          Cargando pedido...
        </main>

        <Footer />

      </div>

    );
  }

  if (error && !pedido) {
    return (
      <div className="detalle-pedido-page">

        <Header />

        <main className="detalle-pedido-cargando">
          <p>{error}</p>

          <button onClick={() => navigate("/historial-compras")}
          >Volver
          </button>
        </main>
        <Footer />
      </div>

    );
  }
  const recibido = Boolean(pedido?.recibido);


  return (
    <div className="detalle-pedido-page">
      <Header />

      <main className="detalle-pedido-contenido">

        <button
          className="detalle-volver"
          onClick={() => navigate("/historial-compras")}
        >← Historial de compras
        </button>

        {producto && (
          <div className="detalle-producto">
            {producto.imagen && (
              <img
                src={`${API_URL}${producto.imagen}`}
                alt={producto.nombre}
              />
            )}
            <div>
              <span>
                PEDIDO #{pedido.id_pedido}
              </span>
              <h2>
                {producto.nombre}
              </h2>
              <strong>
                $
                {Number(producto.precio).toLocaleString("es-AR")}
              </strong>
            </div>
          </div>
        )}

        {!recibido ? (
          <>
            <div className="pedido-en-camino">
              <div className="pedido-camino-icono">
                ♡
              </div>
              <div className="pedido-camino-info">
                <span className="pedido-estado-label">
                  ESTADO DEL PEDIDO
                </span>
                <h2>
                  Tu pedido está en camino
                </h2>
                <p>
                  Cuando tengas el producto
                  en tus manos, confirmá la entrega.
                </p>
              </div>
              <span className="estado-en-camino">
                En camino
              </span>
            </div>


            <div className="confirmar-entrega-box">
              <h3>
                ¿Ya te llegó tu pedido?
              </h3>
              <p>
                Confirmá solamente cuando
                hayas recibido el producto.
              </p>
              <button
                type="button"
                className="btn-pedido-recibido"
                onClick={confirmarLlegada}
                disabled={procesando}
              >
                {procesando
                  ? "Confirmando..."
                  : "Sí, ya me llegó ✓"}

              </button>
            </div>
          </>
        ) : (
          <div className="pedido-entregado-box">
            <div className="pedido-entregado-icono">
              ✓
            </div>
            <span>
              PEDIDO ENTREGADO
            </span>
            <h2>
              ¡Pedido recibido!
            </h2>
            <p>
              Confirmaste que tu compra
              llegó correctamente.
            </p>

            {!calificacion ? (
              <button
                type="button"
                className="btn-calificar-pedido"
                onClick={() =>navigate(`/calificar/${idPedido}`)}
              >Calificar compra ✧
              </button>
            ) : (
              <div className="detalle-calificacion">
                <div>
                  {[1,2,3,4,5].map(
                    estrella => (
                      <span
                        key={estrella}
                        className={
                          estrella <= Math.round(Number(calificacion.puntuacion))
                            ? "activa"
                            : ""
                        }
                      >★
                      </span>
                    )
                  )}

                </div>
                <strong>
                  {Number(calificacion.puntuacion).toFixed(1)} / 5
                </strong>
                <p>
                  “{calificacion.comentario}”
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="detalle-error">
            {error}
          </div>

        )}


      </main>

      <Footer />

    </div>

  );

}

export default DetallePedido;