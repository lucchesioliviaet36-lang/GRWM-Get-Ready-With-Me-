import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";

function Chat() {
  const navigate = useNavigate();
  const usuarioActualId = 1; 
  const [chatActivo, setChatActivo] = useState({ 
    id: 2, 
    nombre: "Sofía Style", 
    username: "@sofi_style",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    prendaInteres: {
      titulo: "Chaleco Vintage Aesthetic",
      precio: "$12.000",
      imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200"
    }
  });
  
  const [mensajesPorChat, setMensajesPorChat] = useState({
    2: [
      { id: 1, remitenteId: 2, destinatarioId: 1, contenido: "¡Hola! Me encantó el chaleco vintage que subiste a tu tienda ✨", createdAt: "10:42", tipo: "texto" }
    ],
    3: [
      { id: 2, remitenteId: 3, destinatarioId: 1, contenido: "¿Hacemos envío combinado?", createdAt: "09:15", tipo: "texto" }
    ],
    4: [
      { id: 3, remitenteId: 4, destinatarioId: 1, contenido: "Me pasas medidas porfa", createdAt: "Ayer", tipo: "texto" }
    ]
  });

  const [nuevoTexto, setNuevoTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("caras");
  const [busquedaEmoji, setBusquedaEmoji] = useState("");
  const mensajesFinRef = useRef(null);

  const contactos = [
    { 
      id: 2, 
      nombre: "Sofía Style", 
      username: "@sofi_style",
      ultimoMensaje: "¡Sigue disponible, te interesa?", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      prendaInteres: { titulo: "Chaleco Vintage Aesthetic", precio: "$12.000", imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200" }
    },
    { 
      id: 3, 
      nombre: "Valeria Closet", 
      username: "@valeriacloset",
      ultimoMensaje: "¿Hacemos envío combinado?", 
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
      prendaInteres: { titulo: "Pantalón Cargo Oversize", precio: "$18.500", imagen: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200" }
    },
    { 
      id: 4, 
      nombre: "Camila Aesthetic", 
      username: "@camila_aest",
      ultimoMensaje: "Me pasas medidas porfa", 
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
      prendaInteres: { titulo: "Blazer Oversize Neutro", precio: "$22.000", imagen: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200" }
    }
  ];

  // Base de datos completa de emojis organizada por categorías
  const emojisPorCategoria = {
    caras: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "✨", "💖", "🔥", "👑", "🌹", "💎", "💸", "🎉", "💯", "👍", "👎", "👏", "🙌"],
    animales: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "snail", "🐞", "🐜", "🦟", "🐢", "🐍", "Lizard", "🐙", "🦑", "Shrimp"],
    comida: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🍍", "🥭", "🍅", "🍆", "🥑", "🥦", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🍞", "🥖", "🥨", "cheese", "🥚", "🍳", "🥞", "waffle", "bacon", "steak", "🍗", "🍖", "hotdog"],
    actividades: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "boxing", "martial arts", "🛹", "🛼", "sled", "ice skate", "curling", "ski", "snowboard", "parachute", "gym", "yoga", "surf", "swimming", "water polo"],
    viajes: ["🚗", "タクシー", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🛺", "🚲", "🛴", "🛹", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🚁", "🛶", "⛵", "speedboat", "cruiser", "ferry"],
    objetos: ["💡", "🔦", "🕯️", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", "💰", "🪙", "💴", "💵", "💶", "💷", "💳", "receipt", "chart"],
    simbolos: ["➕", "➖", "➗", "✖️", "♾️", "💲", "💱", "™️", "©️", "®️", "〰️", "➰", "➿", "🔚", "🔙", "🔛", "🔝", "🔜", "✔️", "☑️", "🔘", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪"],
    banderas: ["🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🏳️‍⚧️", "🇦🇷", "🇧🇷", "🇺🇸", "🇪🇸", "🇲🇽", "🇨🇱", "🇺🇾", "🇨🇴", "🇵🇪", "🇫🇷", "🇮🇹", "🇩🇪", "🇯🇵", "🇰🇷"]
  };

  const scrollToBottom = () => {
    mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const mensajesActuales = mensajesPorChat[chatActivo.id] || [];

  useEffect(() => {
    setCargando(true);
    fetch(`http://localhost:5000/api/chat/${usuarioActualId}/${chatActivo.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setMensajesPorChat(prev => ({
            ...prev,
            [chatActivo.id]: data
          }));
        }
        setCargando(false);
      })
      .catch(err => {
        console.error("Usando caché local para este chat", err);
        setCargando(false);
      });
  }, [chatActivo]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajesActuales, chatActivo]);

  const enviarMensaje = async (e, tipoMensaje = "texto", contenidoPersonalizado = null) => {
    if (e) e.preventDefault();
    const textoAEnviar = contenidoPersonalizado || nuevoTexto;
    if (!textoAEnviar.trim()) return;

    const mensajeObjeto = {
      remitenteId: usuarioActualId,
      destinatarioId: chatActivo.id,
      contenido: textoAEnviar,
      tipo: tipoMensaje,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajesPorChat(prev => ({
      ...prev,
      [chatActivo.id]: [...(prev[chatActivo.id] || []), { ...mensajeObjeto, id: Date.now() }]
    }));

    if (!contenidoPersonalizado) setNuevoTexto("");
    setMostrarEmojis(false);

    try {
      await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mensajeObjeto)
      });
    } catch (error) {
      console.error("Error al registrar el mensaje en la base de datos", error);
    }
  };

  const insertarEmoji = (emoji) => {
    setNuevoTexto(prev => prev + emoji);
  };

  const manejarEnvioImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      enviarMensaje(null, "imagen", imageUrl);
    }
  };

  const enviarInspoRapida = (tipo) => {
    if (tipo === 'prenda') {
      enviarMensaje(null, "texto", `Te comparto este artículo de mi tienda: ${chatActivo.prendaInteres.titulo} (${chatActivo.prendaInteres.precio})`);
    } else if (tipo === 'inspo') {
      enviarMensaje(null, "texto", "Mirá esta inspo de outfit que armé para combinar en GRWM ✨");
    } else if (tipo === 'oferta') {
      enviarMensaje(null, "oferta", "Propuesta de oferta enviada por el artículo en negociación.");
    }
  };

  // Obtener emojis de la categoría activa o filtrar si hay texto en el buscador
  const obtenerEmojisMostrados = () => {
    if (busquedaEmoji.trim() !== "") {
      // Une todos los emojis de todas las categorías para buscar globalmente
      const todos = Object.values(emojisPorCategoria).flat();
      return todos; 
    }
    return emojisPorCategoria[categoriaActiva] || emojisPorCategoria.caras;
  };

  return (
    <div className="chat-page">
      <header className="barra-superior-registro">
        <div className="logo-registro" onClick={() => navigate('/perfil_propio')} style={{cursor: 'pointer'}}>
          <span>GRWM</span>
        </div>
        <nav className="menu-registro">
          <button onClick={() => navigate('/perfil_propio')}>Mi perfil</button>
          <button onClick={() => navigate('/miTienda')}>Tienda</button>
          <button onClick={() => navigate('/editar_perfil')}>Editar Perfil</button>
        </nav>
      </header>

      <div className="chat-container">
        <aside className="chat-sidebar">
          <h2>Mensajes</h2>
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

        <main className="chat-main">
          <div className="chat-main-header">
            <img src={chatActivo.avatar} alt={chatActivo.nombre} />
            <div className="chat-header-details">
              <h3>{chatActivo.nombre}</h3>
              <span className="estado-en-linea">En línea • GRWM Community</span>
            </div>
            <button className="btn-visitar-tienda" onClick={() => alert(`Visitando el clóset de ${chatActivo.nombre}`)}>
              Ver Clóset
            </button>
          </div>

          <div className="chat-mensajes-lista">
            {chatActivo.prendaInteres && (
              <div className="chat-prenda-card">
                <img src={chatActivo.prendaInteres.imagen} alt="Prenda" />
                <div className="chat-prenda-info">
                  <span className="chat-prenda-tag">Prenda en negociación</span>
                  <h4>{chatActivo.prendaInteres.titulo}</h4>
                  <p>{chatActivo.prendaInteres.precio}</p>
                </div>
                <button className="btn-ver-prenda" onClick={() => alert("Abriendo detalles de la prenda...")}>Ver detalles</button>
              </div>
            )}

            {cargando ? (
              <div className="chat-empty-state">
                <p>Sincronizando mensajes con MySQL...</p>
              </div>
            ) : mensajesActuales.length === 0 ? (
              <div className="chat-empty-state">
                <p>Aún no hay mensajes en esta conversación. Comienza a escribir.</p>
              </div>
            ) : (
              mensajesActuales.map((m) => {
                const esmio = m.remitenteId === usuarioActualId;
                return (
                  <div key={m.id} className={`mensaje-burbuja ${esmio ? 'mio' : 'suyo'}`}>
                    {m.tipo === 'imagen' ? (
                      <img src={m.contenido} alt="Enviada" className="chat-imagen-enviada" />
                    ) : m.tipo === 'oferta' ? (
                      <div className="oferta-card-msg">
                        <span className="oferta-badge">Propuesta de Precio</span>
                        <p>¿Te parece cerrar la prenda en un 15% menos?</p>
                        <div className="oferta-acciones">
                          <button onClick={() => alert("¡Oferta aceptada con éxito!")}>Aceptar</button>
                          <button onClick={() => alert("Oferta rechazada")}>Rechazar</button>
                        </div>
                      </div>
                    ) : (
                      <p>{m.contenido}</p>
                    )}
                    <span className="mensaje-hora">
                      {m.createdAt ? (typeof m.createdAt === 'string' && m.createdAt.includes(':') ? m.createdAt.slice(0, 5) : m.createdAt) : "Reciente"} {esmio && <span className="doble-tilde">Entregado</span>}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={mensajesFinRef} />
          </div>

          <div className="chat-quick-actions">
            <button onClick={() => enviarInspoRapida('prenda')}>+ Artículo de Tienda</button>
            <button onClick={() => enviarInspoRapida('inspo')}>+ Inspo de Outfit</button>
            <button onClick={() => enviarInspoRapida('oferta')}>⚡ Proponer Oferta</button>
          </div>

          <div className="chat-input-wrapper-container">
            {mostrarEmojis && (
              <div className="emoji-picker-advanced">
                <div className="emoji-search-bar">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  <input 
                    type="text" 
                    placeholder="Buscar emoji" 
                    value={busquedaEmoji}
                    onChange={(e) => setBusquedaEmoji(e.target.value)}
                  />
                </div>
                
                <div className="emoji-category-title">
                  {categoriaActiva.charAt(0).toUpperCase() + categoriaActiva.slice(1)}
                </div>

                <div className="emoji-grid-container">
                  {obtenerEmojisMostrados().map((emoji, idx) => (
                    <span key={idx} onClick={() => insertarEmoji(emoji)}>{emoji}</span>
                  ))}
                </div>

                {/* Barra superior de pestañas con iconos */}
                <div className="emoji-footer-categories">
                  <span onClick={() => setCategoriaActiva("caras")} className={categoriaActiva === "caras" ? "activa-tab" : ""}>😀</span>
                  <span onClick={() => setCategoriaActiva("animales")} className={categoriaActiva === "animales" ? "activa-tab" : ""}>🐶</span>
                  <span onClick={() => setCategoriaActiva("comida")} className={categoriaActiva === "comida" ? "activa-tab" : ""}>🍎</span>
                  <span onClick={() => setCategoriaActiva("actividades")} className={categoriaActiva === "actividades" ? "activa-tab" : ""}>⚽</span>
                  <span onClick={() => setCategoriaActiva("viajes")} className={categoriaActiva === "viajes" ? "activa-tab" : ""}>🚗</span>
                  <span onClick={() => setCategoriaActiva("objetos")} className={categoriaActiva === "objetos" ? "activa-tab" : ""}>💡</span>
                  <span onClick={() => setCategoriaActiva("simbolos")} className={categoriaActiva === "simbolos" ? "activa-tab" : ""}>🧮</span>
                  <span onClick={() => setCategoriaActiva("banderas")} className={categoriaActiva === "banderas" ? "activa-tab" : ""}>🚩</span>
                </div>
              </div>
            )}

            <form onSubmit={(e) => enviarMensaje(e, "texto")} className="chat-input-area-inbox">
              <button 
                type="button" 
                className="input-icon-left" 
                onClick={() => setMostrarEmojis(!mostrarEmojis)}
                title="Elegir emoji"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
              </button>

              <input 
                type="text" 
                placeholder={`Mensaje a ${chatActivo.nombre}...`} 
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
              />

              <label className="input-icon-right" title="Enviar imagen">
                <input type="file" accept="image/*" onChange={manejarEnvioImagen} style={{ display: 'none' }} />
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              </label>

              <button type="submit" className="btn-enviar-chat-real">
                Enviar
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;