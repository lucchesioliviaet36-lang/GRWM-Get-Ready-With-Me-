import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './busqueda.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

const API_URL = "http://localhost:3000";

const Busqueda = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [usuariosSeguidos, setUsuariosSeguidos] = useState([]);

  const [buscando, setBuscando] = useState(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(true);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState([]);

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

  // Cargar sugerencias aleatorias
  useEffect(() => {
    const cargarSugerencias = async () => {
      try {
        setCargandoSugerencias(true);

        const response = await fetch(
          `${API_URL}/api/usuarios/sugerencias`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.mensaje || "No se pudieron cargar las sugerencias");
        }

        const usuarios = data.usuarios || [];
        setSugerencias(usuarios);

        // Consultar cuáles de estos usuarios ya seguimos
        const estados = await Promise.all(
          usuarios.map(async (usuario) => {
            const respuesta = await fetch(
              `${API_URL}/api/usuarios/${usuario.id_usuario}/seguir`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (!respuesta.ok) return null;

            const estado = await respuesta.json();

            return estado.loSigo ? usuario.id_usuario : null;
          })
        );

        setUsuariosSeguidos(estados.filter(Boolean));

      } catch (error) {
        console.error("Error al cargar sugerencias:", error);
      } finally {
        setCargandoSugerencias(false);
      }
    };

    if (token) {
      cargarSugerencias();
    } else {
      setCargandoSugerencias(false);
    }
  }, [token]);

  // Buscar usuarios
  useEffect(() => {
    if (busqueda.trim() === "") {
      setResultados([]);
      setError("");
      setBuscando(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setBuscando(true);
        setError("");

        if (!token) {
          setError("Debes iniciar sesión para buscar usuarios");
          return;
        }

        const respuesta = await fetch(
          `${API_URL}/api/usuarios/buscar?q=${encodeURIComponent(busqueda.trim())}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.mensaje || "No se pudo realizar la búsqueda");
        }

        setResultados(datos.usuarios || []);

      } catch (error) {
        console.error("Error buscando usuarios:", error);
        setError(error.message || "No se pudo conectar con el servidor");
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 350);

    return () => clearTimeout(timeout);

  }, [busqueda, token]);

  // Seguir o dejar de seguir desde sugerencias
  const alternarSeguimiento = async (usuario) => {
    const id = usuario.id_usuario;

    if (procesando.includes(id)) return;

    const loSigo = usuariosSeguidos.includes(id);

    try {
      setProcesando(prev => [...prev, id]);

      const response = await fetch(
        `${API_URL}/api/usuarios/${id}/seguir`,
        {
          method: loSigo ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo actualizar el seguimiento");
      }

      setUsuariosSeguidos(prev =>
        loSigo
          ? prev.filter(usuarioId => usuarioId !== id)
          : [...prev, id]
      );

    } catch (error) {
      console.error("Error al seguir usuario:", error);
      alert(error.message);
    } finally {
      setProcesando(prev => prev.filter(usuarioId => usuarioId !== id));
    }
  };

  return (
    <div className="busqueda-page">

      <Header />

      <div className="busqueda-container">

        {/* SUGERENCIAS */}

        <aside className="busqueda-sidebar">

          <section className="seccion-sugerencias">

            <h3>Personas que quizás conozcas</h3>

            <p className="subtitulo-sugerencias">
              Descubrí nuevos usuarios de GRWM ✧
            </p>

            <div className="lista-sugerencias">

              {cargandoSugerencias && (
                <p className="mensaje-sugerencias">
                  Buscando personas...
                </p>
              )}

              {!cargandoSugerencias && sugerencias.length === 0 && (
                <p className="mensaje-sugerencias">
                  Todavía no hay sugerencias disponibles.
                </p>
              )}

              {sugerencias.map((usuario) => {
                const loSigo = usuariosSeguidos.includes(usuario.id_usuario);

                return (
                  <div
                    key={usuario.id_usuario}
                    className="sugerencia-item"
                  >

                    <button
                      type="button"
                      className="sugerencia-perfil"
                      onClick={() =>
                        navigate(`/perfil_usuario/${usuario.id_usuario}`)
                      }
                    >

                      <div className="sugerencia-foto">
                        {usuario.foto_perfil ? (
                          <img
                            src={obtenerImagen(usuario.foto_perfil)}
                            alt=""
                          />
                        ) : (
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a58b9c"
                            strokeWidth="1.8"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
                          </svg>
                        )}
                      </div>

                      <div className="user-meta">
                        <strong>{usuario.nombre} {usuario.apellido}</strong>
                        <span>@{usuario.username}</span>
                      </div>

                    </button>

                    <button
                      type="button"
                      className={`btn-seguir ${loSigo ? "siguiendo" : ""}`}
                      onClick={() => alternarSeguimiento(usuario)}
                      disabled={procesando.includes(usuario.id_usuario)}
                    >
                      {procesando.includes(usuario.id_usuario)
                        ? "..."
                        : loSigo
                          ? "Siguiendo"
                          : "Seguir"
                      }
                    </button>

                  </div>
                );
              })}

            </div>

          </section>

        </aside>

        {/* BUSCADOR PRINCIPAL */}

        <main className="busqueda-main">

          <div className="search-bar-wrapper">

            <svg
              className="search-icon"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              placeholder="Buscá personas por nombre o usuario..."
              className="input-busqueda-principal"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {busqueda && (
              <button
                type="button"
                className="limpiar-busqueda"
                onClick={() => setBusqueda("")}
              >
                ×
              </button>
            )}

          </div>

          {/* ESTADO INICIAL */}

          {busqueda.trim() === "" && (
            <div className="busqueda-resultados-vacio">
              <p>Encontrá personas y descubrí nuevos perfiles de GRWM ✧</p>
            </div>
          )}

          {/* BUSCANDO */}

          {buscando && (
            <div className="estado-busqueda">
              <span className="punto-cargando"></span>
              Buscando usuarios...
            </div>
          )}

          {/* ERROR */}

          {!buscando && error && (
            <div className="busqueda-resultados-vacio">
              <p>{error}</p>
            </div>
          )}

          {/* SIN RESULTADOS */}

          {!buscando &&
            !error &&
            busqueda.trim() !== "" &&
            resultados.length === 0 && (
              <div className="busqueda-resultados-vacio">
                <p>No encontramos usuarios con ese nombre.</p>
              </div>
            )
          }

          {/* RESULTADOS */}

          {!buscando && resultados.length > 0 && (
            <section className="resultados-usuarios">

              <div className="titulo-resultados">
                <h3>Personas</h3>
                <span>{resultados.length} resultados</span>
              </div>

              <div className="lista-resultados-usuarios">

                {resultados.map((usuario) => (
                  <button
                    key={usuario.id_usuario}
                    type="button"
                    className="resultado-usuario"
                    onClick={() =>
                      navigate(`/perfil_usuario/${usuario.id_usuario}`)
                    }
                  >

                    <div className="usuario-info">

                      <div className="usuario-foto">

                        {usuario.foto_perfil ? (
                          <img
                            src={obtenerImagen(usuario.foto_perfil)}
                            alt=""
                            className="usuario-foto-img"
                          />
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a58b9c"
                            strokeWidth="1.8"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
                          </svg>
                        )}

                      </div>

                      <div className="datos-resultado">
                        <strong>{usuario.nombre} {usuario.apellido}</strong>
                        <span>@{usuario.username}</span>
                      </div>

                    </div>


                  </button>
                ))}

              </div>

            </section>
          )}

        </main>

      </div>

      <Footer />

    </div>
  );
};

export default Busqueda;