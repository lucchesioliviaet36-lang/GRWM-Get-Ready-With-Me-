import { useState, useRef, useEffect } from 'react';
import './Crear_historia.css'; // Tus estilos para que quede fachero

export function CrearHistoria({ onVolver }) {
  const videoRef = useRef(null);
  const [fotoCapturada, setFotoCapturada] = useState(null);

  // 1. Activar la cámara al cargar el componente
  useEffect(() => {
    async function iniciarCamara() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } // Cámara frontal por defecto
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        // Acá podés manejar si el usuario deniega el permiso
      }
    }

    iniciarCamara();

    // Limpieza: apagar la cámara al desmontar la vista
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 2. Función para sacar la foto con la cámara
  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imagenUrl = canvas.toDataURL('image/png');
    setFotoCapturada(imagenUrl);
  };

  // 3. Función para seleccionar foto de la fototeca del dispositivo
  const manejarSeleccionArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const urlLocal = URL.createObjectURL(archivo);
      setFotoCapturada(urlLocal);
    }
  };

  return (
    <div className="crear-historia-container">
      {/* Botón para volver atrás */}
      <button className="btn-cerrar" onClick={onVolver}>✕</button>

      {/* Si ya sacó o eligió una foto, la mostramos para confirmar */}
      {fotoCapturada ? (
        <div className="vista-previa">
          <img src={fotoCapturada} alt="Historia previa" />
          <div className="acciones-previa">
            <button onClick={() => setFotoCapturada(null)}>Repetir / Elegir otra</button>
            <button className="btn-subir" onClick={() => alert('¡Guardar/Subir historia!')}>
              Compartir historia 🚀
            </button>
          </div>
        </div>
      ) : (
        /* Si todavía no eligió nada, mostramos la cámara en vivo */
        <div className="camara-wrapper">
          <video ref={videoRef} autoPlay playsInline className="video-camara"></video>
          
          {/* Controles inferiores (Cámara + Fototeca) */}
          <div className="controles-inferiores">
            {/* Input oculto para la fototeca */}
            <label className="btn-fototeca">
              📁 Galería
              <input 
                type="file" 
                accept="image/*" 
                onChange={manejarSeleccionArchivo} 
                style={{ display: 'none' }} 
              />
            </label>

            {/* Botón central para disparar la foto */}
            <button className="btn-disparador" onClick={tomarFoto}></button>
          </div>
        </div>
      )}
    </div>
  );
}