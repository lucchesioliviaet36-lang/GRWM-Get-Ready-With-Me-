import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pago.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";


function Pago() {

  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState(null); 
  const [pagoConfirmado, setPagoConfirmado] = useState(false); 
  const [quiereEnvio, setQuiereEnvio] = useState(false);


  const etapasEnvio = [
    { id: 1, titulo: "En preparación", status: "Completed", time: "Hoy, 10:00 AM" },
    { id: 2, titulo: "Listo", status: "In Progress", time: "Pendiente" },
    { id: 3, titulo: "En manos del repartidor", status: "Pending", time: "-" },
    { id: 4, titulo: "En camino", status: "Pending", time: "-" },
    { id: 5, titulo: "Entregado", status: "Pending", time: "-" }
  ];


  return (

    <div className="pago-page">


      <Header />


      <main className="pago-contenido">

        <h1>Finalizar Compra</h1>


        {!pagoConfirmado ? (

          <>

            {/* SECCIÓN 1: ELECCIÓN DE MÉTODO DE PAGO */}

            <section className="seccion-metodo-pago">

              <h2>Elegí tu método de pago</h2>

              <div className="opciones-pago-grid">
                

                {/* OPCIÓN: TARJETA ROSA */}

                <div 
                  className={`opcion-card-wrapper ${metodoPago === 'tarjeta' ? 'seleccionado' : ''}`}
                  onClick={() => setMetodoPago('tarjeta')}
                >

                  <div className="flip-card">

                    <div className="flip-card-inner">

                      <div className="flip-card-front">
                        <p className="heading_8264">MASTERCARD</p>
                        <div className="chip"></div>
                        <p className="number">9759 2484 5269 6776</p>
                      </div>

                      <div className="flip-card-back">
                        <div className="strip"></div>
                        <div className="mstrip"></div>
                        <div className="sstrip">
                          <p className="code">***</p>
                        </div>
                      </div>

                    </div>

                  </div>

                  <p className="label-pago">Tarjeta de Crédito/Débito</p>

                </div>


                {/* OPCIÓN: MONEDA ROSA (Fuente: cash adaptada) */}

                <div 
                  className={`opcion-cash-wrapper ${metodoPago === 'efectivo' ? 'seleccionado' : ''}`}
                  onClick={() => setMetodoPago('efectivo')}
                >

                  <div className="coin-flip-container">

                    <div className="coin-inner">

                      <div className="coin-front">
                        <span className="engraving">$</span>
                      </div>

                      <div className="coin-back">
                        <span className="engraving">$</span>
                      </div>

                    </div>

                  </div>

                  <p className="label-pago">Efectivo en Punto de Venta</p>

                </div>


              </div>

            </section>


            {/* FORMULARIO DINÁMICO DE TARJETA */}

            {metodoPago === 'tarjeta' && (

              <section className="form-tarjeta-datos animate-fade-in">

                <h3>Datos de la Tarjeta</h3>

                <div className="pago-form-grid">

                  <input type="text" placeholder="Nombre en la tarjeta" required />

                  <input type="text" placeholder="Número de tarjeta" required />

                  <div className="form-row">
                    <input type="text" placeholder="MM/YY" required />
                    <input type="text" placeholder="CVV" required />
                  </div>

                </div>

              </section>

            )}


            {metodoPago && (

              <button 
                className="btn-confirmar-pago"
                onClick={() => setPagoConfirmado(true)}
              >
                Confirmar Pago ✧
              </button>

            )}

          </>

        ) : (

          /* SECCIÓN 2: ENVÍO (Solo tras confirmar el pago) */

          <section className="seccion-envio animate-fade-in">

            <div className="mensaje-exito-pago">
              <h2>¡Pago confirmado con éxito! </h2>
            </div>
            

            <div className="envio-toggle">

              <label>

                <input 
                  type="checkbox" 
                  checked={quiereEnvio} 
                  onChange={(e) => setQuiereEnvio(e.target.checked)} 
                />

                ¿Querés que te lo enviemos? 

              </label>

            </div>


            {/* PROCESO DE ENVÍO */}

            {quiereEnvio && (

              <div className="stepper-container-pago">

                <h3>Estado de tu Pedido</h3>

                <div className="stepper-box">

                  {etapasEnvio.map((etapa) => (

                    <div 
                      key={etapa.id} 
                      className={`stepper-step stepper-${etapa.status.toLowerCase()}`}
                    >

                      <div className="stepper-line"></div>

                      <div className="stepper-circle">
                        {etapa.status === "Completed" ? "✓" : etapa.id}
                      </div>

                      <div className="stepper-content">
                        <div className="stepper-title">{etapa.titulo}</div>
                        <div className="stepper-status">{etapa.status}</div>
                        <div className="stepper-time">{etapa.time}</div>
                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}


            <button 
              className="btn-confirmar-pago" 
              onClick={() => navigate("/paginaPrincipal")}
            >
              Volver al Inicio
            </button>


          </section>

        )}


      </main>


      <Footer />


    </div>

  );

}


export default Pago;
