import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./administrador.css";

const API_URL = "http://localhost:3000";

function Administrador() {
  console.log("EL PANEL DE ADMINISTRACIÓN SE ESTÁ MOSTRANDO");
  const navigate = useNavigate();
  const [integridad, setIntegridad] = useState(null);
  const [bitacora, setBitacora] = useState([]);
  const [dvv, setDvv] = useState([]);
  const [seccion, setSeccion] = useState("inicio");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  //PARA LOS PERMISOS
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [patentes, setPatentes] = useState([]);
  const [usuariosRoles, setUsuariosRoles] = useState([]);
  const [rolesPatentes, setRolesPatentes] = useState([]);
  const [restricciones, setRestricciones] = useState([]);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [patenteSeleccionada, setPatenteSeleccionada] = useState("");
  const [diasRestriccion, setDiasRestriccion] = useState(1);

  const headers = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };


  const cargarGestionPermisos = async () => {
    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`${API_URL}/api/permisos/gestion`, {
        headers: headers()
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudieron cargar los permisos");
      }

      setUsuarios(datos.usuarios || []);
      setRoles(datos.roles || []);
      setPatentes(datos.patentes || []);
      setUsuariosRoles(datos.usuariosRoles || []);
      setRolesPatentes(datos.rolesPatentes || []);
      setRestricciones(datos.restricciones || []);

      setSeccion("permisos");

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const ejecutarAccionPermisos = async (url, metodo, cuerpo = null) => {
    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`${API_URL}/api/permisos${url}`, {
        method: metodo,
        headers: {
          ...headers(),
          "Content-Type": "application/json"
        },
        ...(cuerpo ? { body: JSON.stringify(cuerpo) } : {})
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo realizar la operación");
      }

      setMensaje(datos.mensaje || "Operación realizada correctamente");
      await cargarGestionPermisos();

    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  const asignarRolUsuario = () => {
    if (!usuarioSeleccionado || !rolSeleccionado) {
      setError("Seleccioná un usuario y un rol.");
      return;
    }

    ejecutarAccionPermisos("/usuarios/roles", "POST", {
      id_usuario: Number(usuarioSeleccionado),
      id_rol: Number(rolSeleccionado)
    });
  };

  const quitarRolUsuario = (id) => {
    ejecutarAccionPermisos(`/usuarios/roles/${id}`, "DELETE");
  };

  const asignarPatenteRol = (id_rol, id_patente) => {
    ejecutarAccionPermisos("/roles/patentes", "POST", {
      id_rol,
      id_patente
    });
  };

  const quitarPatenteRol = (id) => {
    ejecutarAccionPermisos(`/roles/patentes/${id}`, "DELETE");
  };

  const aplicarRestriccion = () => {
    if (!usuarioSeleccionado || !patenteSeleccionada || Number(diasRestriccion) <= 0) {
      setError("Completá el usuario, la patente y los días.");
      return;
    }

    ejecutarAccionPermisos(
      `/usuarios/${usuarioSeleccionado}/restricciones`,
      "POST",
      {
        id_patente: Number(patenteSeleccionada),
        dias: Number(diasRestriccion)
      }
    );
  };

  const quitarRestriccion = (id) => {
    ejecutarAccionPermisos(`/restricciones/${id}`, "PATCH");
  };

  const inicializarIntegridad = async () => {
    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`${API_URL}/api/admin/integridad/inicializar`,
        {
          method: "POST",
          headers: headers()
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.message || "No se pudo inicializar la integridad"
        );
      }

      setMensaje(
        "Integridad inicializada correctamente"
      );

      await verificarIntegridad();

    } catch (error) {
      setError(error.message);

    } finally {
      setCargando(false);
    }
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

  const generarBackup = async () => {
    try {
      setCargando(true);
      setError("");
      setMensaje("");

      const respuesta = await fetch(`${API_URL}/api/admin/backup`, {
        method: "POST",
        headers: headers()
      });

      if (!respuesta.ok) {
        let datos = {};
        try {
          datos = await respuesta.json();
        } catch {
          datos = {};
        }

        throw new Error(datos.message || "No se pudo generar el backup");
      }

      const archivo = await respuesta.blob();
      const url = window.URL.createObjectURL(archivo);
      const enlace = document.createElement("a");
      const fecha = new Date().toISOString().slice(0, 10);

      enlace.href = url;
      enlace.download = `backup-grwm-${fecha}.sql`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      window.URL.revokeObjectURL(url);

      setMensaje("Backup generado correctamente");

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
          <button onClick={cargarGestionPermisos}>Gestión de permisos</button>
        </nav>

        <button className="admin-cerrar-sesion" onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>

      <main className="admin-contenido">

        <div className="admin-header">
          <div>
            <span className="admin-subtitulo">ADMINISTRACIÓN</span>
            <h1>Panel de Administración</h1>
          </div>

          <button
            className="admin-volver-inicio"
            onClick={() => navigate("/paginaPrincipal")}
          >
            ← Ir a GRWM
          </button>
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

            <div className="integridad-acciones">

              <button type="button" className="boton-admin-principal"
                onClick={inicializarIntegridad} disabled={cargando}
              >
                {cargando
                  ? "Inicializando..."
                  : "Inicializar integridad"}
              </button>

              <p> Usar solamente para establecer la integridad inicial de la base de datos. </p>

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
                      <td>{new Date(registro.fecha).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}</td>
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
          <section className="admin-panel backup-panel">
            <div className="backup-icono">↧</div>

            <h2>Backup de la base de datos</h2>

            <p className="backup-descripcion">
              Generá una copia de seguridad completa de la base de datos GRWM.
              El archivo se descargará en formato SQL.
            </p>

            <div className="backup-info">
              <div>
                <span>Formato</span>
                <strong>.SQL</strong>
              </div>

              <div>
                <span>Base de datos</span>
                <strong>GRWM</strong>
              </div>

              <div>
                <span>Contenido</span>
                <strong>Backup completo</strong>
              </div>
            </div>

            <button
              className="boton-admin-principal"
              onClick={generarBackup}
              disabled={cargando}
            >
              {cargando ? "Generando backup..." : "Generar backup"}
            </button>

            {mensaje && <div className="backup-exito">✓ {mensaje}</div>}
          </section>

          
        )}


        {seccion === "permisos" && (
          <section className="admin-panel gestion-permisos">
            <h2>Gestión de permisos</h2>
            <p>Administrá los roles y las acciones disponibles en GRWM.</p>

            {mensaje && <div className="backup-exito">{mensaje}</div>}

            <div className="gestion-bloque">
              <h3>Asignar roles a usuarios</h3>

              <label>Usuario</label>
              <select
                value={usuarioSeleccionado}
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre} {usuario.apellido} (@{usuario.username})
                  </option>
                ))}
              </select>

              <label>Rol</label>
              <select
                value={rolSeleccionado}
                onChange={(e) => setRolSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>

              <button onClick={asignarRolUsuario} disabled={cargando}>
                Asignar rol
              </button>

              <h4>Roles asignados</h4>

              {usuariosRoles.map((asignacion) => {
                const usuario = usuarios.find(
                  (u) => Number(u.id_usuario) === Number(asignacion.id_usuario)
                );
                const rol = roles.find(
                  (r) => Number(r.id_rol) === Number(asignacion.id_rol)
                );

                return (
                  <div className="gestion-fila" key={asignacion.id_usuario_rol}>
                    <span>
                      {usuario?.username || `Usuario ${asignacion.id_usuario}`}
                      {" — "}
                      {rol?.nombre_rol || `Rol ${asignacion.id_rol}`}
                    </span>

                    <button
                      onClick={() => quitarRolUsuario(asignacion.id_usuario_rol)}
                      disabled={cargando || rol?.nombre_rol === "administrador"}
                    >
                      Quitar
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="gestion-bloque">
              <h3>Permisos por rol</h3>

              {roles.map((rol) => {
                const asignaciones = rolesPatentes.filter(
                  (rp) => Number(rp.id_rol) === Number(rol.id_rol)
                );

                return (
                  <div key={rol.id_rol} className="gestion-rol">
                    <h4>{rol.nombre_rol}</h4>

                    {patentes.map((patente) => {
                      const asignacion = asignaciones.find(
                        (rp) => Number(rp.id_patente) === Number(patente.id_patente)
                      );

                      return (
                        <div className="gestion-fila" key={patente.id_patente}>
                          <span>{patente.nombre_patente}</span>

                          {asignacion ? (
                            <button
                              onClick={() => quitarPatenteRol(asignacion.id_rol_patente)}
                              disabled={cargando || rol.nombre_rol === "administrador"}
                            >
                              Quitar permiso
                            </button>
                          ) : (
                            <button
                              onClick={() => asignarPatenteRol(rol.id_rol, patente.id_patente)}
                              disabled={cargando}
                            >
                              Asignar permiso
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="gestion-bloque">
              <h3>Restringir acciones de usuarios</h3>

              <label>Patente</label>
              <select
                value={patenteSeleccionada}
                onChange={(e) => setPatenteSeleccionada(e.target.value)}
              >
                <option value="">Seleccionar acción</option>
                {patentes.map((patente) => (
                  <option key={patente.id_patente} value={patente.id_patente}>
                    {patente.nombre_patente}
                  </option>
                ))}
              </select>

              <label>Duración en días</label>
              <input
                type="number"
                min="1"
                value={diasRestriccion}
                onChange={(e) => setDiasRestriccion(e.target.value)}
              />

              <button onClick={aplicarRestriccion} disabled={cargando}>
                Aplicar restricción
              </button>

              <h4>Restricciones registradas</h4>

              {restricciones.map((restriccion) => {
                const usuario = usuarios.find(
                  (u) => Number(u.id_usuario) === Number(restriccion.id_usuario)
                );
                const patente = patentes.find(
                  (p) => Number(p.id_patente) === Number(restriccion.id_patente)
                );

                return (
                  <div className="gestion-fila" key={restriccion.id_usuario_patente}>
                    <span>
                      {usuario?.username || `Usuario ${restriccion.id_usuario}`}
                      {" — "}
                      {patente?.nombre_patente || `Patente ${restriccion.id_patente}`}
                      {" — "}
                      Vence: {restriccion.fecha_vencimiento
                        ? new Date(restriccion.fecha_vencimiento).toLocaleDateString("es-AR")
                        : "Sin fecha"}
                      {" — "}
                      {restriccion.estado ? "Inactiva" : "Activa"}
                    </span>

                    {!restriccion.estado && (
                      <button
                        onClick={() => quitarRestriccion(restriccion.id_usuario_patente)}
                        disabled={cargando}
                      >
                        Levantar restricción
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default Administrador;