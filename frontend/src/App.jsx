import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaPrincipal from './paginas/pagina_principal/pagina_principal'
import PerfilPropio from './paginas/perfil_propio/perfil_propio'
import Publicacion from './paginas/publicacion/publicacion'
import InicioSesion from './paginas/inicio_sesion/inicio_sesion'
import RecuperarContrasena from './paginas/recuperarContrasena/RecuperarContrasena'
import RestablecerContrasena from './paginas/RestablecerContrasena/RestablecerContrasena'
import Registro from './paginas/registro/registro'
import MiTienda from './paginas/miTienda/miTienda'
import TiendaPrincipal from './paginas/tienda_principal/tienda_principal'
import Busqueda from './paginas/busqueda/busqueda'
import EditarPerfil from './paginas/editar_perfil/editar_perfil'
import Chat from './paginas/chat/chat'
import MiArmario from './paginas/miArmario/miArmario'
import AgregarPrenda from './paginas/agregar_prenda/agregar_prenda'
import Pago from './paginas/pago/pago'
import CalificarProducto from './paginas/calificarProducto/calificarProducto'
import HistorialCompras from './paginas/HistorialCompras/HistorialCompras'
import DetallePedido from './paginas/detallePedido/detallePedido'
import PerfilUsuario from './paginas/perfil_usuario/perfil_usuario'
import AIOutfit from './paginas/iaOutfit/iaOutfit'
import Administrador from './paginas/administrador/administrador'
import RutaProtegida from './componentes/rutaProtegida/rutaProtegida'
import {CrearHistoria} from './paginas/crear_historia/crear_historia';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/administrador" element={<RutaProtegida rol="administrador"> <Administrador /></RutaProtegida>}/>
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />}/>
        <Route path="/IniciarSesion" element={<InicioSesion />} /> 
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />}/>
        <Route path="/restablecer-contrasena/:token" element={<RestablecerContrasena />}/>
        <Route path="/" element={<Registro />} />
        <Route path="/perfil_propio" element={<PerfilPropio />} />
        <Route path="/perfil_usuario/" element={<PerfilUsuario />} />
        <Route path="/perfil_usuario/:id" element={<PerfilUsuario />} />
        <Route path="/editar_perfil" element={<EditarPerfil />} />
        <Route path="/miTienda" element={<MiTienda />} />
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/publicacion/:id" element={<Publicacion />} />
        <Route path="/tienda_principal" element={<TiendaPrincipal />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/miArmario" element={<MiArmario />} />
        <Route path="/agregar_prenda" element={<AgregarPrenda />} />
        <Route path="/pago/:id" element={<Pago />}/>
        <Route path="/calificar/:idPedido" element={<CalificarProducto />}/>
        <Route path="/historial-compras" element={<HistorialCompras />}/>
        <Route path="/pedido/:idPedido" element={<DetallePedido />}/>
        <Route path="/iaOutfit" element={<AIOutfit />} />
        <Route path="/crear_historia" element={<CrearHistoria />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App
