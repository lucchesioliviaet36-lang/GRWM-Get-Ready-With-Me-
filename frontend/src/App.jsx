import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./paginas/pagina_principal/pagina_principal";
import PerfilPropio from "./paginas/perfil_propio/perfil_propio";
import Publicacion1 from "./paginas/publicacion1/publicacion1";
import Publicacion2 from "./paginas/publicacion2/publicacion2";
import Publicacion3 from "./paginas/publicacion3/publicacion3";
import Publicacion4 from "./paginas/publicacion4/publicacion4";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pagina_principal" element={<Feed />} />
        <Route path="/perfil_propio" element={<PerfilPropio />} />

        <Route path="/" element={<PerfilPropio />} />
        <Route path="/publicacion1" element={<Publicacion1 />} />
        <Route path="/publicacion2" element={<Publicacion2 />} />
        <Route path="/publicacion3" element={<Publicacion3 />} />
        <Route path="/publicacion4" element={<Publicacion4 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App