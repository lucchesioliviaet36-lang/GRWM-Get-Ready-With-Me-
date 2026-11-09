import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./administrador.css";

const API_URL = "http://localhost:3000";

function Administrador() {
  const navigate = useNavigate();
  const [resultadoIntegridad, setResultadoIntegridad] = useState(null);
  const [bitacora, setBitacora] = useState([]);
  const [dvv, setDvv] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const obtenerHeaders = () => {
    const token = localStorage.getItem("token");
    return {Authorization: `Bearer ${token}`};
  };

  // VERIFICAR INTEGRIDAD
  const verificarIntegridad = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/api/admin/integridad`, {
        headers: obtenerHeaders()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "No se pudo verificar la integridad");
      }

      setResultadoIntegridad(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  // OBTENER BITACORA
  const obtenerBitacora = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/api/admin/bitacora`, {
        headers: obtenerHeaders()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "No se pudo obtener la bitácora");
      }

      setBitacora(datos.bitacora || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  // OBTENER DVV
  const obtenerDVV = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/api/admin/dvv`, {
        headers: obtenerHeaders()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || "No se pudieron obtener los DVV");
      }

      setDvv(datos.dvv || []);
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
      <header className="admin-header">
        <div>
          <span>✧ GRWM</span>
          <h1>Panel de Administración</h1>
        </div>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </header>

      <main className="admin-contenido">
        <section className="admin-acciones">
          <button onClick={verificarIntegridad}>Verificar integridad</button>
          <button onClick={obtenerBitacora}>Ver bitácora</button>
          <button onClick={obtenerDVV}>Ver dígitos verificadores</button>
          <button disabled>Generar backup</button>
        </section>

        {cargando && <p>Procesando...</p>}
        {error && <div className="admin-error">{error}</div>}

        {resultadoIntegridad && (
          <section className="admin-panel">
            <h2>Integridad de la base de datos</h2>
            <p>{resultadoIntegridad.valido ? "✓ La base de datos es íntegra" : "⚠ Se encontraron errores"}</p>

            {resultadoIntegridad.tablas?.map((tabla) => (
              <div key={tabla.tabla} className="admin-integridad-item">
                <strong>{tabla.tabla}</strong>
                <span>{tabla.valido ? "Correcta" : "Con errores"}</span>
                {tabla.errores?.map((error, index) => (
                  <p key={index}>{error.error} {error.id ? `- ID ${error.id}` : ""}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        {bitacora.length > 0 && (
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

        {dvv.length > 0 && (
          <section className="admin-panel">
            <h2>Dígitos verificadores</h2>
            {dvv.map((registro) => (
              <div key={registro.id_dvv} className="admin-dvv-item">
                <strong>{registro.nombre_tabla}</strong>
                <span>{registro.DVH}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Administrador;