import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./iaOutfit.css";

import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";

const API_URL = "http://localhost:3000";


function AIOutfit() {

  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);

  const [temporada, setTemporada] = useState("");

  const [modo, setModo] = useState("mixto");

  const [categorias, setCategorias] = useState([
    "remeras",
    "partes_abajo"
  ]);

  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [prendas, setPrendas] = useState([]);

  const [prendasSeleccionadas, setPrendasSeleccionadas] =
    useState([]);

  const [outfit, setOutfit] = useState(null);

  const [cargandoPrendas, setCargandoPrendas] =
    useState(false);

  const [generando, setGenerando] = useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // CATEGORÍAS
  // =========================================================

  const opcionesCategorias = [
    {
      value: "remeras",
      nombre: "Remeras",
      icono: "👕"
    },
    {
      value: "partes_abajo",
      nombre: "Partes de abajo",
      icono: "👖"
    },
    {
      value: "abrigos",
      nombre: "Abrigos",
      icono: "🧥"
    },
    {
      value: "zapatos",
      nombre: "Zapatos",
      icono: "👟"
    },
    {
      value: "carteras",
      nombre: "Carteras",
      icono: "👜"
    },
    {
      value: "accesorios",
      nombre: "Accesorios",
      icono: "✧"
    }
  ];


  // =========================================================
  // OBTENER PRENDAS
  // =========================================================

  const obtenerPrendas = async () => {

    try {

      setCargandoPrendas(true);
      setError("");

      const token =
        localStorage.getItem("token");


      if (!token) {
        navigate("/");
        return;
      }


      const parametros =
        new URLSearchParams();


      parametros.append(
        "modo",
        modo
      );


      if (categorias.length > 0) {

        parametros.append(
          "categorias",
          categorias.join(",")
        );

      }


      const response = await fetch(
        `${API_URL}/api/ai/prendas?${parametros.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (
        response.status === 401
      ) {

        localStorage.removeItem("token");

        navigate("/");

        return;
      }


      if (!response.ok) {

        throw new Error(
          data.message ||
          "No se pudieron cargar las prendas"
        );

      }


      setPrendas(
        data.prendas || []
      );


    } catch (error) {

      console.error(
        "Error cargando prendas:",
        error
      );

      setError(error.message);

    } finally {

      setCargandoPrendas(false);

    }
  };


  // =========================================================
  // ACTUALIZAR PRENDAS CUANDO CAMBIAN FILTROS
  // =========================================================

  useEffect(() => {

    if (categorias.length > 0) {
      obtenerPrendas();
    } else {
      setPrendas([]);
    }

  }, [modo, categorias]);


  // =========================================================
  // CAMBIAR CATEGORÍA
  // =========================================================

  const cambiarCategoria = (
    categoria
  ) => {

    setCategorias(
      (actuales) => {

        if (
          actuales.includes(categoria)
        ) {

          return actuales.filter(
            (item) =>
              item !== categoria
          );

        }


        return [
          ...actuales,
          categoria
        ];

      }
    );

  };


  // =========================================================
  // SELECCIONAR PRENDA
  // =========================================================

  const seleccionarPrenda = (
    prenda
  ) => {

    const existe =
      prendasSeleccionadas.some(
        (seleccionada) =>
          seleccionada.id ===
            prenda.id
          &&
          seleccionada.origen ===
            prenda.origen
      );


    if (existe) {

      setPrendasSeleccionadas(
        (actuales) =>
          actuales.filter(
            (seleccionada) =>
              !(
                seleccionada.id ===
                  prenda.id
                &&
                seleccionada.origen ===
                  prenda.origen
              )
          )
      );

      return;
    }


    setPrendasSeleccionadas(
      (actuales) => [
        ...actuales,
        prenda
      ]
    );

  };


  // =========================================================
  // SABER SI UNA PRENDA ESTÁ SELECCIONADA
  // =========================================================

  const estaSeleccionada = (
    prenda
  ) => {

    return prendasSeleccionadas.some(
      (seleccionada) =>
        seleccionada.id ===
          prenda.id
        &&
        seleccionada.origen ===
          prenda.origen
    );

  };


  // =========================================================
  // FILTRAR PRENDAS LOCALMENTE
  // =========================================================

  const prendasFiltradas =
    useMemo(() => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();


      if (!texto) {
        return prendas;
      }


      return prendas.filter(
        (prenda) => {

          const contenido = `
            ${prenda.nombre || ""}
            ${prenda.categoria || ""}
            ${prenda.color || ""}
            ${prenda.descripcion || ""}
          `.toLowerCase();


          return contenido.includes(
            texto
          );

        }
      );

    }, [prendas, busqueda]);


  // =========================================================
  // DIVIDIR ARMARIO / CATÁLOGO
  // =========================================================

  const prendasArmario =
    prendasFiltradas.filter(
      (prenda) =>
        prenda.origen === "armario"
    );


  const prendasCatalogo =
    prendasFiltradas.filter(
      (prenda) =>
        prenda.origen === "catalogo"
    );


  // =========================================================
  // GENERAR OUTFIT
  // =========================================================

  const generarOutfit = async () => {

    setError("");


    if (!temporada) {

      setError(
        "Seleccioná una temporada."
      );

      return;
    }


    if (
      categorias.length === 0
    ) {

      setError(
        "Seleccioná al menos una categoría."
      );

      return;
    }


    if (
      mensaje.trim() === ""
    ) {

      setError(
        "Contanos qué tipo de outfit estás buscando."
      );

      return;
    }


    try {

      setGenerando(true);


      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/");

        return;

      }


      const response = await fetch(
        `${API_URL}/api/ai/outfit`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            mensaje,

            temporada,

            categorias,

            modo,

            prendasSeleccionadas:
              prendasSeleccionadas.map(
                (prenda) => ({
                  id: prenda.id,
                  origen: prenda.origen
                })
              )

          })
        }
      );


      const data =
        await response.json();


      if (
        response.status === 401
      ) {

        localStorage.removeItem(
          "token"
        );

        navigate("/");

        return;

      }


      if (!response.ok) {

        throw new Error(
          data.message ||
          "No se pudo generar el outfit"
        );

      }


      setOutfit(
        data.outfit
      );


      setTimeout(() => {

        document
          .getElementById(
            "resultado-outfit"
          )
          ?.scrollIntoView({
            behavior: "smooth"
          });

      }, 100);


    } catch (error) {

      console.error(
        "Error generando outfit:",
        error
      );

      setError(
        error.message
      );

    } finally {

      setGenerando(false);

    }

  };


  // =========================================================
  // GENERAR OTRO
  // =========================================================

  const generarOtro = () => {
    generarOutfit();
  };


  // =========================================================
  // CERRAR SESIÓN
  // =========================================================

  const cerrarSesion = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/");

  };


  // =========================================================
  // TARJETA DE PRENDA
  // =========================================================

  const renderPrenda = (
    prenda
  ) => {

    const seleccionada =
      estaSeleccionada(prenda);


    return (

      <button
        type="button"
        key={`${prenda.origen}-${prenda.id}`}
        className={
          seleccionada
            ? "ai-prenda-card seleccionada"
            : "ai-prenda-card"
        }
        onClick={() =>
          seleccionarPrenda(prenda)
        }
      >

        <div className="ai-prenda-imagen">

          {prenda.imagen ? (

            <img
              src={prenda.imagen}
              alt={prenda.nombre}
            />

          ) : (

            <div className="ai-sin-imagen">
              ♡
            </div>

          )}


          <span className="ai-check-prenda">
            {seleccionada
              ? "✓"
              : "+"
            }
          </span>

        </div>


        <div className="ai-prenda-info">

          <span
            className={
              prenda.origen ===
              "armario"
                ? "ai-origen armario"
                : "ai-origen catalogo"
            }
          >

            {prenda.origen ===
            "armario"
              ? "♡ Mi Armario"
              : "✧ Inspiración"
            }

          </span>


          <h4>
            {prenda.nombre}
          </h4>


          {prenda.color && (

            <p>
              {prenda.color}
            </p>

          )}

        </div>

      </button>

    );

  };


  // =========================================================
  // JSX
  // =========================================================

  return (

    <div className="AIOutfit-Page">


      {/* =====================================================
          HEADER
      ====================================================== */}
      <Header/>


      {/* =====================================================
          HERO
      ====================================================== */}

      <main className="ai-contenido">

        <section className="ai-hero">

          <span className="ai-etiqueta">
            ✧ INTELIGENCIA ARTIFICIAL
          </span>

          <h1>
            Armá tu próximo outfit
          </h1>

          <p>
            Elegí tus preferencias,
            seleccioná prendas que quieras
            usar y dejá que GRWM combine
            tu armario con nueva inspiración.
          </p>

        </section>


        {/* ===================================================
            CONFIGURADOR
        ==================================================== */}

        <section className="ai-panel">


          {/* TEMPORADA */}

          <div className="ai-bloque">

            <div className="ai-bloque-titulo">

              <div>

                <span>
                  PASO 1
                </span>

                <h2>
                  Elegí la temporada
                </h2>

              </div>

              <p>
                Es obligatorio elegir una.
              </p>

            </div>


            <div className="temporadas-grid">

              <button
                type="button"
                className={
                  temporada ===
                  "veraniego"
                    ? "temporada-card activa"
                    : "temporada-card"
                }
                onClick={() =>
                  setTemporada(
                    "veraniego"
                  )
                }
              >

                <span className="temporada-icono">
                  ☀
                </span>

                <strong>
                  Veraniego
                </strong>

                <small>
                  Liviano y fresco
                </small>

              </button>


              <button
                type="button"
                className={
                  temporada ===
                  "media_estacion"
                    ? "temporada-card activa"
                    : "temporada-card"
                }
                onClick={() =>
                  setTemporada(
                    "media_estacion"
                  )
                }
              >

                <span className="temporada-icono">
                  ♡
                </span>

                <strong>
                  Media estación
                </strong>

                <small>
                  Equilibrado y versátil
                </small>

              </button>


              <button
                type="button"
                className={
                  temporada ===
                  "abrigado"
                    ? "temporada-card activa"
                    : "temporada-card"
                }
                onClick={() =>
                  setTemporada(
                    "abrigado"
                  )
                }
              >

                <span className="temporada-icono">
                  ❄
                </span>

                <strong>
                  Abrigado
                </strong>

                <small>
                  Cómodo y cálido
                </small>

              </button>

            </div>

          </div>


          {/* CATEGORÍAS */}

          <div className="ai-bloque">

            <div className="ai-bloque-titulo">

              <div>

                <span>
                  PASO 2
                </span>

                <h2>
                  ¿Qué querés incluir?
                </h2>

              </div>

              <p>
                Podés elegir varias categorías.
              </p>

            </div>


            <div className="categorias-grid">

              {opcionesCategorias.map(
                (categoria) => {

                  const activa =
                    categorias.includes(
                      categoria.value
                    );


                  return (

                    <button
                      type="button"
                      key={
                        categoria.value
                      }
                      className={
                        activa
                          ? "categoria-ai activa"
                          : "categoria-ai"
                      }
                      onClick={() =>
                        cambiarCategoria(
                          categoria.value
                        )
                      }
                    >

                      <span>
                        {
                          categoria.icono
                        }
                      </span>

                      {
                        categoria.nombre
                      }

                      <div className="categoria-check">

                        {activa
                          ? "✓"
                          : ""
                        }

                      </div>

                    </button>

                  );

                }
              )}

            </div>

          </div>


          {/* MODO */}

          <div className="ai-bloque">

            <div className="ai-bloque-titulo">

              <div>

                <span>
                  PASO 3
                </span>

                <h2>
                  ¿De dónde usamos ropa?
                </h2>

              </div>

            </div>


            <div className="modo-selector">

              <button
                type="button"
                className={
                  modo === "mixto"
                    ? "activo"
                    : ""
                }
                onClick={() =>
                  setModo("mixto")
                }
              >
                ♡ + ✧
                <span>
                  Armario + Inspiración
                </span>
              </button>


              <button
                type="button"
                className={
                  modo === "armario"
                    ? "activo"
                    : ""
                }
                onClick={() =>
                  setModo("armario")
                }
              >
                ♡
                <span>
                  Solo Mi Armario
                </span>
              </button>


              <button
                type="button"
                className={
                  modo === "catalogo"
                    ? "activo"
                    : ""
                }
                onClick={() =>
                  setModo("catalogo")
                }
              >
                ✧
                <span>
                  Solo Inspiración
                </span>
              </button>

            </div>

          </div>


          {/* PRENDAS */}

          <div className="ai-bloque">

            <div className="ai-bloque-titulo">

              <div>

                <span>
                  PASO 4
                </span>

                <h2>
                  Elegí prendas
                </h2>

              </div>

              <p>
                Es opcional. Si no elegís ninguna,
                GRWM decide por vos.
              </p>

            </div>


            <div className="ai-buscador">

              <span>
                ⌕
              </span>

              <input
                type="text"
                value={busqueda}
                placeholder="Buscar por nombre, color o categoría..."
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />

            </div>


            {prendasSeleccionadas.length > 0 && (

              <div className="seleccion-resumen">

                <span>
                  {
                    prendasSeleccionadas.length
                  }{" "}
                  {
                    prendasSeleccionadas.length === 1
                      ? "prenda seleccionada"
                      : "prendas seleccionadas"
                  }
                </span>


                <button
                  type="button"
                  onClick={() =>
                    setPrendasSeleccionadas(
                      []
                    )
                  }
                >
                  Limpiar selección
                </button>

              </div>

            )}


            {cargandoPrendas ? (

              <div className="ai-cargando">

                <div className="ai-loader"></div>

                <p>
                  Buscando prendas...
                </p>

              </div>

            ) : (

              <>

                {(modo === "mixto" ||
                  modo === "armario") && (

                  <div className="grupo-prendas">

                    <div className="grupo-prendas-header">

                      <div>

                        <span className="grupo-icono">
                          ♡
                        </span>

                        <div>

                          <h3>
                            Mi Armario
                          </h3>

                          <p>
                            Prendas que ya tenés
                          </p>

                        </div>

                      </div>


                      <strong>
                        {
                          prendasArmario.length
                        }
                      </strong>

                    </div>


                    {prendasArmario.length >
                    0 ? (

                      <div className="prendas-ai-grid">

                        {
                          prendasArmario.map(
                            renderPrenda
                          )
                        }

                      </div>

                    ) : (

                      <div className="sin-resultados">

                        Todavía no encontramos prendas de
                        tu armario para estas categorías.

                      </div>

                    )}

                  </div>

                )}


                {(modo === "mixto" ||
                  modo === "catalogo") && (

                  <div className="grupo-prendas">

                    <div className="grupo-prendas-header">

                      <div>

                        <span className="grupo-icono inspiracion">
                          ✧
                        </span>

                        <div>

                          <h3>
                            Inspiración
                          </h3>

                          <p>
                            Opciones del catálogo GRWM
                          </p>

                        </div>

                      </div>


                      <strong>
                        {
                          prendasCatalogo.length
                        }
                      </strong>

                    </div>


                    {prendasCatalogo.length >
                    0 ? (

                      <div className="prendas-ai-grid">

                        {
                          prendasCatalogo.map(
                            renderPrenda
                          )
                        }

                      </div>

                    ) : (

                      <div className="sin-resultados">

                        No encontramos opciones de
                        inspiración para esta selección.

                      </div>

                    )}

                  </div>

                )}

              </>

            )}

          </div>


          {/* PROMPT */}

          <div className="ai-bloque ai-chat-bloque">

            <div className="ai-bloque-titulo">

              <div>

                <span>
                  PASO 5
                </span>

                <h2>
                  Contale a GRWM qué buscás
                </h2>

              </div>

            </div>


            <div className="ai-chat">

              <div className="ai-mensaje-grwm">

                <div className="ai-avatar">
                  ✧
                </div>

                <div className="ai-burbuja">

                  <strong>
                    GRWM AI
                  </strong>

                  <p>
                    ¿Qué tipo de outfit te gustaría usar?
                    Podés contarme la ocasión, colores,
                    estilo o alguna prenda que quieras incluir.
                  </p>

                </div>

              </div>


              <div className="ai-input-chat">

                <textarea
                  value={mensaje}
                  placeholder="Ej: Quiero algo casual para salir con amigas, cómodo y en colores neutros..."
                  onChange={(e) =>
                    setMensaje(
                      e.target.value
                    )
                  }
                />


                <div className="ai-chat-footer">

                  <span>
                    {
                      mensaje.length
                    } / 1000
                  </span>


                  <button
                    type="button"
                    className="boton-generar-ai"
                    disabled={
                      generando
                    }
                    onClick={
                      generarOutfit
                    }
                  >

                    {generando
                      ? "Creando outfit..."
                      : "✧ Generar Outfit"
                    }

                  </button>

                </div>

              </div>

            </div>

          </div>


          {error && (

            <div className="ai-error">
              {error}
            </div>

          )}

        </section>


        {/* ===================================================
            RESULTADO
        ==================================================== */}

        {outfit && (

          <section
            className="resultado-outfit"
            id="resultado-outfit"
          >

            <div className="resultado-etiqueta">
              ✧ OUTFIT CREADO PARA VOS
            </div>


            <h2>
              {
                outfit.titulo
              }
            </h2>


            <p className="resultado-descripcion">

              {
                outfit.descripcion
              }

            </p>


            <div className="resultado-prendas">

              {outfit.prendas?.map(
                (prenda) => (

                  <article
                    className="resultado-prenda-card"
                    key={
                      `${prenda.origen}-${prenda.id}`
                    }
                  >

                    <div className="resultado-imagen">

                      {prenda.imagen ? (

                        <img
                          src={
                            prenda.imagen
                          }
                          alt={
                            prenda.nombre
                          }
                        />

                      ) : (

                        <div className="resultado-sin-foto">
                          ♡
                        </div>

                      )}

                    </div>


                    <div className="resultado-info">

                      <span
                        className={
                          prenda.origen ===
                          "armario"
                            ? "ai-origen armario"
                            : "ai-origen catalogo"
                        }
                      >

                        {prenda.origen ===
                        "armario"
                          ? "♡ De tu armario"
                          : "✧ Inspiración"
                        }

                      </span>


                      <h3>
                        {
                          prenda.nombre
                        }
                      </h3>


                      {prenda.color && (
                        <p>{prenda.color}</p>
                      )}

                    </div>

                  </article>

                )
              )}

            </div>


            {outfit.razon && (
              <div className="resultado-explicacion">
                <span>✧</span>
                <p>{outfit.razon}</p>
              </div>
            )}


            <div className="resultado-acciones">

              <button
                type="button"
                className="resultado-boton-secundario"
                onClick={() => {
                  setOutfit(null);
                  window.scrollTo({top: 0, behavior: "smooth"});
                }}
              >
                ← Cambiar pedido
              </button>


              <button
                type="button"
                className="resultado-boton-principal"
                onClick={generarOtro}
                disabled={generando}
              >
                ↻ Generar otro outfit
              </button>

            </div>

          </section>

        )}

      </main>


      <Footer/>


    </div>

  );

}

export default AIOutfit;