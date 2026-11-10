import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./pago.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

function Pago() {
  const navigate = useNavigate();
  const {id} = useParams();

  const [metodoPago, setMetodoPago] = useState(null);
  const [mostrarSaldoModal, setMostrarSaldoModal] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [faltante, setFaltante] = useState(0);
  const [montoCarga, setMontoCarga] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");


  // =========================
  // COMPRA CON SALDO
  // =========================

  const comprarConSaldo = async () => {
    try {
      setProcesando(true);
      setErrorPago("");

      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        "http://localhost:3000/api/pagos/comprar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            idProducto: Number(id)
          })
        }
      );

      const datos = await respuesta.json();


      // SALDO INSUFICIENTE
      if (
        respuesta.status === 409 &&
        datos.codigo === "SALDO_INSUFICIENTE"
      ) {
        setSaldo(Number(datos.saldo));
        setFaltante(Number(datos.faltante));
        setMontoCarga(datos.faltante);
        setMostrarSaldoModal(true);
        return;
      }


      if (!respuesta.ok) {
        throw new Error(
          datos.message ||
          "No se pudo realizar el pago"
        );
      }


      setMostrarSaldoModal(false);


      // IR AL ESTADO DEL PEDIDO
      navigate(
        `/pedido/${datos.pedido.id_pedido}`
      );

    } catch (error) {
      console.error(
        "Error realizando compra:",
        error
      );

      setErrorPago(error.message);

    } finally {
      setProcesando(false);
    }
  };


  // =========================
  // COMPRA EN EFECTIVO
  // =========================

  const comprarEnEfectivo = async () => {
    try {
      setProcesando(true);
      setErrorPago("");

      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        "http://localhost:3000/api/pagos/comprar-efectivo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            idProducto: Number(id)
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message ||
          "No se pudo registrar la compra"
        );
      }


      // IR AL ESTADO DEL PEDIDO
      navigate(
        `/pedido/${datos.pedido.id_pedido}`
      );

    } catch (error) {
      console.error(
        "Error comprando en efectivo:",
        error
      );

      setErrorPago(error.message);

    } finally {
      setProcesando(false);
    }
  };


  // =========================
  // CONFIRMAR PAGO
  // =========================

  const confirmarPago = async () => {
    if (metodoPago === "tarjeta") {
      await comprarConSaldo();
      return;
    }

    if (metodoPago === "efectivo") {
      await comprarEnEfectivo();
    }
  };


  // =========================
  // CARGAR SALDO
  // =========================

  const cargarSaldo = async () => {
    try {
      if (
        !montoCarga ||
        Number(montoCarga) <= 0
      ) {
        setErrorPago(
          "Ingresá un monto válido"
        );
        return;
      }

      setProcesando(true);
      setErrorPago("");

      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        "http://localhost:3000/api/pagos/cargar-saldo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            monto: Number(montoCarga)
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message ||
          "No se pudo cargar saldo"
        );
      }

      setSaldo(Number(datos.saldo));
      setMostrarSaldoModal(false);
      setMontoCarga("");


      // INTENTAR LA COMPRA NUEVAMENTE
      await comprarConSaldo();

    } catch (error) {
      console.error(
        "Error cargando saldo:",
        error
      );

      setErrorPago(error.message);

    } finally {
      setProcesando(false);
    }
  };


  return (

    <div className="pago-page">


      <Header />


      <main className="pago-contenido">


        <h1>
          Finalizar Compra
        </h1>


        {/* ========================= */}
        {/* MÉTODOS DE PAGO */}
        {/* ========================= */}

        <section className="seccion-metodo-pago">

          <h2>
            Elegí tu método de pago
          </h2>


          <div className="opciones-pago-grid">


            {/* ========================= */}
            {/* TARJETA ROSA */}
            {/* ========================= */}

            <div
              className={`opcion-card-wrapper ${
                metodoPago === "tarjeta"
                  ? "seleccionado"
                  : ""
              }`}
              onClick={() =>
                setMetodoPago("tarjeta")
              }
            >

              <div className="flip-card">

                <div className="flip-card-inner">


                  <div className="flip-card-front">

                    <p className="heading_8264">
                      MASTERCARD
                    </p>

                    <div className="chip">
                    </div>

                    <p className="number">
                      9759 2484 5269 6776
                    </p>

                  </div>


                  <div className="flip-card-back">

                    <div className="strip">
                    </div>

                    <div className="mstrip">
                    </div>

                    <div className="sstrip">

                      <p className="code">
                        ***
                      </p>

                    </div>

                  </div>


                </div>

              </div>


              <p className="label-pago">
                Tarjeta de Crédito/Débito
              </p>

            </div>


            {/* ========================= */}
            {/* EFECTIVO */}
            {/* ========================= */}

            <div
              className={`opcion-cash-wrapper ${
                metodoPago === "efectivo"
                  ? "seleccionado"
                  : ""
              }`}
              onClick={() =>
                setMetodoPago("efectivo")
              }
            >

              <div className="coin-flip-container">

                <div className="coin-inner">


                  <div className="coin-front">

                    <span className="engraving">
                      $
                    </span>

                  </div>


                  <div className="coin-back">

                    <span className="engraving">
                      $
                    </span>

                  </div>


                </div>

              </div>


              <p className="label-pago">
                Efectivo en Punto de Venta
              </p>

            </div>


          </div>

        </section>


        {/* ========================= */}
        {/* DATOS DE TARJETA */}
        {/* ========================= */}

        {metodoPago === "tarjeta" && (

          <section className="form-tarjeta-datos animate-fade-in">

            <h3>
              Datos de la Tarjeta
            </h3>


            <div className="pago-form-grid">

              <input
                type="text"
                placeholder="Nombre en la tarjeta"
              />

              <input
                type="text"
                placeholder="Número de tarjeta"
              />


              <div className="form-row">

                <input
                  type="text"
                  placeholder="MM/YY"
                />

                <input
                  type="text"
                  placeholder="CVV"
                />

              </div>


            </div>

          </section>

        )}


        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {errorPago && !mostrarSaldoModal && (

          <p className="error-pago">
            {errorPago}
          </p>

        )}


        {/* ========================= */}
        {/* CONFIRMAR PAGO */}
        {/* ========================= */}

        {metodoPago && (

          <button
            className="btn-confirmar-pago"
            onClick={confirmarPago}
            disabled={procesando}
          >

            {procesando
              ? "Procesando..."
              : "Confirmar Pago ✧"}

          </button>

        )}


      </main>


      {/* ========================= */}
      {/* MODAL DE SALDO */}
      {/* ========================= */}

      {mostrarSaldoModal && (

        <div className="saldo-modal-overlay">

          <div className="saldo-modal">


            <button
              type="button"
              className="saldo-modal-cerrar"
              onClick={() =>
                setMostrarSaldoModal(false)
              }
            >
              ×
            </button>


            <div className="saldo-modal-icono">
              $
            </div>


            <h2>
              Saldo insuficiente
            </h2>


            <p className="saldo-modal-texto">
              No tenés suficiente saldo para completar esta compra.
            </p>


            <div className="saldo-modal-info">


              <div>

                <span>
                  Tu saldo
                </span>

                <strong>
                  $
                  {saldo.toLocaleString(
                    "es-AR"
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Te falta
                </span>

                <strong>
                  $
                  {faltante.toLocaleString(
                    "es-AR"
                  )}
                </strong>

              </div>


            </div>


            <label className="saldo-modal-label">
              ¿Cuánto querés agregar?
            </label>


            <div className="saldo-input-container">

              <span>
                $
              </span>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={montoCarga}
                onChange={(e) =>
                  setMontoCarga(
                    e.target.value
                  )
                }
              />

            </div>


            {errorPago && (

              <p className="error-pago-modal">
                {errorPago}
              </p>

            )}


            <button
              type="button"
              className="btn-cargar-saldo"
              onClick={cargarSaldo}
              disabled={procesando}
            >

              {procesando
                ? "Cargando..."
                : "Agregar saldo y continuar"}

            </button>


            <button
              type="button"
              className="btn-cancelar-saldo"
              onClick={() =>
                setMostrarSaldoModal(false)
              }
            >
              Cancelar
            </button>


          </div>

        </div>

      )}


      <Footer />


    </div>

  );
}


export default Pago;