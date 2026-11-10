import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import "./historialCompras.css";

const API_URL = "http://localhost:3000";

function HistorialCompras() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);
        setError("");
        const token = localStorage.getItem("token");

        const respuesta = await fetch(`${API_URL}/api/pedidos/historial`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const datos = await respuesta.json();
        if (!respuesta.ok) {
          throw new Error( datos.message || "No se pudo cargar el historial");

        }

        setCompras(datos.compras || []);
      } catch (error) {

        console.error(
          "Error cargando historial:",
          error
        );

        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, []);

  return (
    <div className="historial-page">
      <Header />

      <main className="historial-contenido">

        <button
          type="button"
          className="historial-volver"
          onClick={() => navigate("/tienda_principal")}
        >
          ← Volver a la tienda
        </button>

        <section className="historial-encabezado">
          <span>
            ✧ MIS COMPRAS
          </span>
          <h1>
            Historial de compras
          </h1>
          <p>
            Consultá tus pedidos, confirmá
            entregas y calificá tus compras.
          </p>
        </section>

        {cargando && (
          <div className="historial-vacio">
            Cargando tus compras...
          </div>
        )}

        {!cargando && error && (
          <div className="historial-error">
            {error}
          </div>
        )}


        {!cargando &&
          !error &&
          compras.length === 0 && (
          <div className="historial-vacio">
            <div className="historial-vacio-icono">
              ♡
            </div>
            <h2>
              Todavía no hiciste ninguna compra
            </h2>
            <p>
              Cuando compres algo,
              vas a poder seguir tu pedido desde acá.
            </p>
            <button
              type="button"
              onClick={() => navigate("/Tienda")}
            >Ir a la tienda
            </button>
          </div>
        )}

        {!cargando &&
          compras.length > 0 && (
          <section className="historial-lista">
            {compras.map((compra) => {
              const recibido = Boolean(compra.recibido);
              const calificada = Boolean(compra.id_calificacion);
              return (
                <article
                  className="historial-card"
                  key={`${compra.id_pedido}-${compra.id_producto}`}
                >
                  <div className="historial-producto-imagen">
                    {compra.imagen ? (
                      <img
                        src={`${API_URL}${compra.imagen}`}
                        alt={compra.nombre}
                      />
                    ) : (
                      <div className="historial-sin-imagen">
                        ♡
                      </div>
                    )}
                  </div>

                  <div className="historial-producto-info">
                    <div className="historial-card-superior">
                      <div>
                        <span className="historial-numero-pedido">
                          Pedido #{compra.id_pedido}
                        </span>
                        <h2>
                          {compra.nombre}
                        </h2>
                        <p>
                          {compra.categoria}
                        </p>
                      </div>

                      <span
                        className={recibido
                            ? "historial-estado entregado"
                            : "historial-estado camino"
                        }
                      >
                        {recibido
                          ? "Entregado ✓"
                          : "En camino"}
                      </span>
                    </div>

                    <div className="historial-datos">
                      <div>
                        <span>
                          Total
                        </span>
                        <strong>
                          $
                          {Number(compra.sub_total).toLocaleString("es-AR")}
                        </strong>
                      </div>
                      <div>
                        <span>
                          Pago
                        </span>
                        <strong>
                          {compra.metodo === "efectivo" ? "Efectivo" : "Tarjeta"}
                        </strong>
                      </div>
                      <div>
                        <span> Fecha </span>
                        <strong>
                          {compra.fecha_pedido ? new Date( `${compra.fecha_pedido}T00:00:00`).toLocaleDateString("es-AR")
                            : "-"}
                        </strong>
                      </div>
                    </div>

                    {calificada && (
                      <div className="historial-calificacion">
                        <div className="historial-estrellas">
                          {[1,2,3,4,5].map((estrella) => (
                              <span
                                key={estrella}className={estrella <= Math.round(
                                    Number(compra.puntuacion)
                                  )? "activa" : ""
                                }
                              >★</span>
                            )
                          )}
                        </div>
                        <span>
                          {Number(compra.puntuacion).toFixed(1)} / 5
                        </span>
                      </div>
                    )}

                    <div className="historial-acciones">
                      <button
                        type="button"
                        className="btn-ver-pedido"
                        onClick={() => navigate(`/pedido/${compra.id_pedido}`)
                        }
                      >
                        {!recibido ? "Ver estado del pedido" : !calificada
                            ? "Ver pedido y calificar"
                            : "Ver pedido"}
                        <span>
                          →
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

      </main>

      <Footer />

    </div>

  );

}

export default HistorialCompras;