import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";

import "./agregar_prenda.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

function AgregarPrenda() {
  const navigate = useNavigate();
  const inputImagenRef = useRef(null);

  const [imagenOriginal, setImagenOriginal] = useState("");
  const [previewImagen, setPreviewImagen] = useState("");
  const [mostrarRecorte, setMostrarRecorte] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaRecortada, setAreaRecortada] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    color: "",
    descripcion: "",
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Seleccioná un archivo de imagen válido.");
      e.target.value = "";
      return;
    }

    setError("");
    const urlImagen = URL.createObjectURL(archivo);
    setImagenOriginal(urlImagen);
    setMostrarRecorte(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAreaRecortada(null);
  };

  const completarRecorte = (_area, areaPixels) => {
    setAreaRecortada(areaPixels);
  };

  const crearImagenRecortada = (imagenSrc, pixelCrop) =>
    new Promise((resolve, reject) => {
      if (!pixelCrop) {
        reject(new Error("Primero ajustá el recorte de la imagen."));
        return;
      }

      const imagenCargada = new Image();
      imagenCargada.onload = () => {
        const canvas = document.createElement("canvas");
        const contexto = canvas.getContext("2d");

        if (!contexto) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        contexto.drawImage(
          imagenCargada,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo generar la imagen recortada."));
          },
          "image/jpeg",
          0.9
        );
      };

      imagenCargada.onerror = () =>
        reject(new Error("No se pudo cargar la imagen seleccionada."));
      imagenCargada.src = imagenSrc;
    });

  const confirmarRecorte = async () => {
    try {
      const blob = await crearImagenRecortada(imagenOriginal, areaRecortada);
      const nuevaPreview = URL.createObjectURL(blob);

      setPreviewImagen((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return nuevaPreview;
      });
      cancelarRecorte(false);
    } catch (err) {
      console.error("Error al recortar la imagen:", err);
      setError(err.message || "No se pudo recortar la imagen.");
    }
  };

  const cancelarRecorte = (limpiarInput = true) => {
    if (imagenOriginal) URL.revokeObjectURL(imagenOriginal);
    setImagenOriginal("");
    setMostrarRecorte(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAreaRecortada(null);

    if (limpiarInput && inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  const quitarImagen = () => {
    if (previewImagen) URL.revokeObjectURL(previewImagen);
    setPreviewImagen("");
    if (inputImagenRef.current) inputImagenRef.current.value = "";
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError("");

    const nombre = formData.nombre.trim();
    const color = formData.color.trim();
    const descripcion = formData.descripcion.trim();

    if (!nombre || !formData.categoria || !color || !descripcion) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró una sesión activa. Iniciá sesión nuevamente.");
      return;
    }

    try {
      setGuardando(true);

      const response = await fetch("http://localhost:3000/api/prendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          categoria: formData.categoria,
          color,
          descripcion,
          origen: "manual",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.mensaje || "No se pudo guardar la prenda."
        );
      }

      alert("¡Prenda agregada con éxito!");
      navigate("/miArmario");
    } catch (err) {
      console.error("Error al agregar la prenda:", err);
      setError(err.message || "Ocurrió un error al guardar la prenda.");
    } finally {
      setGuardando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="Armario-Page">
      <Header />

      <main className="armario-contenido">
        <section className="formulario-header">
          <button
            className="boton-volver"
            type="button"
            onClick={() => navigate("/miArmario")}
          >
            ← Volver al armario
          </button>

          <h1>Nueva prenda</h1>
          <p>Completá los detalles para sumar una nueva prenda a tu colección.</p>
        </section>

        <form className="form-agregar-prenda" onSubmit={enviarFormulario}>
          <div className="form-grid">
            <section className="form-seccion-imagen" aria-label="Imagen de la prenda">
              <div className="preview-container">
                {previewImagen ? (
                  <div className="preview-imagen-prenda">
                    <img src={previewImagen} alt="Vista previa de la prenda" />
                    <button
                      type="button"
                      className="boton-quitar-imagen"
                      onClick={quitarImagen}
                      aria-label="Quitar imagen"
                      title="Quitar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="preview-vacio">
                    <span className="preview-icono">✧</span>
                    <h3>¿Querés agregar una imagen?</h3>
                    <p>Podés guardar la prenda sin foto y agregarla más adelante.</p>
                  </div>
                )}
              </div>

              <input
                ref={inputImagenRef}
                type="file"
                accept="image/*"
                onChange={seleccionarImagen}
                className="input-archivo-oculto"
              />

              <button
                type="button"
                className="boton-archivo"
                onClick={() => inputImagenRef.current?.click()}
              >
                ✧ {previewImagen ? "Cambiar imagen" : "Subir imagen"}
              </button>

              {mostrarRecorte && (
                <div className="modal-recorte-fondo">
                  <div
                    className="modal-recorte"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-recorte"
                  >
                    <div className="modal-recorte-header">
                      <div>
                        <span>✧ AJUSTAR IMAGEN</span>
                        <h2 id="titulo-recorte">Recortá tu prenda</h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => cancelarRecorte()}
                        aria-label="Cerrar recorte"
                      >
                        ×
                      </button>
                    </div>

                    <div className="contenedor-cropper">
                      <Cropper
                        image={imagenOriginal}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 5}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={completarRecorte}
                      />
                    </div>

                    <div className="control-zoom">
                      <span aria-hidden="true">−</span>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        aria-label="Zoom de la imagen"
                      />
                      <span aria-hidden="true">+</span>
                    </div>

                    <p className="texto-recorte">
                      Mové la imagen y usá el control para acercar o alejar.
                    </p>

                    <div className="acciones-recorte">
                      <button
                        type="button"
                        className="boton-cancelar-recorte"
                        onClick={() => cancelarRecorte()}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="boton-confirmar-recorte"
                        onClick={confirmarRecorte}
                        disabled={!areaRecortada}
                      >
                        ✧ Usar imagen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="form-campos">
              <div className="campo-grupo">
                <label htmlFor="nombre">Nombre de la prenda *</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Ej.: Remera blanca"
                  value={formData.nombre}
                  onChange={manejarCambio}
                  maxLength={50}
                  required
                />
              </div>

              <div className="campo-row">
                <div className="campo-grupo">
                  <label htmlFor="categoria">Categoría *</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="remeras">Remeras</option>
                    <option value="abrigos">Abrigos</option>
                    <option value="partes_abajo">Partes de abajo</option>
                    <option value="zapatos">Zapatos</option>
                    <option value="carteras">Carteras</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>

                <div className="campo-grupo">
                  <label htmlFor="color">Color *</label>
                  <input
                    id="color"
                    type="text"
                    name="color"
                    placeholder="Ej.: Beige"
                    value={formData.color}
                    onChange={manejarCambio}
                    maxLength={40}
                    required
                  />
                </div>
              </div>

              <div className="campo-grupo">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ej.: Remera básica de manga corta..."
                  value={formData.descripcion}
                  onChange={manejarCambio}
                  maxLength={500}
                  required
                />
              </div>

              {error && (
                <div className="mensaje-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="boton-guardar-prenda"
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar prenda ✧"}
              </button>
            </section>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default AgregarPrenda;
