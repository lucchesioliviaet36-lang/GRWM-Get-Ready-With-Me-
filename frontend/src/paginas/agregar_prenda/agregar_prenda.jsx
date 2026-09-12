import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./agregar_prenda.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

function AgregarPrenda() {
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    color: "",
    descripcion: ""
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);


  // =========================================================
  // CAMBIOS EN LOS CAMPOS DEL FORMULARIO
  // =========================================================

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };


  // =========================================================
  // GUARDAR PRENDA
  // =========================================================

  const enviarFormulario = async (e) => {
    e.preventDefault();

    setError("");

    if (
      formData.nombre.trim() === "" ||
      formData.categoria === "" ||
      formData.color.trim() === "" ||
      formData.descripcion.trim() === ""
    ) {
      setError("Complete todos los campos obligatorios");
      return;
    }

    try {
      setGuardando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No se encontró una sesión activa");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/prendas",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            nombre: formData.nombre,
            categoria: formData.categoria,
            color: formData.color,
            descripcion: formData.descripcion,
            origen: "manual"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "No se pudo guardar la prenda"
        );
      }

      alert("¡Prenda agregada con éxito!");

      navigate("/miArmario");

    } catch (error) {
      console.error("Error al agregar la prenda:", error);

      setError(error.message);

    } finally {
      setGuardando(false);
    }
  };


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const cerrarSesion = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="Armario-Page">

       <Header />

      <main className="armario-contenido">
        <section className="formulario-header">

          <button className="boton-volver" type="button" onClick={() => navigate("/miArmario")} >
            ← Volver al armario
          </button>

          <h1> Nueva Prenda </h1>
          <p> Completá los detalles para sumar una nueva pieza a tu colección personal. </p>

        </section>

        <form
          className="form-agregar-prenda"
          onSubmit={enviarFormulario}
        >

          <div className="form-grid">
            <div className="form-seccion-imagen">
              <div className="preview-container">
                <div className="preview-vacio">
                  <span className="preview-icono">
                    ✧
                  </span>
                  <h3> ¿Querés una prenda con imagen? </h3>
                  <p> Las prendas agregadas manualmente pueden guardarse sin foto. </p>
                  <p>  También podés explorar nuestro catálogo y  agregar una prenda similar con imagen. </p>
                </div>
              </div>
              <button  type="button" className="boton-archivo" onClick={() =>
                  navigate("/explorar-prendas")
                } >
                ✧ Explorar prendas
              </button>
            </div>

            <div className="form-campos">

              <div className="campo-grupo">
                <label htmlFor="nombre">
                  Nombre de la prenda *
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Ej: Remera blanca"
                  value={formData.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="campo-row">

                <div className="campo-grupo">
                  <label htmlFor="categoria">
                    Categoría *
                  </label>

                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={manejarCambio}
                    required>

                    <option value="">Seleccionar... </option>

                    <option value="remeras"> Remeras  </option>
                    <option value="abrigos"> Abrigos </option>
                    <option value="partes_abajo"> Partes de abajo </option>
                    <option value="zapatos">  Zapatos  </option>
                    <option value="carteras">Carteras</option>
                    <option value="accesorios">Accesorios </option>
                  </select>
                </div>

                <div className="campo-grupo">
                  <label htmlFor="color">
                    Color *
                  </label>

                  <input
                    id="color"
                    type="text"
                    name="color"
                    placeholder="Ej: Beige"
                    value={formData.color}
                    onChange={manejarCambio}
                    required
                  />
                </div>
              </div>

              <div className="campo-grupo">

                <label htmlFor="descripcion">
                  Descripción *
                </label>

                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ej: Remera básica de manga corta..."
                  value={formData.descripcion}
                  onChange={manejarCambio}
                  required
                />

              </div>

              {error && (
                <div className="Error-IniciarS">
                  {error}
                </div> 
            )}

              <button type="submit" className="boton-guardar-prenda" disabled={guardando} >

                {guardando ? "Guardando..." : "Guardar Prenda ✧"}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer/>
      
    </div>
  );
}

export default AgregarPrenda;