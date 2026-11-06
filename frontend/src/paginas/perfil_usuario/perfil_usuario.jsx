import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './perfil_usuario.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import ModalSeguimiento from "../../paginas/modal_seguimiento/modal_seguimiento";

const API_URL = "http://localhost:3000";

function PerfilUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [modalSeguimiento, setModalSeguimiento] = useState(null);

    const token = localStorage.getItem('token');

    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);

    const [seguidores, setSeguidores] = useState(0);
    const [seguidos, setSeguidos] = useState(0);

    const [loSigo, setLoSigo] = useState(false);
    const [errorSeguimiento, setErrorSeguimiento] = useState('');
    const [seguimientoDisponible, setSeguimientoDisponible] = useState(true);
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

        return `${API_URL}${imagen.startsWith("/") ? "" : "/"}${imagen}`;
    };

    // Cargar información del perfil
    useEffect(() => {
        if (!id) {
            setError("No se indicó qué perfil querés ver.");
            setCargando(false);
            return;
        }

        if (!token) {
            setError("Iniciá sesión para ver este perfil.");
            setCargando(false);
            return;
        }

        const controller = new AbortController();
        const cargarPerfil = async () => {
            try {
                setCargando(true);
                setError('');
                setUsuario(null);
                setPublicaciones([]);
                setSeguidores(0);
                setSeguidos(0);
                setLoSigo(false);
                setErrorSeguimiento('');
                setSeguimientoDisponible(true);

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const consultarJson = async (url) => {
                    const respuesta = await fetch(url, {
                        headers,
                        signal: controller.signal
                    });
                    let cuerpo = {};
                    try {
                        cuerpo = await respuesta.json();
                    } catch {
                        cuerpo = {};
                    }

                    if (!respuesta.ok) {
                        throw new Error(
                            cuerpo.mensaje ||
                            cuerpo.message ||
                            `No se pudo cargar el perfil (${respuesta.status}).`
                        );
                    }

                    return cuerpo;
                };

                const [datosUsuario, datosPublicaciones] = await Promise.all([
                    consultarJson(`${API_URL}/api/usuarios/${id}`),
                    consultarJson(`${API_URL}/api/publicaciones`)
                ]);
                const listaPublicaciones = Array.isArray(datosPublicaciones)
                    ? datosPublicaciones
                    : datosPublicaciones?.publicaciones;

                if (!Array.isArray(listaPublicaciones)) {
                    throw new Error("El servidor devolvió un formato de publicaciones no válido.");
                }

                const perfil = datosUsuario.usuario || datosUsuario;
                if (!perfil?.id_usuario) {
                    throw new Error("No se encontró el usuario solicitado.");
                }

                setUsuario(perfil);
                setPublicaciones(
                    listaPublicaciones.filter(
                        post => Number(post.id_usuario) === Number(id)
                    )
                );

                const resultadosSeguimiento = await Promise.allSettled([
                    consultarJson(`${API_URL}/api/usuarios/${id}/estadisticas-seguimiento`),
                    consultarJson(`${API_URL}/api/usuarios/${id}/seguir`)
                ]);

                if (resultadosSeguimiento.every((resultado) => resultado.status === 'fulfilled')) {
                    const [datosEstadisticas, datosSeguimiento] = resultadosSeguimiento
                        .map((resultado) => resultado.value);
                    setSeguidores(Number(datosEstadisticas.seguidores) || 0);
                    setSeguidos(Number(datosEstadisticas.seguidos) || 0);
                    setLoSigo(Boolean(datosSeguimiento.loSigo));
                } else {
                    resultadosSeguimiento.forEach((resultado) => {
                        if (resultado.status === 'rejected') {
                            console.error("Error al cargar los datos de seguimiento:", resultado.reason);
                        }
                    });
                    setErrorSeguimiento("Las estadísticas y el seguimiento no están disponibles por el momento.");
                    setSeguimientoDisponible(false);
                }

            } catch (error) {
                if (error.name === 'AbortError') return;
                console.error("Error al cargar el perfil:", error);
                setError(error.message || "No se pudo cargar el perfil del usuario.");
            } finally {
                if (!controller.signal.aborted) {
                    setCargando(false);
                }
            }

        };

        cargarPerfil();
        return () => controller.abort();

    }, [id, token]);

    // Seguir o dejar de seguir
    const alternarSeguimiento = async () => {
        if (procesando || !token || !seguimientoDisponible) return;

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
                    <button
                        onClick={() => error.includes("Iniciá sesión")
                            ? navigate('/IniciarSesion')
                            : navigate(-1)}
                    >
                        {error.includes("Iniciá sesión") ? "Iniciar sesión" : "Volver"}
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

                            <button
                                type="button"
                                className="estadistica-seguimiento"
                                onClick={() => setModalSeguimiento('seguidores')}
                                disabled={!seguimientoDisponible}
                            >
                                <strong>{seguidores}</strong>
                                <span>Seguidores</span>
                            </button>

                            <button
                                type="button"
                                className="estadistica-seguimiento"
                                onClick={() => setModalSeguimiento('seguidos')}
                                disabled={!seguimientoDisponible}
                            >
                                <strong>{seguidos}</strong>
                                <span>Siguiendo</span>
                            </button>

                            {/* BOTONES */}
                            <div className="botones-perfil-usuario">

                                <button
                                    className={
                                        loSigo
                                            ? "btn-dejar-seguir"
                                            : "btn-seguir"
                                    }
                                    onClick={alternarSeguimiento}
                                    disabled={procesando || !seguimientoDisponible}
                                >
                                    {procesando
                                        ? "Procesando..."
                                        : !seguimientoDisponible
                                            ? "No disponible"
                                            : loSigo
                                            ? "Dejar de seguir"
                                            : "Seguir"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                    {errorSeguimiento && (
                        <p className="error-seguimiento-perfil" role="status">
                            {errorSeguimiento}
                        </p>
                    )}

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
                                    {!post.imagen_url && (
                                        <span className="post-sin-imagen-perfil-usuario">
                                            Sin imagen
                                        </span>
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

            {modalSeguimiento && (
                <ModalSeguimiento
                    idUsuario={id}
                    pestanaInicial={modalSeguimiento}
                    onCerrar={() => setModalSeguimiento(null)}
                    onSeleccionarUsuario={(idUsuario) => {
                        setModalSeguimiento(null);
                        navigate(`/perfil_usuario/${idUsuario}`);
                    }}
                />
            )}

        </div>
    );
}

export default PerfilUsuario;