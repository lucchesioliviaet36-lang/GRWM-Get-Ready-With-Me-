import { useState, useRef, useEffect } from 'react';
import './crear_historia.css';

const API_URL = 'http://localhost:3000';

export function CrearHistoria({ onVolver, onHistoriaCreada }) {
  const videoRef = useRef(null);
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    async function iniciarCamara() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
      }
    }

    iniciarCamara();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const convertirDataUrlABlob = async (dataUrl, nombreArchivo) => {
    const respuesta = await fetch(dataUrl);
    const blob = await respuesta.blob();
    return new File([blob], nombreArchivo, { type: blob.type || 'image/png' });
  };

  const tomarFoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imagenUrl = canvas.toDataURL('image/png');
    setFotoCapturada(imagenUrl);
  };

  const manejarSeleccionArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const urlLocal = URL.createObjectURL(archivo);
      setFotoCapturada(urlLocal);
    }
  };

  const guardarHistoria = async () => {
    if (!fotoCapturada) return;

    const token = localStorage.getItem('token');
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    const authHeader = token ? 'Bearer ' + token : '';

    if (!token) {
      alert('Debes iniciar sesión para compartir una historia.');
      return;
    }

    setSubiendo(true);

    try {
      const formData = new FormData();
      let archivoImagen;

      if (fotoCapturada.startsWith('data:image')) {
        archivoImagen = await convertirDataUrlABlob(fotoCapturada, 'historia-' + Date.now() + '.png');
      } else {
        archivoImagen = await fetch(fotoCapturada)
          .then((res) => res.blob())
          .then((blob) => new File([blob], 'historia-' + Date.now() + '.png', { type: blob.type || 'image/png' }));
      }

      formData.append('imagen', archivoImagen);

      const idUsuario = usuarioGuardado?.id ?? usuarioGuardado?.id_usuario;
      if (idUsuario) {
        formData.append('id_usuario', String(idUsuario));
      }

      const respuesta = await fetch(API_URL + '/api/historias/historia', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data?.error || 'No se pudo guardar la historia');
      }

      if (onHistoriaCreada) {
        onHistoriaCreada();
      }

      setFotoCapturada(null);
      if (onVolver) {
        onVolver();
      }
    } catch (error) {
      console.error('Error al subir la historia:', error);
      alert(error.message || 'Error al guardar la historia');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className='crear-historia-container'>
      <button className='btn-cerrar' onClick={onVolver}>✕</button>

      {fotoCapturada ? (
        <div className='vista-previa'>
          <img src={fotoCapturada} alt='Historia previa' />
          <div className='acciones-previa'>
            <button onClick={() => setFotoCapturada(null)}>Repetir / Elegir otra</button>
            <button className='btn-subir' onClick={guardarHistoria} disabled={subiendo}>
              {subiendo ? 'Subiendo...' : 'Compartir historia 🚀'}
            </button>
          </div>
        </div>
      ) : (
        <div className='camara-wrapper'>
          <video ref={videoRef} autoPlay playsInline className='video-camara'></video>

          <div className='controles-inferiores'>
            <label className='btn-fototeca'>
              📁 Galería
              <input
                type='file'
                accept='image/*'
                onChange={manejarSeleccionArchivo}
                style={{ display: 'none' }}
              />
            </label>

            <button className='btn-disparador' onClick={tomarFoto}></button>
          </div>
        </div>
      )}
    </div>
  );
}
