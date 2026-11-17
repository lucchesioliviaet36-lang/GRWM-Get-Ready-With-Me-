import { Navigate } from "react-router-dom";

function RutaProtegida({ rol, children }) {
    const token = localStorage.getItem("token");
    let usuario = {};

    try {
        usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    } catch {
        usuario = {};
    }

    if (!token) {
        return <Navigate to="/IniciarSesion" replace />;
    }

    // Obtener los roles del usuario
    const rolesUsuario = usuario.roles || [];

    const nombresRoles = rolesUsuario.map((item) => {
        if (typeof item === "string") {
            return item.toLowerCase();
        }

        return (
            item.nombre_rol ||
            item.nombre ||
            item.rol ||
            ""
        ).toLowerCase();
    });

    // También contemplar el rol principal
    if (usuario.rol) {
        nombresRoles.push(usuario.rol.toLowerCase());
    }

    console.log("ROL QUE EXIGE LA RUTA:", rol);
    console.log("ROLES DEL USUARIO:", nombresRoles);
    console.log("¿ES ADMIN?:", nombresRoles.includes("administrador"));

    if (rol && !nombresRoles.includes(rol.toLowerCase())) {
        return <Navigate to="/paginaPrincipal" replace />;
    }

    return children;
}

export default RutaProtegida;