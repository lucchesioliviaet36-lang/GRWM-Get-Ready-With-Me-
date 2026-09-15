import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./editar_perfil.css"; 
import Header from "../../componentes/header/header"; 
import Footer from "../../componentes/footer/footer";

// 🛠️ Función auxiliar para validar imágenes almacenadas en localStorage
const obtenerImagenValida = (key) => {
  const val = localStorage.getItem(key);
  if (!val || val === 'null' || val === 'undefined' || val.trim() === '') {
    return null;
  }
  return val;
};

function EditarPerfil() { 
  const navigate = useNavigate(); 
  const [error, setError] = useState(""); 
  const [toastMessage, setToastMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [camposConError, setCamposConError] = useState({});

  // 👤 Cargar datos del usuario en sesión
  const usuarioSesion = JSON.parse(localStorage.getItem('usuario')) || {};

  // Estado para Banner y Avatar con filtrado seguro
  const [bannerImg, setBannerImg] = useState(() => obtenerImagenValida('grwm_banner')); 
  const [avatarImg, setAvatarImg] = useState(() => {
    return obtenerImagenValida('grwm_foto_perfil') || usuarioSesion.foto_perfil || null;
  });

  // Inicialización dinámica con los datos reales del usuario
  const [formData, setFormData] = useState(() => { 
    const savedData = localStorage.getItem('grwm_user_profile'); 
    if (savedData) { 
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.fullName && !parsed.fullName.toLowerCase().includes("taylor")) {
          return parsed;
        }
      } catch (e) {
        console.error("Error al leer perfil:", e);
      }
    } 

    const nombreCompleto = usuarioSesion.nombre 
      ? `${usuarioSesion.nombre} ${usuarioSesion.apellido || ''}`.trim() 
      : (usuarioSesion.username || '');

    return { 
      fullName: nombreCompleto, 
      username: usuarioSesion.username ? `@${usuarioSesion.username.replace('@', '')}` : '', 
      bio: usuarioSesion.descripcion || '', 
      email: usuarioSesion.mail || usuarioSesion.email || '', 
      phone: usuarioSesion.telefono || '', 
      instagram: usuarioSesion.instagram || '', 
      tiktok: usuarioSesion.tiktok || '', 
      website: usuarioSesion.website || '', 
    }; 
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

  // 🖼️ Cambiar Banner extrayendo el archivo mediante .item(0)
  const handleBannerChange = (e) => { 
    const files = e.target.files;
    if (files && files.length > 0) { 
      const file = files.item(0); 
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result;
          setBannerImg(res);
          localStorage.setItem('grwm_banner', res);
        };
        reader.readAsDataURL(file);
      }
    } 
  };

  // 📸 Cambiar Avatar extrayendo el archivo mediante .item(0)
  const handleAvatarChange = (e) => { 
    const files = e.target.files;
    if (files && files.length > 0) { 
      const file = files.item(0); 
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result;
          setAvatarImg(res);
          localStorage.setItem('grwm_foto_perfil', res);
        };
        reader.readAsDataURL(file);
      }
    } 
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    setError(""); 
    let erroresTemp = {};

    if (!formData.fullName.trim()) erroresTemp.fullName = true;
    if (!formData.email.trim()) erroresTemp.email = true;

    if (Object.keys(erroresTemp).length > 0) {
      setCamposConError(erroresTemp);
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    setIsLoading(true);

    const partesNombre = formData.fullName.trim().split(" ");
    const primerNombre = partesNombre || "";
    const nuevoApellido = partesNombre.slice(1).join(" ") || "";
    const nuevoUsername = formData.username.replace('@', '').trim();

    const usuarioActualizado = {
      ...usuarioSesion,
      nombre: primerNombre,
      apellido: nuevoApellido,
      username: nuevoUsername,
      mail: formData.email,
      descripcion: formData.bio,
      foto_perfil: avatarImg
    };

    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    localStorage.setItem('grwm_user_profile', JSON.stringify(formData));
    
    if (bannerImg) {
      localStorage.setItem('grwm_banner', bannerImg);
    }
    if (avatarImg) {
      localStorage.setItem('grwm_foto_perfil', avatarImg);
    }

    setTimeout(() => {
      setIsLoading(false);
      setToastMessage("¡Cambios guardados con éxito ✨!");
      
      setTimeout(() => {
        navigate("/perfil_propio");
      }, 1000);
    }, 1000);
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
              
              {/* AVATAR VECTORIAL O FOTO */}
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
                  <label htmlFor="fullName">Nombre completo *</label>
                  <input 
                    id="fullName" 
                    name="fullName" 
                    type="text" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className={camposConError.fullName ? "input-error" : ""}
                  />
                </div>
                <div className="form-group-perfil">
                  <label htmlFor="username">Nombre de usuario</label>
                  <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group-perfil">
                <div className="label-con-contador">
                  <label htmlFor="bio">Biografía</label>
                  <span className="contador-caracteres">{formData.bio.length}/160</span>
                </div>
                <textarea 
                  id="bio" 
                  name="bio" 
                  rows="3" 
                  maxLength="160"
                  value={formData.bio} 
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
                <div className="form-group-perfil">
                  <label htmlFor="phone">Teléfono</label>
                  <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} />
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