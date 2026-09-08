import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaPrincipal from './paginas/pagina_principal/pagina_principal';
import PerfilPropio from './paginas/perfil_propio/perfil_propio'
import Publicacion1 from './paginas/publicacion1/publicacion1'
import Publicacion2 from './paginas/publicacion2/publicacion2'
import Publicacion3 from './paginas/publicacion3/publicacion3'
import Publicacion4 from './paginas/publicacion4/publicacion4'
import InicioSesion from './paginas/inicio_sesion/inicio_sesion'
import Registro from './paginas/registro/registro'
import MiTienda from './paginas/miTienda/miTienda'
import TiendaPrincipal from './paginas/tienda_principal/tienda_principal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/IniciarSesion" element={<InicioSesion />} /> 
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil_propio" element={<PerfilPropio />} />
        <Route path="/miTienda" element={<MiTienda />} />
        <Route path="/paginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/publicacion1" element={<Publicacion1 />} />
        <Route path="/publicacion2" element={<Publicacion2 />} />
        <Route path="/publicacion3" element={<Publicacion3 />} />
        <Route path="/publicacion4" element={<Publicacion4 />} />
        <Route path="/tienda_principal" element={<TiendaPrincipal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App