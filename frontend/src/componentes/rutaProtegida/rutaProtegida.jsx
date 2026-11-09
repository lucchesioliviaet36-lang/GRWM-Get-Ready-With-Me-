import { Navigate } from "react-router-dom";

function RutaProtegida({rol, children}) {
  const token = localStorage.getItem("token");
  let usuario = {};

  try {
    usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  } catch {
    usuario = {};
  }

  if (!token) return <Navigate to="/IniciarSesion" replace />;

  if (rol && usuario.rol !== rol) {
    return <Navigate to={usuario.rol === "administrador" ? "/administrador" : "/paginaPrincipal"} replace />;
  }

  return children;
}

export default RutaProtegida;