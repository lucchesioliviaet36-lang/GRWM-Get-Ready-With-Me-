import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerFotoDePerfilPropio from '../../assets/imagenes/bannerFotoDePerfilPropio.jpg';
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg';
import "./editar_perfil.css"; 

function EditarPerfil() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [camposConError, setCamposConError] = useState({});

  // Cargar datos previos si existen en localStorage
  const [bannerImg, setBannerImg] = useState(() => localStorage.getItem('grwm_banner') || bannerFotoDePerfilPropio);
  const [avatarImg, setAvatarImg] = useState(() => localStorage.getItem('grwm_avatar') || fotoPerfilPropio);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('grwm_user_profile');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      fullName: "Elena Gómez",
      username: "@elenag_style",
      bio: "Amante de la moda urbana. Vendiendo joyas de mi clóset vintage 👜🦋",
      email: "elena.gomez@email.com",
      phone: "+34 612 345 678",
      instagram: "@elenag_style",
      tiktok: "@elenag_style",
      website: "www.elenagstyle.com",
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
      styles.map((style) =>
        style.id === id ? { ...style, active: !style.active } : style
      )
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (camposConError[e.target.name]) {
      setCamposConError({ ...camposConError, [e.target.name]: false });
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImg(imageUrl);
      localStorage.setItem('grwm_banner', imageUrl);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImg(imageUrl);
      localStorage.setItem('grwm_avatar', imageUrl);
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

    // Guardar datos permanentemente en la sesión del navegador
    localStorage.setItem('grwm_user_profile', JSON.stringify(formData));

    setTimeout(() => {
      setIsLoading(false);
      setToastMessage("¡Cambios guardados con éxito ✨!");
      
      setTimeout(() => {
        navigate("/perfil_propio");
      }, 1200);
    }, 1500);
  };

  return (
    <div className="EditarPerfil-Page">
      
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <header className="barra-superior-registro">
        <div className="logo-registro" onClick={() => navigate('/perfil_propio')} style={{cursor: 'pointer'}}>
          ✧ <span>GRWM</span>
        </div>
        <nav className="menu-registro">
          <button onClick={() => navigate('/perfil_propio')}>Mi perfil</button>
          <button onClick={() => navigate('/miTienda')}>Tienda</button>
          <button onClick={() => alert("Contacta a soporteGRWM@gmail.com")}>Soporte</button>
        </nav>
      </header>

      <main className="editar-contenido-principal">
        <div className="EditarPerfil-Container">
          
          <div className="editar-portada" style={{ backgroundImage: `url(${bannerImg})` }}>
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
              <img src={avatarImg} alt="Avatar" className="editar-avatar-img" />
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
    </div>
  );
}

export default EditarPerfil;