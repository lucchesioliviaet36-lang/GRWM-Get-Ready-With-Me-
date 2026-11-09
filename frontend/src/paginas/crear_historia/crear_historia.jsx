import { useState, useRef, useEffect } from 'react';
import './crear_historia.css';

const API_URL = 'http://localhost:3000';

export function CrearHistoria({ onVolver, onHistoriaCreada }) {
  const videoRef = useRef(null);
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorCamara, setErrorCamara] = useState('');

  useEffect(() => {
    async function iniciarCamara() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('La cámara no está disponible en este navegador o contexto.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        setErrorCamara(err.message || 'No se pudo acceder a la cámara.');
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

  const crearArchivoImagen = (blob) => {
    const tipo = blob.type || 'image/png';
    const extensiones = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
    };
    const extension = extensiones[tipo] || 'png';
    return new File([blob], `historia-${Date.now()}.${extension}`, { type: tipo });
  };

  const convertirDataUrlABlob = async (dataUrl) => {
    const respuesta = await fetch(dataUrl);
    const blob = await respuesta.blob();
    return crearArchivoImagen(blob);
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
        archivoImagen = await convertirDataUrlABlob(fotoCapturada);
      } else {
        archivoImagen = await fetch(fotoCapturada)
          .then((res) => res.blob())
          .then(crearArchivoImagen);
      }

      formData.append('imagen', archivoImagen);

      const respuesta = await fetch(API_URL + '/api/historias/historia', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      let data = {};
      try {
        data = await respuesta.json();
      } catch {
        data = {};
      }

      if (!respuesta.ok) {
        throw new Error(data?.error || data?.message || `No se pudo guardar la historia (${respuesta.status})`);
      }

      if (!data.historia) {
        throw new Error('El servidor no devolvió la historia guardada.');
      }

      if (onHistoriaCreada) {
        onHistoriaCreada(data.historia);
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
      <div className='captura-titulo'>Crear historia</div>
      <button className='btn-cerrar' type='button' onClick={onVolver} aria-label='Cerrar'>✕</button>

      {fotoCapturada ? (
        <div className='vista-previa'>
          <img src={fotoCapturada} alt='Historia previa' />
          <div className='acciones-previa'>
            <button type='button' onClick={() => setFotoCapturada(null)}>Elegir otra</button>
            <button className='btn-subir' type='button' onClick={guardarHistoria} disabled={subiendo}>
              {subiendo ? 'Subiendo...' : 'Compartir historia ↗ '}
            </button>
          </div>
        </div>
      ) : (
        <div className='camara-wrapper'>
          <video ref={videoRef} autoPlay playsInline className='video-camara'></video>
          {errorCamara && <p className='error-camara' role='alert'>{errorCamara}</p>}

          <div className='controles-inferiores'>
            <label className='btn-fototeca'>
              <svg className='icono-galeria' viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                <rect x='3' y='4' width='18' height='16' rx='3' />
                <circle cx='8.5' cy='9' r='1.5' />
                <path d='m21 15-5-5L5 20' />
              </svg>
              <span>Elegir foto</span>
              <input
                type='file'
                accept='image/*'
                onChange={manejarSeleccionArchivo}
                style={{ display: 'none' }}
              />
            </label>

            <button className='btn-disparador' type='button' onClick={tomarFoto} aria-label='Tomar foto'></button>
          </div>
        </div>
      )}
    </div>
  );
}
