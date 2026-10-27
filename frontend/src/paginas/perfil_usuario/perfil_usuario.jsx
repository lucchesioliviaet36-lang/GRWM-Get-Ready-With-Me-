import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './perfil_usuario.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

export default function PerfilUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [siguiendo, setSiguiendo] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState('publicaciones');
  const [fotoAgrando, setFotoAgrando] = useState(false);

  // Datos mockeados del usuario visitado
  const [usuario, setUsuario] = useState({
    nombre: 'Sofia Rossi',
    handle: '@sofia_rossi',
    biografia: 'Fashion enthusiast 💫 Amante del estilo minimalista y accesorios vintage.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    publicacionesCount: 42,
    seguidoresCount: '3.4k',
    siguiendoCount: 410,
    publicaciones: [
      { id: 1, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop', likes: 210, precio: '€65' },
      { id: 2, img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop', likes: 180 },
      { id: 3, img: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=500&auto=format&fit=crop', likes: 320, precio: '€110' },
      { id: 4, img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=500&auto=format&fit=crop', likes: 95 }
    ]
  });

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      if (!response.ok) throw new Error('No se encontró el perfil.');
      return response.json();
    }).then(({ usuario: perfil }) => {
      setUsuario({
        id_usuario: perfil.id_usuario,
        nombre: `${perfil.nombre || ''} ${perfil.apellido || ''}`.trim() || perfil.username,
        handle: perfil.username ? `@${perfil.username}` : '',
        biografia: perfil.descripcion || '',
        avatar: perfil.foto_perfil ? `http://localhost:3000${perfil.foto_perfil.startsWith('/') ? '' : '/'}${perfil.foto_perfil}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
        banner: perfil.banner ? `http://localhost:3000${perfil.banner.startsWith('/') ? '' : '/'}${perfil.banner}` : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
        publicacionesCount: 0, seguidoresCount: 0, siguiendoCount: 0, publicaciones: []
      });
    }).catch(error => console.error('Error al cargar perfil:', error));
  }, [id]);

  return (
    <div className="perfil-container">
    <div className="perfil-container">
      {/* 1. AGREGAR HEADER ACÁ */}
      <Header />

      {/* Tarjeta de Perfil */}
      <main className="perfil-card">
        <div className="perfil-banner">
          <img src={usuario.banner} alt="Portada" />
        </div>

        <div className="perfil-info-wrapper">
          <div className="perfil-header-content">
              {/* Avatar Flotante */}
            <div className="perfil-avatar-container" onClick={() => setFotoAgrando(true)}>
              <img src={usuario.avatar} alt={usuario.nombre} className="perfil-avatar" />
            </div>
            {/* Datos del usuario */}
            <div className="perfil-user-details">
              <h2>{usuario.nombre}</h2>
              <span className="user-handle">{usuario.handle}</span>
              <p className="user-bio">{usuario.biografia}</p>
            </div>

            {/* Estadísticas y Botones de Acción */}
            <div className="perfil-stats-actions">
              <div className="perfil-stats">
                <div className="stat-item">
                  <strong>{usuario.publicacionesCount}</strong>
                  <span>Publicaciones</span>
                </div>
                <div className="stat-item">
                  <strong>{usuario.seguidoresCount}</strong>
                  <span>Seguidores</span>
                </div>
                <div className="stat-item">
                  <strong>{usuario.siguiendoCount}</strong>
                  <span>Siguiendo</span>
                </div>
              </div>

              <div className="perfil-action-buttons">
                <button 
                  className={`btn-seguir ${siguiendo ? 'siguiendo' : ''}`}
                  onClick={() => setSiguiendo(!siguiendo)}
                >
                  {siguiendo ? 'Siguiendo' : 'Seguir'}
                </button>
                <button className="btn-mensaje" disabled={!usuario.id_usuario || Number(usuario.id_usuario) === Number(JSON.parse(localStorage.getItem('usuario') || '{}').id_usuario)} onClick={() => {
                  if (!localStorage.getItem('token')) { navigate('/IniciarSesion'); return; }
                  navigate(`/chat?usuarioId=${usuario.id_usuario}`);
                }}>Mensaje</button>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Perfil */}
        <div className="perfil-tabs">
          <button 
            className={`tab-btn ${pestanaActiva === 'publicaciones' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('publicaciones')}
          >
            Publicaciones
          </button>
          <button 
            className={`tab-btn ${pestanaActiva === 'ventas' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('ventas')}
          >
            Ventas
          </button>
          <button 
            className={`tab-btn ${pestanaActiva === 'armario' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('armario')}
          >
            Armario
          </button>
        </div>
      </main>
       <section className="perfil-posts-grid">
        {usuario.publicaciones.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-image-wrapper">
              <img src={post.img} alt="Post" />
            </div>
            <div className="post-card-footer">
              <span className="post-likes">♡ {post.likes}</span>
              {post.precio && <span className="post-price">{post.precio}</span>}
            </div>
          </div>
        ))}
      </section>
      {/* MODAL FOTO AGRANDADA */}
      {fotoAgrando && (
        <div className="modal-foto-overlay" onClick={() => setFotoAgrando(false)}>
          <div className="modal-foto-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar-btn" onClick={() => setFotoAgrando(false)}>✕</button>
            <img src={usuario.avatar} alt={usuario.nombre} className="foto-agrandada" />
          </div>
        </div>
      )}

      {/* 2. AGREGAR FOOTER ACÁ */}
      <Footer />
    </div>

    </div>
  );
}
