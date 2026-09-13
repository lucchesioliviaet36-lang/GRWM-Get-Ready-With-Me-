import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import Usuario1 from "../../assets/imagenes/olivia.jpg";
import Usuario2 from "../../assets/imagenes/baddbunny.jpg";
import Usuario3 from "../../assets/imagenes/sabrina.jpg";


function Chat() {
  const navigate = useNavigate();
  const usuarioActualId = 1;

  // --- LÓGICA DE ESTADOS (Fuentes) ---
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [chatActivo, setChatActivo] = useState({
    id: 2,
    nombre: "Olivia Privv",
    username: "@notOlivia",
    avatar: Usuario1,
  });

  const [mensajesPorChat, setMensajesPorChat] = useState({
    2: [
      { id: 1, remitenteId: 2, destinatarioId: 1, contenido: "Hola, tendras el pantalon disponible? ", createdAt: "9:43 PM", tipo: "texto" },
      { id: 2, remitenteId: 1, destinatarioId: 2, contenido: "Sii, lo tenemos disponible, queres que coordinemos envio? 💖✨", createdAt: "9:44 PM", tipo: "texto" },
      { id: 3, remitenteId: 2, destinatarioId: 1, contenido: "Tenes en otros colores?", createdAt: "9:45 PM", tipo: "texto" }
    ],
    3: [
      { id: 1, remitenteId: 2, destinatarioId: 1, contenido: "Te queres juntar a cenar?", createdAt: "09:15 PM", tipo: "texto" },
      { id: 1, remitenteId: 2, destinatarioId: 1, contenido: "Porfaa", createdAt: "09:16 PM", tipo: "texto" },
      { id: 2, remitenteId: 1, destinatarioId: 2, contenido: "Bueno, dale, pasame a buscar!..", createdAt: "09:30 PM", tipo: "texto" }
    ],

    4: [{ id: 5, remitenteId: 4, destinatarioId: 1, contenido: "Me pasas medidas porfa", createdAt: "12:15 AM", tipo: "texto" }]
  });

  const [nuevoTexto, setNuevoTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("caras");
  const [busquedaEmoji, setBusquedaEmoji] = useState("");
  const mensajesFinRef = useRef(null);

  // --- CONTACTOS (Fuentes) ---
  const contactos = [
    { id: 2, nombre: "Olivia Privv", ultimoMensaje: "Tenes en otros colores?", avatar: Usuario1 },
    { id: 3, nombre: "Bad Bunny", ultimoMensaje: "Bueno, dale, pasame a buscar!..", avatar: Usuario2 },
    { id: 4, nombre: "Sabrina Carpintero", ultimoMensaje: "Me pasas medidas porfa", avatar: Usuario3 }
  ];

  // --- EMOJIS (Fuente) ---
  const emojisPorCategoria = {
    caras: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "✨", "💖", "🔥", "👑"]
  };

  // --- EFECTOS Y MANEJADORES (Fuentes) ---
  const scrollToBottom = () => { mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const mensajesActuales = mensajesPorChat[chatActivo.id] || [];

  useEffect(() => {
    setCargando(true);
    fetch(`http://localhost:5000/api/chat/${usuarioActualId}/${chatActivo.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setMensajesPorChat(prev => ({ ...prev, [chatActivo.id]: data }));
        setCargando(false);
      })
      .catch(err => { console.error("Error al cargar mensajes:", err); setCargando(false); });
  }, [chatActivo]);

  useEffect(() => { scrollToBottom(); }, [mensajesActuales, chatActivo]);

  const enviarMensaje = async (e) => {
    if (e) e.preventDefault();
    if (!nuevoTexto.trim()) return;

    const mensajeObjeto = {
      remitenteId: usuarioActualId,
      destinatarioId: chatActivo.id,
      contenido: nuevoTexto,
      tipo: "texto",
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajesPorChat(prev => ({
      ...prev,
      [chatActivo.id]: [...(prev[chatActivo.id] || []), { ...mensajeObjeto, id: Date.now() }]
    }));
    setNuevoTexto("");
    setMostrarEmojis(false);
    
    try {
      await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mensajeObjeto)
      });
    } catch (err) { console.error("Error al registrar mensaje:", err); }
  };

  const obtenerEmojisMostrados = () => {
    return emojisPorCategoria[categoriaActiva] || emojisPorCategoria.caras;
  };

  return (
    <div className="chat-page">

      <Header/>

      {/* DISEÑO SEGÚN FOTO */}
      <div className="chat-container">
        {/* SIDEBAR IZQUIERDO */}
        <aside className="chat-sidebar">
          <h2>Chats</h2>
          <div className="chat-lista-contactos">
            {contactos.map((c) => (
              <div 
                key={c.id} 
                className={`chat-contacto-item ${chatActivo.id === c.id ? 'activo' : ''}`}
                onClick={() => setChatActivo(c)}
              >
                <img src={c.avatar} alt={c.nombre} />
                <div className="contacto-info">
                  <h4>{c.nombre}</h4>
                  <p>{c.ultimoMensaje}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT PRINCIPAL */}
        <main className="chat-main">
          {/* Header del chat activo (Foto) */}
          <div className="chat-main-header">
            <div className="header-info">
              <img src={chatActivo.avatar} alt={chatActivo.nombre} />
              <div className="header-text">
                <h3>{chatActivo.nombre}</h3>
                <span className="subtext">Co-watching your stream</span>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn-icon">Llamar</button>
              <button className="btn-icon">☰</button>
            </div>
          </div>

          <div className="chat-mensajes-lista">
            <div className="chat-timestamp-divider">LIVESTREAM DM • 12 MINS AGO</div>
            
            {mensajesActuales.map((m) => {
              const esmio = m.remitenteId === usuarioActualId;
              return (
                <div key={m.id} className={`mensaje-burbuja ${esmio ? 'mio' : 'suyo'}`}>
                  {!esmio && <img src={chatActivo.avatar} className="avatar-msg" alt="User" />}
                  <div className="burbuja-contenido">
                    <p>{m.contenido}</p>
                    <span className="mensaje-hora">{m.createdAt}</span>
                  </div>
                  {esmio && <img src={fotoPerfilPropio} className="avatar-msg" alt="Me" />}
                </div>
              );
            })}
            <div ref={mensajesFinRef} />
          </div>

          {/* INPUT AREA (Diseño Foto) */}
          <div className="bottom-container">
            <form onSubmit={enviarMensaje} className="chat-input-area-inbox">
              <button type="button" className="input-icon-left" onClick={() => setMostrarEmojis(!mostrarEmojis)}>
                😊
              </button>
              <input 
                type="text" 
                placeholder={`Message ${chatActivo.nombre}...`} 
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
              />
              <div className="input-actions-right">
                 <button type="button" className="btn-image">🖼️</button>
                 <button type="submit" className="btn-enviar-final">↗</button>
              </div>
            </form>
            
            {mostrarEmojis && (
              <div className="emoji-picker-advanced">
                <div className="emoji-grid-container">
                  {obtenerEmojisMostrados().map((emoji, idx) => (
                    <span key={idx} onClick={() => setNuevoTexto(prev => prev + emoji)}>{emoji}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer/>

    </div>
  );
}

export default Chat;
