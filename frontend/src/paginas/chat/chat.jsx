import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./chat.css";
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

const API = "http://localhost:3000/api/chat";
const token = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${token()}` });
const avatarUrl = (path) => path ? (/^(https?:|data:|blob:)/.test(path) ? path : `http://localhost:3000${path.startsWith("/") ? "" : "/"}${path}`) : null;

function Avatar({ path, name, className = "" }) {
  return path
    ? <img src={avatarUrl(path)} className={className} alt={name || ""} />
    : <span className={`${className} avatar-placeholder`} aria-label={name || "Usuario"}>{name?.trim()?.[0]?.toUpperCase() || "?"}</span>;
}

function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedContactId = Number(searchParams.get("usuarioId")) || null;
  const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "{}");
  const usuarioActualId = Number(usuarioActual.id_usuario);
  const [contactos, setContactos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [mensajesCargadosId, setMensajesCargadosId] = useState(null);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const mensajesFinRef = useRef(null);
  const chatActivoIdRef = useRef(null);
  const emojis = ["😀", "😃", "😄", "😁", "😅", "😂", "🥰", "😍", "😉", "😊", "✨", "💖", "🔥", "👑"];
  const cargandoMensajes = Boolean(chatActivo && Number(mensajesCargadosId) !== Number(chatActivo.id_usuario));

  useEffect(() => {
    chatActivoIdRef.current = Number(chatActivo?.id_usuario) || null;
  }, [chatActivo]);

  const cargarContactos = useCallback(async () => {
    const response = await fetch(API, { headers: authHeaders() });
    if (response.status === 401) { navigate("/IniciarSesion"); return []; }
    if (!response.ok) throw new Error("No se pudieron cargar las conversaciones.");
    const data = await response.json();
    setContactos(data);
    return data;
  }, [navigate]);

  const cargarUsuarios = useCallback(async (termino = "") => {
    setCargandoUsuarios(true);
    try {
      const response = await fetch(`${API}/usuarios?q=${encodeURIComponent(termino)}`, { headers: authHeaders() });
      if (response.status === 401) { navigate("/IniciarSesion"); return; }
      if (!response.ok) throw new Error("No se pudieron cargar los usuarios.");
      const data = await response.json();
      setUsuarios(data.usuarios || []);
      setErrorUsuarios("");
    } catch (e) { setErrorUsuarios(e.message); }
    finally { setCargandoUsuarios(false); }
  }, [navigate]);

  useEffect(() => {
    const timeout = window.setTimeout(() => cargarUsuarios(busquedaUsuario), 250);
    return () => window.clearTimeout(timeout);
  }, [busquedaUsuario, cargarUsuarios]);

  useEffect(() => {
    if (!token() || !usuarioActualId) { navigate("/IniciarSesion"); return; }
    let activo = true;
    (async () => {
      try {
        const lista = await cargarContactos();
        if (!activo) return;
        const objetivo = requestedContactId && requestedContactId !== usuarioActualId
          ? requestedContactId : null;
        if (objetivo) {
          let contacto = lista.find(item => Number(item.id_usuario) === objetivo);
          if (!contacto) {
            const response = await fetch(`${API}/usuarios/${objetivo}`, { headers: authHeaders() });
            const data = response.ok ? await response.json() : null;
            contacto = data?.usuario;
            if (!contacto && activo) setError("No se encontró ese usuario.");
          }
          if (contacto && activo) setChatActivo(contacto);
        } else if (lista[0]) setChatActivo(lista[0]);
      } catch (e) { if (activo) setError(e.message); }
      finally { if (activo) setCargando(false); }
    })();
    return () => { activo = false; };
  }, [cargarContactos, requestedContactId, usuarioActualId, navigate]);

  const cargarMensajes = useCallback(async (silencioso = false) => {
    if (!chatActivo?.id_usuario) return;
    const contactoId = Number(chatActivo.id_usuario);
    try {
      const response = await fetch(`${API}/${contactoId}`, { headers: authHeaders() });
      if (response.status === 401) { navigate("/IniciarSesion"); return; }
      if (!response.ok) throw new Error("No se pudieron cargar los mensajes.");
      const data = await response.json();
      if (chatActivoIdRef.current !== contactoId) return;
      setMensajes(data);
      if (!silencioso) setError("");
    } catch (e) {
      if (!silencioso && chatActivoIdRef.current === contactoId) setError(e.message);
    } finally {
      if (!silencioso && chatActivoIdRef.current === contactoId) setMensajesCargadosId(contactoId);
    }
  }, [chatActivo, navigate]);

  useEffect(() => {
    if (!chatActivo) return;
    const cargaInicial = window.setTimeout(() => cargarMensajes(), 0);
    const interval = window.setInterval(() => cargarMensajes(true), 4000);
    return () => {
      window.clearTimeout(cargaInicial);
      window.clearInterval(interval);
    };
  }, [chatActivo, cargarMensajes]);

  useEffect(() => { mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes]);

  const seleccionarContacto = (contacto) => {
    setMensajes([]);
    setMensajesCargadosId(null);
    setChatActivo(contacto);
    navigate(`/chat?usuarioId=${contacto.id_usuario}`, { replace: true });
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    const contenido = nuevoTexto.trim();
    if (!contenido || !chatActivo || enviando) return;
    const contactoId = Number(chatActivo.id_usuario);
    setEnviando(true);
    setError("");
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ destinatarioId: contactoId, contenido })
      });
      const data = await response.json();
      if (response.status === 401) { navigate("/IniciarSesion"); return; }
      if (!response.ok) throw new Error(data.error || "No se pudo enviar el mensaje.");
      if (chatActivoIdRef.current === contactoId) {
        setMensajes(current => [...current, data]);
        setNuevoTexto("");
        setMostrarEmojis(false);
      }
      await cargarContactos();
    } catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };

  const nombre = (c) => `${c?.nombre || ""} ${c?.apellido || ""}`.trim() || (c?.username ? `@${c.username}` : "Usuario");

  return <div className="chat-page">
    <Header />
    <div className="chat-container">
      <aside className="chat-sidebar">
        <h2>Mensajes</h2>
        <label className="chat-busqueda-label" htmlFor="chat-busqueda">Buscar personas</label>
        <input id="chat-busqueda" className="chat-busqueda" type="search" placeholder="Nombre o @usuario" value={busquedaUsuario} onChange={e => setBusquedaUsuario(e.target.value)} />
        {errorUsuarios && <p className="chat-error" role="alert">{errorUsuarios}</p>}
        {cargandoUsuarios ? <p className="chat-lista-estado">Buscando usuarios…</p> : <div className="chat-lista-contactos">
          <h3 className="chat-seccion-titulo">Personas</h3>
          {usuarios.map(c => <button type="button" key={`user-${c.id_usuario}`}
            className={`chat-contacto-item ${Number(chatActivo?.id_usuario) === Number(c.id_usuario) ? 'activo' : ''}`}
            onClick={() => seleccionarContacto(c)}>
            <Avatar path={c.foto_perfil} name={nombre(c)} />
            <div className="contacto-info"><h4>{nombre(c)}</h4><p>{c.username ? `@${c.username}` : "Usuario GRWM"}</p></div>
          </button>)}
          {!usuarios.length && <p className="chat-lista-estado">No encontramos personas con ese nombre.</p>}
        </div>}
        <h3 className="chat-seccion-titulo">Conversaciones</h3>
        <div className="chat-lista-contactos">
          {contactos.map(c => <button type="button" key={c.id_usuario}
            className={`chat-contacto-item ${Number(chatActivo?.id_usuario) === Number(c.id_usuario) ? 'activo' : ''}`}
            onClick={() => seleccionarContacto(c)}>
            <Avatar path={c.foto_perfil} name={nombre(c)} />
            <div className="contacto-info"><h4>{nombre(c)}</h4><p>{c.ultimoMensaje}</p></div>
          </button>)}
          {!contactos.length && !cargando && <p>No tienes conversaciones todavía.</p>}
        </div>
      </aside>
      <main className="chat-main">
        {chatActivo ? <>
          <div className="chat-main-header"><div className="header-info">
            <Avatar path={chatActivo.foto_perfil} name={nombre(chatActivo)} />
            <div className="header-text"><h3>{nombre(chatActivo)}</h3><span className="subtext">{chatActivo.username ? `@${chatActivo.username}` : "Conversación"}</span></div>
          </div></div>
          <div className="chat-mensajes-lista">
            {cargandoMensajes && !mensajes.length && <p>Cargando conversación…</p>}
            {!cargandoMensajes && !mensajes.length && <p>Inicia la conversación con {nombre(chatActivo)}.</p>}
            {mensajes.map(m => {
              const esMio = Number(m.remitenteId) === usuarioActualId;
              return <div key={m.id} className={`mensaje-burbuja ${esMio ? 'mio' : 'suyo'}`}>
                {!esMio && <Avatar path={chatActivo.foto_perfil} name={nombre(chatActivo)} className="avatar-msg" />}
                <div className="burbuja-contenido"><p>{m.contenido}</p><span className="mensaje-hora">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                {esMio && <Avatar path={usuarioActual.foto_perfil || localStorage.getItem("grwm_foto_perfil")} name={nombre(usuarioActual)} className="avatar-msg" />}
              </div>;
            })}<div ref={mensajesFinRef} />
          </div>
          {error && <p role="alert" style={{ color: "#a32345", padding: "0 25px" }}>{error}</p>}
          <div className="bottom-container"><form onSubmit={enviarMensaje} className="chat-input-area-inbox">
            <button type="button" className="input-icon-left" aria-label="Emojis" onClick={() => setMostrarEmojis(!mostrarEmojis)}>😊</button>
            <input type="text" placeholder={`Mensaje para ${nombre(chatActivo)}…`} value={nuevoTexto} onChange={e => setNuevoTexto(e.target.value)} />
            <div className="input-actions-right"><button type="submit" className="btn-enviar-final" disabled={enviando || !nuevoTexto.trim()} aria-label="Enviar">↗</button></div>
          </form>
          {mostrarEmojis && <div className="emoji-picker-advanced"><div className="emoji-grid-container">{emojis.map(emoji => <button type="button" key={emoji} onClick={() => setNuevoTexto(prev => prev + emoji)}>{emoji}</button>)}</div></div>}
          </div>
        </> : <div className="chat-mensajes-lista">{cargando ? "Cargando conversaciones…" : error || "Elige una conversación o contacta a alguien desde su publicación o perfil."}</div>}
      </main>
    </div>
    <Footer />
  </div>;
}

export default Chat;
