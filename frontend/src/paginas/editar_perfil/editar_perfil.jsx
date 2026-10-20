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

  // 👤 Cargar usuario en sesión
  const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || {};

  // Estado de imágenes directamente desde el usuario
  const [bannerImg, setBannerImg] = useState(usuarioSesion.banner || null); 
  const [avatarImg, setAvatarImg] = useState(usuarioSesion.foto_perfil || null);

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
    const files = e.target.files;
    if (files && files.length > 0) { 
      const file = files.item(0); 
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBannerImg(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } 
  };

  const handleAvatarChange = (e) => { 
    const files = e.target.files;
    if (files && files.length > 0) { 
      const file = files.item(0); 
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarImg(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    let erroresTemp = {};

    console.log("1. Se ejecutó handleSubmit");

    if (!formData.nombre.trim()) erroresTemp.nombre = true;
    if (!formData.email.trim()) erroresTemp.email = true;

    if (Object.keys(erroresTemp).length > 0) {
      setCamposConError(erroresTemp);
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    setIsLoading(true);

    // 📦 Objeto unificado listo para MySQL y localStorage
    const usuarioActualizado = {
      ...usuarioSesion,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      username: formData.username.trim(),
      descripcion: formData.descripcion.trim(),
      email: formData.email.trim(),
      telefono: formData.telefono.trim(),
      instagram: formData.instagram.trim(),
      tiktok: formData.tiktok.trim(),
      website: formData.website.trim(),
      foto_perfil: avatarImg,
      banner: bannerImg
    };

    const token = localStorage.getItem("token");

    console.log("¿Hay token guardado?:", !!token);

    console.log("2. Voy a comprobar el token");

    console.log("3. Voy a enviar la petición");
    // 🚀 Petición PUT al Servidor Node.js
    if (token) {
      fetch("http://localhost:3000/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(usuarioActualizado)
      })
      .then(async (res) => {
        const texto = await res.text();

        console.log("Estado HTTP:", res.status);
        console.log("Respuesta del servidor:", texto);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${texto}`);
        }

        if (!texto) return {};

        try {
          return JSON.parse(texto);
        } catch {
          throw new Error("El servidor no devolvió JSON válido.");
        }
      })
        .then((datosServidor) => {
          const finalUser = datosServidor?.usuario || usuarioActualizado;
          console.log("4. Respuesta del servidor:", datosServidor);
          localStorage.setItem('usuario', JSON.stringify(finalUser));
          setIsLoading(false);
          setToastMessage("¡Cambios guardados en la base de datos ✨!");
          setTimeout(() => navigate("/perfil_propio"), 1000);
        })
        .catch((err) => {
          console.error("Error al guardar en BD:", err);
          setIsLoading(false);
          setError("No se pudieron guardar los cambios en el servidor.");
        });
    } else {
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      setIsLoading(false);
      setToastMessage("¡Cambios guardados con éxito ✨!");
      setTimeout(() => navigate("/perfil_propio"), 1000);
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
              backgroundImage: bannerImg ? `url("${bannerImg}")` : 'linear-gradient(135deg, #ebdcd3 0%, #d8c2af 100%)',
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
                  <img src={avatarImg} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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