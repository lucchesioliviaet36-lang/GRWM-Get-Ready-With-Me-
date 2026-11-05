import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './perfil_usuario.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

const API_URL = "http://localhost:3000";

function PerfilUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const token = localStorage.getItem('token');

    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);

    const [seguidores, setSeguidores] = useState(0);
    const [seguidos, setSeguidos] = useState(0);

    const [loSigo, setLoSigo] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');

    // Obtener URL de imágenes
    const obtenerImagen = (imagen) => {
        if (!imagen) return "";

        if (
            imagen.startsWith("http") ||
            imagen.startsWith("blob:") ||
            imagen.startsWith("data:")
        ) {
            return imagen;
        }

        return `${API_URL}${imagen}`;
    };

    // Cargar información del perfil
    useEffect(() => {
        if (!id || !token) return;

        const cargarPerfil = async () => {
            try {
                setCargando(true);
                setError('');

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [
                    respuestaUsuario,
                    respuestaPublicaciones,
                    respuestaEstadisticas,
                    respuestaSeguimiento
                ] = await Promise.all([
                    fetch(`${API_URL}/api/usuarios/${id}`, { headers }),
                    fetch(`${API_URL}/api/publicaciones`, { headers }),
                    fetch(`${API_URL}/api/usuarios/${id}/estadisticas-seguimiento`, { headers }),
                    fetch(`${API_URL}/api/usuarios/${id}/seguir`, { headers })
                ]);

                if (
                    !respuestaUsuario.ok ||
                    !respuestaPublicaciones.ok ||
                    !respuestaEstadisticas.ok ||
                    !respuestaSeguimiento.ok
                ) {
                    throw new Error("No se pudo cargar el perfil");
                }

                const datosUsuario = await respuestaUsuario.json();
                const datosPublicaciones = await respuestaPublicaciones.json();
                const datosEstadisticas = await respuestaEstadisticas.json();
                const datosSeguimiento = await respuestaSeguimiento.json();

                setUsuario(datosUsuario.usuario || datosUsuario);

                // Filtrar solamente las publicaciones de este usuario
                const publicacionesUsuario = Array.isArray(datosPublicaciones)
                    ? datosPublicaciones.filter(
                        post => Number(post.id_usuario) === Number(id)
                    )
                    : [];

                setPublicaciones(publicacionesUsuario);

                setSeguidores(Number(datosEstadisticas.seguidores) || 0);
                setSeguidos(Number(datosEstadisticas.seguidos) || 0);

                setLoSigo(Boolean(datosSeguimiento.loSigo));

            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setError("No se pudo cargar el perfil del usuario.");
            } finally {
                setCargando(false);
            }
        };

        cargarPerfil();

    }, [id, token]);

    // Seguir o dejar de seguir
    const alternarSeguimiento = async () => {
        if (procesando || !token) return;

        try {
            setProcesando(true);

            const metodo = loSigo ? 'DELETE' : 'POST';

            const response = await fetch(
                `${API_URL}/api/usuarios/${id}/seguir`,
                {
                    method: metodo,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensaje || "No se pudo actualizar el seguimiento");
            }

            // Actualizar el estado del botón
            setLoSigo(!loSigo);

            // Actualizar la cantidad de seguidores
            setSeguidores(prev => prev + (loSigo ? -1 : 1));

        } catch (error) {
            console.error("Error al modificar seguimiento:", error);
            alert(error.message);
        } finally {
            setProcesando(false);
        }
    };

    if (cargando) {
        return (
            <div className="pagina-perfil-usuario">
                <Header />
                <main className="perfil-usuario-cargando">
                    Cargando perfil...
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="pagina-perfil-usuario">
                <Header />
                <main className="perfil-usuario-cargando">
                    <p>{error || "Usuario no encontrado"}</p>
                    <button onClick={() => navigate(-1)}>
                        Volver
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    const nombreMostrar =
        `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()
        || usuario.username;

    const usuarioTag = usuario.username
        ? `@${usuario.username.replace('@', '')}`
        : '@usuario';

    const fotoPerfil = usuario.foto_perfil;
    const bannerImg = usuario.banner;

    return (
        <div className="pagina-perfil-usuario">

            <Header />

            <main className="contenido-perfil-usuario">

                {/* TARJETA DEL PERFIL */}
                <section className="tarjeta-perfil-usuario">

                    {/* BANNER */}
                    <div
                        className="portada-perfil-usuario"
                        style={{
                          backgroundImage: bannerImg
                            ? `url("${obtenerImagen(bannerImg)}")`
                            : 'linear-gradient(135deg, #f8eaf1 0%, #e9cbdc 100%)',
                        }}
                    />

                    <div className="datos-perfil-usuario">

                        {/* FOTO DE PERFIL */}
                        <div className="avatar-perfil-usuario">

                            {fotoPerfil ? (
                                <img
                                    src={obtenerImagen(fotoPerfil)}
                                    alt={`Foto de ${nombreMostrar}`}
                                />
                            ) : (
                                <svg
                                    width="42"
                                    height="42"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#8b5274"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            )}

                        </div>

                        {/* NOMBRE Y DESCRIPCIÓN */}
                        <div className="nombre-perfil-usuario">

                            <h1>{nombreMostrar}</h1>

                            <p className="usuario-perfil-usuario">
                                {usuarioTag}
                            </p>

                            {usuario.descripcion && (
                                <p className="descripcion-perfil-usuario">
                                    {usuario.descripcion}
                                </p>
                            )}

                        </div>

                        {/* ESTADÍSTICAS */}
                        <div className="estadisticas-perfil-usuario">

                            <div>
                                <strong>{publicaciones.length}</strong>
                                <span>Publicaciones</span>
                            </div>

                            <div>
                                <strong>{seguidores}</strong>
                                <span>Seguidores</span>
                            </div>

                            <div>
                                <strong>{seguidos}</strong>
                                <span>Siguiendo</span>
                            </div>

                            {/* BOTONES */}
                            <div className="botones-perfil-usuario">

                                <button
                                    className={
                                        loSigo
                                            ? "btn-dejar-seguir"
                                            : "btn-seguir"
                                    }
                                    onClick={alternarSeguimiento}
                                    disabled={procesando}
                                >
                                    {procesando
                                        ? "Procesando..."
                                        : loSigo
                                            ? "Dejar de seguir"
                                            : "Seguir"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* PESTAÑA DE PUBLICACIONES */}
                <div className="pestanas-perfil-usuario">
                    <button className="activa">
                        Publicaciones
                    </button>
                </div>

                {/* PUBLICACIONES */}
                <section className="grid-perfil-usuario">

                    {publicaciones.length === 0 ? (

                        <p className="sin-contenido-perfil-usuario">
                            Este usuario todavía no tiene publicaciones.
                        </p>

                    ) : (

                        publicaciones.map(post => (

                            <button
                                key={post.id_publicacion}
                                className="post-perfil-usuario"
                                type="button"
                                onClick={() =>
                                    navigate(`/publicacion/${post.id_publicacion}`)
                                }
                            >

                                <div className="foto-post-perfil-usuario">

                                    {post.imagen_url && (
                                        <img
                                            src={obtenerImagen(post.imagen_url)}
                                            alt={`Publicación de ${usuario.username}`}
                                        />
                                    )}

                                </div>

                                <div className="pie-post-perfil-usuario">
                                    <span>
                                        {post.descripcion || ''}
                                    </span>
                                </div>

                            </button>

                        ))

                    )}

                </section>

            </main>

            <Footer />

        </div>
    );
}

export default PerfilUsuario;