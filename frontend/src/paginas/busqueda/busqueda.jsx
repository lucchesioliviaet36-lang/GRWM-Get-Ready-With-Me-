import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './busqueda.css';
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import Usuario1 from "../../assets/imagenes/olivia.jpg";
import Usuario2 from "../../assets/imagenes/baddbunny.jpg";
import Usuario3 from "../../assets/imagenes/sabrina.jpg";

const Busqueda = () => {

  const navigate = useNavigate();

  //Para obtener la foto de perfil del usuario que estamos buscando
  const obtenerImagen = (imagen) => {
    if (!imagen) return "";
    if (imagen.startsWith("http") || imagen.startsWith("blob:") || imagen.startsWith("data:")) {
      return imagen;
    }
    return `http://localhost:3000${imagen}`;
  };


  // Texto ingresado en el buscador
  const [busqueda, setBusqueda] = useState("");

  // Usuarios encontrados en la base de datos
  const [resultados, setResultados] = useState([]);

  // Estados de búsqueda
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");


  // Datos basados en la imagen de referencia
  const tendencias = [
    { tag: "#OOTDMinimal", posts: "1.2k posts" },
    { tag: "#CottageCore", posts: "1.2k posts" },
    { tag: "#StreetwearSp", posts: "1.2k posts" },
    { tag: "#SecondHandFinds", posts: "1.2k posts" },
    { tag: "#Y2KRevival", posts: "1.2k posts" },
  ];


  const sugerencias = [
    {
      nombre: "Olivia Privv",
      username: "@notOlivia",
      avatar: Usuario1
    },
    {
      nombre: "Benito",
      username: "@bad.bunny",
      avatar: Usuario2
    },
    {
      nombre: "Sabrina Carpintero",
      username: "@sabrinaC",
      avatar: Usuario3
    },
  ];


  // Buscar usuarios en el backend
  useEffect(() => {

    // Si el buscador está vacío,
    // no hacemos ninguna petición
    if (busqueda.trim() === "") {

      setResultados([]);
      setError("");
      setBuscando(false);

      return;
    }


    // Esperamos un poco antes de buscar
    // para no hacer una petición por cada tecla
    const timeout = setTimeout(async () => {

      try {

        setBuscando(true);
        setError("");

        const token =
          localStorage.getItem("token");


        if (!token) {

          setError(
            "Debes iniciar sesión para buscar usuarios"
          );

          return;
        }


        const respuesta = await fetch(
          `http://localhost:3000/api/usuarios/buscar?q=${encodeURIComponent(busqueda.trim())}`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        const datos =
          await respuesta.json();


        if (!respuesta.ok) {

          setError(
            datos.mensaje ||
            "No se pudo realizar la búsqueda"
          );

          setResultados([]);

          return;
        }


        setResultados(
          datos.usuarios || []
        );


      } catch (error) {

        console.error(
          "Error buscando usuarios:",
          error
        );

        setError(
          "No se pudo conectar con el servidor"
        );

        setResultados([]);

      } finally {

        setBuscando(false);

      }

    }, 350);


    // Cancelamos la búsqueda anterior
    // si el usuario sigue escribiendo
    return () => {
      clearTimeout(timeout);
    };


  }, [busqueda]);


  return (
    <div className="busqueda-page">
      
      <Header />


      <div className="busqueda-container">

        {/* PANEL IZQUIERDO: TENDENCIAS Y SUGERENCIAS */}

        <aside className="busqueda-sidebar">

          <section className="seccion-tendencias">

            <h3>
              Tendencias para ti
            </h3>


            <div className="lista-tendencias">

              {tendencias.map((item, index) => (

                <div
                  key={index}
                  className="tendencia-item"
                >

                  <span className="tendencia-tag">
                    {item.tag}
                  </span>

                  <span className="tendencia-posts">
                    {item.posts}
                  </span>

                </div>

              ))}

            </div>

          </section>


          <section className="seccion-sugerencias">

            <h3>
              Sugerencias
            </h3>


            <div className="lista-sugerencias">

              {sugerencias.map((user, index) => (

                <div
                  key={index}
                  className="sugerencia-item"
                >

                  <img
                    src={user.avatar}
                    alt={user.nombre}
                  />


                  <div className="user-meta">

                    <h4>
                      {user.nombre}
                    </h4>

                    <span>
                      {user.username}
                    </span>

                  </div>


                  <button className="btn-seguir">
                    Seguir
                  </button>

                </div>

              ))}

            </div>

          </section>

        </aside>


        {/* ÁREA PRINCIPAL */}

        <main className="busqueda-main">


          {/* BARRA DE BÚSQUEDA */}

          <div className="search-bar-wrapper">

            <span className="search-icon">
              🔍︎
            </span>

            <input 
              type="text"

              placeholder="Buscar usuarios..."

              className="input-busqueda-principal"

              value={busqueda}

              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

          </div>


          {/* SIN BÚSQUEDA */}

          {busqueda.trim() === "" && (

            <div className="busqueda-resultados-vacio">

              <p>
                Explora lo último en la comunidad GRWM ✧
              </p>

            </div>

          )}


          {/* BUSCANDO */}

          {buscando && (

            <div className="busqueda-resultados-vacio">

              <p>
                Buscando usuarios...
              </p>

            </div>

          )}


          {/* ERROR */}

          {!buscando && error && (

            <div className="busqueda-error">

              <p>
                {error}
              </p>

            </div>

          )}


          {/* NO SE ENCONTRARON USUARIOS */}

          {!buscando &&
            !error &&
            busqueda.trim() !== "" &&
            resultados.length === 0 && (

              <div className="busqueda-resultados-vacio">

                <p>
                  No se encontraron usuarios.
                </p>

              </div>

            )
          }


          {/* RESULTADOS */}

          {!buscando &&
            resultados.length > 0 && (

              <section className="resultados-usuarios">

                <h3>
                  Usuarios
                </h3>


                <div className="lista-resultados-usuarios">

                {resultados.map((usuario) => (
                  <button
                    key={usuario.id_usuario}
                    type="button"
                    className="resultado-usuario"
                    onClick={() => navigate(`/perfil_usuario/${usuario.id_usuario}`)}
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
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a58b9c"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
                          </svg>
                        )}
                      </div>

                      <strong>@{usuario.username}</strong>
                    </div>
                  </button>
                ))}

                </div>

              </section>

            )
          }

        </main>

      </div>


      <Footer/>          

    </div>
  );
};

export default Busqueda;