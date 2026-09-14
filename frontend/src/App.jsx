import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaPrincipal from './paginas/pagina_principal/pagina_principal'
import PerfilPropio from './paginas/perfil_propio/perfil_propio'
import Publicacion from './paginas/publicacion/publicacion'
import InicioSesion from './paginas/inicio_sesion/inicio_sesion'
import Registro from './paginas/registro/registro'
import MiTienda from './paginas/miTienda/miTienda'
import TiendaPrincipal from './paginas/tienda_principal/tienda_principal'
import Busqueda from './paginas/busqueda/busqueda'
import EditarPerfil from './paginas/editar_perfil/editar_perfil'
import Chat from './paginas/chat/chat'
import MiArmario from './paginas/miArmario/miArmario'
import AgregarPrenda from './paginas/agregar_prenda/agregar_prenda'
import Pago from './paginas/pago/pago'
import ChatIA from './paginas/inspiracion_chat/inspiracion_chat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/IniciarSesion" element={<InicioSesion />} /> 
        <Route path="/" element={<Registro />} />
        <Route path="/perfil_propio" element={<PerfilPropio />} />
        <Route path="/editar_perfil" element={<EditarPerfil />} />
        <Route path="/miTienda" element={<MiTienda />} />
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/publicacion/:id" element={<Publicacion />} />
        <Route path="/tienda_principal" element={<TiendaPrincipal />} />
        <Route path="/busqueda" element={<Busqueda />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/miArmario" element={<MiArmario />} />
        <Route path="/agregar_prenda" element={<AgregarPrenda />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/inspiracion_chat" element={<ChatIA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App