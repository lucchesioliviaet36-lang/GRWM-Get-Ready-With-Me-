import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./inspiracion_chat.css";

function ChatIA() {
  const navigate = useNavigate();
  
  // Estados de la lógica original
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      remitente: "mila",
      contenido: "¡Hola, Bella! Soy Mila, tu asistente de moda inteligente. ¿En qué puedo ayudarte a brillar hoy? ✨",
      tipo: "texto"
    }
  ]);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false); // Lógica del header
  const mensajesFinRef = useRef(null);

  const fotoPerfilPropio = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100";

  // Conversaciones Recientes de la fuente chat-desktop
  const historial = [
    { id: 1, titulo: "Cena elegante de noche", activa: true },
    { id: 2, titulo: "Look casual de oficina", activa: false },
    { id: 3, titulo: "Accesorios para vestido rojo", activa: false }
  ];

  const scrollToBottom = () => {
    mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const enviarMensaje = (e) => {
    if (e) e.preventDefault();
    if (!nuevoTexto.trim()) return;

    const msgUsuario = {
      id: Date.now(),
      remitente: "usuario",
      contenido: nuevoTexto,
      tipo: "texto"
    };

    setMensajes((prev) => [...prev, msgUsuario]);
    setNuevoTexto("");
    setCargando(true);

    // Respuesta elegante de Mila (Simulada)
    setTimeout(() => {
      const respuestaMila = {
        id: Date.now() + 1,
        remitente: "mila",
        contenido: "¡Por supuesto! Para esa cena especial, diseñé esta propuesta sofisticada con contrastes clásicos y toques dorados que elevarán tu look:",
        tipo: "propuesta_outfit",
        outfit: [
          { id: 1, nombre: "Blusa de seda negra", tag: "PARTE DE ARRIBA", img: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=300" },
          { id: 2, nombre: "Pantalón sastre gris", tag: "PARTE DE ABAJO", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300" },
          { id: 3, nombre: "Stilettos negros", tag: "ZAPATOS", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300" }
        ]
      };
      setMensajes((prev) => [...prev, respuestaMila]);
      setCargando(false);
    }, 1500);
  };

  return (
    <div className="chat-ia-page">
      
      {/* HEADER INTERACTIVO GRWM */}
      <header className="barra-superior">
        <div className="logo" onClick={() => navigate('/perfil_propio')}>
          ✧ <span>GRWM</span>
        </div>

        <nav className="menu">
          <button onClick={() => navigate('/miArmario')}>Mi Armario</button>
          <button onClick={() => navigate('/tienda_principal')}>Tienda</button>
          
          <div className="mini-avatar-contenedor">
            <div 
              className={`mini-avatar ${menuAbierto ? 'activo' : ''}`} 
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <img src={fotoPerfilPropio} alt="Perfil" />
            </div>

            {menuAbierto && (
              <div className="menu-desplegable-perfil">
                <div className="menu-usuario-detalles">
                  <strong>Taylor Swift</strong>
                  <span>@taylor_swift13</span>
                </div>
                <div className="menu-divisor"></div>
                <button onClick={() => navigate('/perfil_propio')}>Mi Perfil</button>
                <button className="menu-btn-logout" onClick={() => navigate('/')}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="chat-ia-layout">
        
        {/* SIDEBAR IZQUIERDO ESTILO MILA */}
        <aside className="mila-sidebar">
          <div className="mila-brand">
            <div className="mila-logo-circle">✧</div>
            <div className="mila-brand-text">
              <strong>MILA AI</strong>
              <span>ASISTENTE DE ESTILO</span>
            </div>
          </div>

          <button className="btn-nueva-conversa">+ Nueva conversación</button>

          <div className="historial-lista">
            <h4>CONVERSACIONES RECIENTES</h4>
            {historial.map(item => (
              <div key={item.id} className={`historial-item ${item.activa ? 'activa' : ''}`}>
                <span className="historial-icon">💬</span> {item.titulo}
              </div>
            ))}
          </div>

          <div className="sidebar-user-footer">
            <img src={fotoPerfilPropio} alt="User" />
            <div className="user-info-min">
              <strong>Sofia Romero</strong>
              <span>Suscripción Premium</span>
            </div>
          </div>
        </aside>

        {/* ÁREA DE CHAT PRINCIPAL */}
        <main className="mila-chat-main">
          
          <header className="mila-chat-header">
            <div className="mila-status">
              <div className="mila-avatar-small">✨</div>
              <div>
                <h3>Mila — Tu Estilista Personal</h3>
                <span className="status-online">● Activa ahora</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn-icon-header">🔗</button>
              <button className="btn-icon-header">⋯</button>
            </div>
          </header>

          <div className="mila-mensajes-container">
            {mensajes.map((m) => (
              <div key={m.id} className={`mila-mensaje-fila ${m.remitente}`}>
                
                {m.remitente === 'mila' && <div className="mila-msg-avatar">✨</div>}
                
                <div className="mila-msg-cuerpo">
                  <div className="mila-burbuja">
                    <p>{m.contenido}</p>
                  </div>

                  {/* GRID DE OUTFIT ELEGANTE */}
                  {m.tipo === 'propuesta_outfit' && (
                    <div className="mila-outfit-grid">
                      {m.outfit.map((item) => (
                        <div key={item.id} className="mila-outfit-card">
                          <div className="mila-card-img">
                            <img src={item.img} alt={item.nombre} />
                            <span className="mila-card-tag">{item.tag}</span>
                          </div>
                          <div className="mila-card-info">
                            <p>{item.nombre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {cargando && <div className="mila-typing">Mila está diseñando tu look...</div>}
            <div ref={mensajesFinRef} />
          </div>

          {/* INPUT BAR ESTILO CHAT-EMPTY-STATE */}
          <footer className="mila-input-area">
            <form className="mila-input-form" onSubmit={enviarMensaje}>
              <button type="button" className="btn-mila-mic">🎙</button>
              <input 
                type="text" 
                placeholder="Contame qué te gustaría vestir hoy..." 
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
              />
              <button type="submit" className="btn-mila-send">↑</button>
            </form>
            <p className="mila-disclaimer">
              Mila puede ayudarte a combinar prendas, sugerir paletas de colores y encontrar tu look ideal.
            </p>
          </footer>
        </main>

      </div>
    </div>
  );
}

export default ChatIA;
