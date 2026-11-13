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
    const [mostrarFotoAmpliada, setMostrarFotoAmpliada] = useState(false);
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
    const [pestanaActiva, setPestanaActiva] = useState("publicaciones");
    const [productosPerfil, setProductosPerfil] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(false);
    const [errorProductos, setErrorProductos] = useState("");


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

    // CARGAR PRODUCTOS DEL USUARIO
    useEffect(() => {

    if (pestanaActiva !== "productos" || !id || !token) {
        return;
    }

    const cargarProductos = async () => {
        try {
        setCargandoProductos(true);
        setErrorProductos("");

        const response = await fetch(
            `${API_URL}/api/productos/usuario/${id}`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
            data.message ||
            "No se pudieron cargar los productos"
            );
        }

        setProductosPerfil(
            data.productos || []
        );

        } catch (error) {
        console.error(
            "Error cargando productos:",
            error
        );

        setErrorProductos(
            error.message
        );

        } finally {
        setCargandoProductos(false);
        }
    };

    cargarProductos();
    }, [pestanaActiva, id, token]);

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
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                            style={{ opacity: 0.35 }}
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    )}
                </div>

                    <div className="datos-perfil-usuario">

                        {/* FOTO DE PERFIL */}
                        <div className={`avatar-perfil-usuario${fotoPerfil ? ' avatar-perfil-ampliable' : ''}`}>

                            {fotoPerfil ? (
                                <button
                                    type="button"
                                    className="avatar-perfil-usuario-boton"
                                    onClick={() => setMostrarFotoAmpliada(true)}
                                    aria-label={`Ampliar foto de ${nombreMostrar}`}
                                >
                                    <img
                                        src={obtenerImagen(fotoPerfil)}
                                        alt={`Foto de ${nombreMostrar}`}
                                    />
                                </button>
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
                    <button className={pestanaActiva === "publicaciones" ? "activa" : ""}
                        onClick={() => setPestanaActiva("publicaciones")}
                    >Publicaciones
                    </button>

                    <button className={ pestanaActiva === "productos" ? "activa" : ""}
                        onClick={() => setPestanaActiva("productos")}
                    >Productos
                    </button>

                </div>

                {/* PUBLICACIONES */}
                {pestanaActiva === "publicaciones" && (
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
                                    onClick={() => navigate( `/publicacion/${post.id_publicacion}`)}
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
                                            {post.descripcion || ""}
                                        </span>
                                    </div>

                                </button>

                            ))

                        )}

                    </section>
                )}

                {pestanaActiva === "productos" && (

                    <section className="grid-productos-perfil">
                        {cargandoProductos ? (
                            <p className="sin-contenido-perfil-usuario">
                                Cargando productos...
                            </p>
                        ) : errorProductos ? (

                            <p className="sin-contenido-perfil-usuario">
                                {errorProductos}
                            </p>

                        ) : productosPerfil.length === 0 ? (

                            <p className="sin-contenido-perfil-usuario">
                                Este usuario todavía no tiene productos publicados.
                            </p>

                        ) : (

                        productosPerfil.map((producto) => {
                            const disponible = Boolean(producto.estado_producto) &&  Number(producto.stock) > 0;
                            const promedio = Number(producto.promedio_calificacion || 0);
                            const estrellas = Math.round(promedio);

                            return (
                                <article
                                    className={`producto-perfil-card ${
                                    !disponible
                                        ? "producto-perfil-agotado"
                                        : ""
                                    }`}
                                    key={producto.id_producto}
                                >

                                    <div className="producto-perfil-imagen">

                                    {producto.imagen ? (

                                        <img
                                        src={obtenerImagen(
                                            producto.imagen
                                        )}
                                        alt={producto.nombre}
                                        />

                                    ) : (

                                        <div className="producto-perfil-sin-imagen">
                                        Sin imagen
                                        </div>

                                    )}


                                    {!disponible && (

                                        <div className="producto-overlay-stock">

                                        <span>
                                            Sin stock
                                        </span>

                                        </div>

                                    )}

                                    </div>

                                    <div className="producto-perfil-info">
                                        <span className="producto-perfil-categoria">
                                            {producto.categoria}
                                        </span>
                                        <h3>
                                            {producto.nombre}
                                        </h3>

                                        <div className="producto-perfil-footer">
                                            <strong className="producto-perfil-precio">
                                            $
                                            {Number( producto.precio ).toLocaleString("es-AR")}
                                            </strong>
                                            {disponible ? (
                                            <button
                                                type="button"
                                                className="btn-comprar-producto-perfil"
                                                onClick={() => navigate( `/pago/${producto.id_producto}`)}
                                            >Comprar
                                            </button>
                                            ) : (
                                            <div className="producto-rating">
                                                <div className="producto-estrellas">
                                                    {[1, 2, 3, 4, 5].map((estrella) => (
                                                        <span
                                                            key={estrella}
                                                            className={
                                                            estrella <= estrellas
                                                                ? "estrella-rating pintada"
                                                                : "estrella-rating"
                                                            }
                                                        >★</span>
                                                        
                                                    ))}
                                                </div>

                                                <span className="producto-promedio">
                                                    {Number(
                                                        producto.cantidad_calificaciones
                                                    ) > 0
                                                        ? `${promedio.toFixed(1)} / 5`
                                                        : "Sin calificar"}
                                                </span>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })

                        )}
                    </section>

                )}

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

            {mostrarFotoAmpliada && fotoPerfil && (
                <div
                    className="foto-perfil-overlay"
                    role="presentation"
                    onClick={() => setMostrarFotoAmpliada(false)}
                >
                    <div
                        className="foto-perfil-ampliada-contenedor"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Foto de perfil de ${nombreMostrar}`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="foto-perfil-cerrar"
                            onClick={() => setMostrarFotoAmpliada(false)}
                            aria-label="Cerrar foto ampliada"
                        >
                            ×
                        </button>
                        <img src={obtenerImagen(fotoPerfil)} alt={`Foto de ${nombreMostrar}`} />
                    </div>
                </div>
            )}

        </div>
    );
}

export default PerfilUsuario;