import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./editar_perfil.css"; 
import Header from "../../componentes/header/header"; 
import Footer from "../../componentes/footer/footer";

function EditarPerfil() { 
  const navigate = useNavigate(); 
  const [error, setError] = useState(""); 
  const [toastMessage, setToastMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [camposConError, setCamposConError] = useState({});

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  // 👤 Cargar usuario en sesión
  const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || {};

  const API_URL = "http://localhost:3000";

  const [bannerImg, setBannerImg] = useState(usuarioSesion.banner || null);
  const [avatarImg, setAvatarImg] = useState(usuarioSesion.foto_perfil || null);

  const [bannerArchivo, setBannerArchivo] = useState(null);
  const [avatarArchivo, setAvatarArchivo] = useState(null);

  // OBTENER URL DE IMAGEN
  const obtenerImagen = (imagen) => {
    if (!imagen) {
      return "";
    }

    if (imagen.startsWith("blob:") || imagen.startsWith("http")) {
      return imagen;
    }

    return `${API_URL}${imagen}`;
  };

  // 📝 Formulario directamente mapeado con los mismos nombres que MySQL
  const [formData, setFormData] = useState({
    nombre: usuarioSesion.nombre || '',
    apellido: usuarioSesion.apellido || '',
    username: usuarioSesion.username ? usuarioSesion.username.replace('@', '') : '',
    descripcion: usuarioSesion.descripcion || '',
    email: usuarioSesion.email || usuarioSesion.mail || '',
    telefono: usuarioSesion.telefono || '',
    instagram: usuarioSesion.instagram || '',
    tiktok: usuarioSesion.tiktok || '',
    website: usuarioSesion.website || ''
  });

  const availableStyles = [ 
    { id: "vintage", label: "Vintage", active: true }, 
    { id: "urban", label: "Urban", active: true }, 
    { id: "minimal", label: "Minimal", active: false }, 
    { id: "aesthetic", label: "Aesthetic", active: true }, 
    { id: "boho", label: "Boho", active: false }, 
    { id: "streetwear", label: "Streetwear", active: false }, 
    { id: "y2k", label: "Y2K", active: false }, 
  ];

  const [styles, setStyles] = useState(availableStyles);

  const toggleStyle = (id) => { 
    setStyles( 
      styles.map((style) => style.id === id ? { ...style, active: !style.active } : style ) 
    ); 
  };

  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
    if (camposConError[e.target.name]) { 
      setCamposConError({ ...camposConError, [e.target.name]: false }); 
    } 
  };

  const handleBannerChange = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      setError("Seleccioná un archivo de imagen válido.");
      return;
    }

    setError("");
    setBannerArchivo(archivo);
    setBannerImg(URL.createObjectURL(archivo));
  };

  const handleAvatarChange = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      setError("Seleccioná un archivo de imagen válido.");
      return;
    }

    setError("");
    setAvatarArchivo(archivo);
    setAvatarImg(URL.createObjectURL(archivo));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToastMessage("");

    const erroresTemp = {};

    if (!formData.nombre.trim()) erroresTemp.nombre = true;
    if (!formData.email.trim()) erroresTemp.email = true;

    if (Object.keys(erroresTemp).length > 0) {
      setCamposConError(erroresTemp);
      setError("Por favor completá los campos obligatorios.");
      return;
    }

    const quiereCambiarContrasena =
      contrasenaActual || nuevaContrasena || confirmarContrasena;

    if (quiereCambiarContrasena) {
      if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
        setError("Completá los tres campos de contraseña.");
        return;
      }


      if (nuevaContrasena !== confirmarContrasena) {
        setError("La nueva contraseña y su confirmación no coinciden.");
        return;
      }
    }

    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró una sesión activa. Volvé a iniciar sesión.");
      }

      // 1. Guardar los datos del perfil
      const datosPerfil = new FormData();

      datosPerfil.append("nombre", formData.nombre.trim());
      datosPerfil.append("apellido", formData.apellido.trim());
      datosPerfil.append("username", formData.username.trim());
      datosPerfil.append("descripcion", formData.descripcion.trim());
      datosPerfil.append("email", formData.email.trim());
      datosPerfil.append("telefono", formData.telefono.trim());
      datosPerfil.append("instagram", formData.instagram.trim());
      datosPerfil.append("tiktok", formData.tiktok.trim());
      datosPerfil.append("website", formData.website.trim());

      if (avatarArchivo) {
        datosPerfil.append("foto_perfil", avatarArchivo);
      }

      if (bannerArchivo) {
        datosPerfil.append("banner", bannerArchivo);
      }

      const responsePerfil = await fetch(
        `${API_URL}/api/usuarios/perfil`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: datosPerfil
        }
      );

      const dataPerfil = await responsePerfil.json();

      if (!responsePerfil.ok) {
        throw new Error(
          dataPerfil.message ||
          dataPerfil.mensaje ||
          "No se pudieron guardar los cambios del perfil."
        );
      }

      // 2. Cambiar la contraseña solamente si se completaron los campos
      if (quiereCambiarContrasena) {
        const responseContrasena = await fetch(
          `${API_URL}/api/auth/cambiar-contrasena`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              contraseñaActual: contrasenaActual,
              contraseñaNueva: nuevaContrasena,
              confirmarContraseña: confirmarContrasena
            })
          }
        );

        const dataContrasena = await responseContrasena.json();

        if (!responseContrasena.ok) {
          throw new Error(
            dataContrasena.mensaje ||
            dataContrasena.message ||
            "No se pudo cambiar la contraseña."
          );
        }
      }

      // 3. Actualizar los datos locales
      const usuarioActualizado = {
        ...usuarioSesion,
        ...(dataPerfil.usuario || {}),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        username: formData.username.trim(),
        descripcion: formData.descripcion.trim(),
        email: formData.email.trim(),
        mail: formData.email.trim(),
        telefono: formData.telefono.trim(),
        instagram: formData.instagram.trim(),
        tiktok: formData.tiktok.trim(),
        website: formData.website.trim()
      };

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioActualizado)
      );

      setContrasenaActual("");
      setNuevaContrasena("");
      setConfirmarContrasena("");

      setToastMessage(
        quiereCambiarContrasena
          ? "¡Perfil y contraseña actualizados correctamente!"
          : "¡Perfil actualizado correctamente!"
      );

      setTimeout(() => {
        navigate("/perfil_propio");
      }, 1200);

    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError(error.message || "No se pudieron guardar los cambios.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return ( 
    <div className="EditarPerfil-Page">
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <Header/>

      <main className="editar-contenido-principal">
        <div className="EditarPerfil-Container">
          
          {/* BANNER CENTRADO */}
          <div 
            className="editar-portada" 
            style={{ 
              backgroundImage: bannerImg ? `url("${obtenerImagen(bannerImg)}")` : 'linear-gradient(135deg, #ebdcd3 0%, #d8c2af 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {!bannerImg && (
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#8b5274" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ opacity: 0.4 }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}

            <label className="btn-cambiar-portada" style={{ cursor: 'pointer' }}>
              Cambiar portada
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleBannerChange} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>

          <div className="EditarPerfil-Header">
            <div className="editar-avatar-wrapper">
              
              <div 
                className="editar-avatar-img" 
                style={{ 
                  backgroundColor: '#f3e8ee', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {avatarImg ? (
                 <img src={obtenerImagen(avatarImg)}  alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover"}}/>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8b5274" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>

              <label className="btn-cambiar-avatar" style={{ cursor: 'pointer' }}>
                Editar foto
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <div className="editar-info-textos">
              <h1>Editar Perfil</h1>
              <p>Personaliza la información pública de tu cuenta</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="EditarPerfil-Formulario">
            
            <section className="form-seccion">
              <h2>Información Básica</h2>
              <div className="form-fila">
                <div className="form-group-perfil">
                  <label htmlFor="nombre">Nombre *</label>
                  <input 
                    id="nombre" 
                    name="nombre" 
                    type="text" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    className={camposConError.nombre ? "input-error" : ""}
                  />
                </div>
                <div className="form-group-perfil">
                  <label htmlFor="apellido">Apellido</label>
                  <input 
                    id="apellido" 
                    name="apellido" 
                    type="text" 
                    value={formData.apellido} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="form-fila">
                <div className="form-group-perfil">
                  <label htmlFor="username">Nombre de usuario</label>
                  <input 
                    id="username" 
                    name="username" 
                    type="text" 
                    value={formData.username} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group-perfil">
                  <label htmlFor="telefono">Teléfono</label>
                  <input 
                    id="telefono" 
                    name="telefono" 
                    type="text" 
                    value={formData.telefono} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="form-group-perfil">
                <div className="label-con-contador">
                  <label htmlFor="descripcion">Biografía</label>
                  <span className="contador-caracteres">{formData.descripcion.length}/160</span>
                </div>
                <textarea 
                  id="descripcion" 
                  name="descripcion" 
                  rows="3" 
                  maxLength="160"
                  value={formData.descripcion} 
                  onChange={handleChange} 
                />
              </div>
            </section>

            <hr className="separador" />

            <section className="form-seccion">
              <h2>Cuenta y Contacto</h2>
              <div className="form-fila">
                <div className="form-group-perfil">
                  <label htmlFor="email">Correo electrónico *</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className={camposConError.email ? "input-error" : ""}
                  />
                </div>
              </div>
            </section>

            <hr className="separador" />

            <section className="form-seccion">
              <h2>Redes Sociales</h2>
              <div className="form-fila-tres">
                <div className="form-group-perfil">
                  <label htmlFor="instagram">Instagram</label>
                  <input id="instagram" name="instagram" type="text" value={formData.instagram} onChange={handleChange} />
                </div>
                <div className="form-group-perfil">
                  <label htmlFor="tiktok">TikTok</label>
                  <input id="tiktok" name="tiktok" type="text" value={formData.tiktok} onChange={handleChange} />
                </div>
                <div className="form-group-perfil">
                  <label htmlFor="website">Sitio web / Tienda</label>
                  <input id="website" name="website" type="text" value={formData.website} onChange={handleChange} />
                </div>
              </div>
            </section>

            <hr className="separador" />

            <section className="form-seccion">
              <h2>Seguridad y contraseña</h2>
              <p className="subtitulo-estilos">
                Dejá estos campos vacíos si no querés cambiar tu contraseña.
              </p>

              <div className="form-group-perfil">
                <label htmlFor="contrasenaActual">Contraseña actual</label>
                <input
                  id="contrasenaActual"
                  name="contrasenaActual"
                  type="password"
                  autoComplete="current-password"
                  value={contrasenaActual}
                  onChange={(e) => setContrasenaActual(e.target.value)}
                />
              </div>

              <div className="form-fila">
                <div className="form-group-perfil">
                  <label htmlFor="nuevaContrasena">Nueva contraseña</label>
                  <input
                    id="nuevaContrasena"
                    name="nuevaContrasena"
                    type="password"
                    autoComplete="new-password"
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                  />
                </div>

                <div className="form-group-perfil">
                  <label htmlFor="confirmarContrasena">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    type="password"
                    autoComplete="new-password"
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="form-seccion">
              <h2>Estilos Preferidos</h2>
              <p className="subtitulo-estilos">Selecciona los estilos que definen tus outfits para personalizar tu feed</p>
              <div className="contenedor-estilos">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleStyle(style.id)}
                    className={`btn-estilo ${style.active ? 'activo' : 'inactivo'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </section>

            {error && <div className="Error-Mensaje">{error}</div>}

            <div className="botones-accion">
              <button type="button" className="btn-cancelar" onClick={() => navigate("/perfil_propio")}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer/>

    </div>
  ); 
}

export default EditarPerfil;