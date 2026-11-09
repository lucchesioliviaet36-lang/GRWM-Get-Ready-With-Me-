import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./administrador.css";

const API_URL = "http://localhost:3000";

function Administrador() {
  const navigate = useNavigate();
  const [integridad, setIntegridad] = useState(null);
  const [bitacora, setBitacora] = useState([]);
  const [dvv, setDvv] = useState([]);
  const [seccion, setSeccion] = useState("inicio");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const headers = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const verificarIntegridad = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/api/admin/integridad`, {
        headers: headers()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.message || "No se pudo verificar la integridad");

      setIntegridad(datos);
      setSeccion("integridad");

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarBitacora = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/api/admin/bitacora`, {
        headers: headers()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.message || "No se pudo cargar la bitácora");

      setBitacora(datos.bitacora || []);
      setSeccion("bitacora");

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarDVV = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/api/admin/dvv`, {
        headers: headers()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.message || "No se pudieron cargar los DVV");

      setDvv(datos.dvv || []);
      setSeccion("dvv");

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/IniciarSesion");
  };

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>✧</span>
          <h2>GRWM Admin</h2>
        </div>

        <nav className="admin-menu">
          <button onClick={() => setSeccion("inicio")}>Inicio</button>
          <button onClick={verificarIntegridad}>Integridad BD</button>
          <button onClick={cargarBitacora}>Bitácora</button>
          <button onClick={cargarDVV}>Dígitos verificadores</button>
          <button onClick={() => setSeccion("backup")}>Backup</button>
        </nav>

        <button className="admin-cerrar-sesion" onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>

      <main className="admin-contenido">

        <div className="admin-header">
          <div>
            <span className="admin-subtitulo">ADMINISTRACIÓN</span>
            <h1>Panel de Administración</h1>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {cargando && <p>Cargando...</p>}

        {seccion === "inicio" && (
          <section className="admin-inicio">
            <h2>Bienvenido al panel de administración</h2>
            <p>Desde acá podés controlar la seguridad e integridad del sistema.</p>

            <div className="admin-cards">
              <button className="admin-card" onClick={verificarIntegridad}>
                <span>✓</span>
                <h3>Integridad</h3>
                <p>Verificar DVH y DVV de la base de datos.</p>
              </button>

              <button className="admin-card" onClick={cargarBitacora}>
                <span>☷</span>
                <h3>Bitácora</h3>
                <p>Consultar las acciones realizadas en el sistema.</p>
              </button>

              <button className="admin-card" onClick={cargarDVV}>
                <span>#</span>
                <h3>DVV</h3>
                <p>Consultar los dígitos verificadores verticales.</p>
              </button>

              <button className="admin-card" onClick={() => setSeccion("backup")}>
                <span>↧</span>
                <h3>Backup</h3>
                <p>Generar una copia de seguridad de la base de datos.</p>
              </button>
            </div>
          </section>
        )}

        {seccion === "integridad" && integridad && (
          <section className="admin-panel">
            <div className={`estado-integridad ${integridad.valido ? "correcto" : "incorrecto"}`}>
              <h2>{integridad.valido ? "✓ Base de datos íntegra" : "⚠ Se encontraron problemas"}</h2>
            </div>

            <div className="integridad-lista">
              {integridad.tablas?.map((tabla) => (
                <div className="integridad-fila" key={tabla.tabla}>
                  <div className="integridad-info">
                    <div className="integridad-nombre">
                      <span className={`integridad-icono ${tabla.valido ? "ok" : "error"}`}>
                        {tabla.valido ? "✓" : "!"}
                      </span>
                      <div>
                        <h3>{tabla.tabla}</h3>
                        <span className={tabla.valido ? "estado-ok" : "estado-error"}>
                          {tabla.valido ? "Integridad correcta" : "Se encontraron errores"}
                        </span>
                      </div>
                    </div>

                    <div className="integridad-errores">
                      {tabla.valido ? (
                        <span className="integridad-sin-error">No se encontraron problemas</span>
                      ) : (
                        tabla.errores?.map((error, index) => (
                          <div className="integridad-error-item" key={index}>
                            <strong>{error.error}</strong>
                            {error.id && <span>Registro afectado: {error.id}</span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {seccion === "bitacora" && (
          <section className="admin-panel">
            <h2>Bitácora</h2>

            <div className="admin-tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Acción</th>
                    <th>Descripción</th>
                    <th>Tabla</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {bitacora.map((registro) => (
                    <tr key={registro.id_bitacora}>
                      <td>{registro.id_bitacora}</td>
                      <td>{registro.accion}</td>
                      <td>{registro.descripcion}</td>
                      <td>{registro.tabla_afectada}</td>
                      <td>{registro.usuario_afectado}</td>
                      <td>{registro.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {seccion === "dvv" && (
          <section className="admin-panel">
            <h2>Dígitos Verificadores Verticales</h2>

            <div className="dvv-grid">
              {dvv.map((registro) => (
                <div className="dvv-card" key={registro.id_dvv}>
                  <span>{registro.nombre_tabla}</span>
                  <strong>{registro.DVH}</strong>
                  <small>{registro.fecha_actualizacion || "Sin fecha"}</small>
                </div>
              ))}
            </div>
          </section>
        )}

        {seccion === "backup" && (
          <section className="admin-panel">
            <h2>Backup de la base de datos</h2>
            <p>Esta función la conectamos en el siguiente paso.</p>
            <button className="boton-admin-principal" disabled>Generar backup</button>
          </section>
        )}

      </main>
    </div>
  );
}

export default Administrador;