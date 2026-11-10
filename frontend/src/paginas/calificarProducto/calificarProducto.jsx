import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import "./calificarProducto.css";

function CalificarProducto() {
  const navigate = useNavigate();
  const {idPedido} = useParams();
  const [producto, setProducto] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const token = localStorage.getItem("token");

        const respuesta = await fetch(
          `http://localhost:3000/api/pedidos/${idPedido}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.message || "No se pudo cargar la compra");
        }

        setProducto(datos.producto);

      } catch (error) {
        setError(error.message);
      }
    };

    cargarPedido();
  }, [idPedido]);

  const enviarCalificacion = async () => {
    try {
      if (puntuacion === 0) {
        setError("Seleccioná una cantidad de estrellas");
        return;
      }

      if (!comentario.trim()) {
        setError("Escribí un comentario");
        return;
      }

      setEnviando(true);
      setError("");

      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        "http://localhost:3000/api/calificaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            idPedido: Number(idPedido),
            puntuacion,
            comentario
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "No se pudo guardar la calificación");
      }

      navigate("/paginaPrincipal");

    } catch (error) {
      setError(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="calificar-page">
      <Header />

      <main className="calificar-contenido">

        <div className="calificar-card">

          <span className="calificar-subtitulo">
            COMPRA RECIBIDA
          </span>

          <h1>¿Qué te pareció tu compra?</h1>

          <p className="calificar-descripcion">
            Tu opinión ayuda a otros usuarios a comprar con más confianza.
          </p>


          {producto && (
            <div className="calificar-producto">

              {producto.imagen && (
                <img
                  src={`http://localhost:3000${producto.imagen}`}
                  alt={producto.nombre}
                />
              )}

              <div>
                <span>Producto</span>
                <h3>{producto.nombre}</h3>
              </div>

              <span className="producto-vendido">
                Vendido
              </span>

            </div>
          )}


          <div className="estrellas-calificacion">

            {[1, 2, 3, 4, 5].map((estrella) => (
              <button
                key={estrella}
                type="button"
                className={estrella <= puntuacion ? "estrella activa" : "estrella"}
                onClick={() => setPuntuacion(estrella)}
              >
                ★
              </button>
            ))}

          </div>


          <textarea
            maxLength={50}
            placeholder="Contanos cómo fue tu experiencia..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <span className="contador-comentario">
            {comentario.length}/50
          </span>


          {error && (
            <div className="calificar-error">
              {error}
            </div>
          )}


          <button
            type="button"
            className="btn-enviar-calificacion"
            onClick={enviarCalificacion}
            disabled={enviando}
          >
            {enviando
              ? "Guardando..."
              : "Publicar calificación ✧"}
          </button>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default CalificarProducto;