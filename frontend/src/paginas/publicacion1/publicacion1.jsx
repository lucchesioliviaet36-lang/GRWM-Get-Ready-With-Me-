import { useNavigate } from 'react-router-dom'
import './publicacion1.css'

import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'

function Publicacion1() {

  const navigate = useNavigate()

  return (
    <div className="pagina-publicacion">

      {/* BARRA SUPERIOR */}
      <header className="barra-superior-publicacion">

        <button
          className="logo-publicacion"
          type="button"
          onClick={() => navigate('/')}
        >
          ✧ <span>GRWM</span>
        </button>

        <div className="buscador-publicacion">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar outfits, marcas, tendencias..."
          />
        </div>

        <nav className="menu-publicacion">
          <button>Comunidad</button>
          <button>Tienda</button>
          <button>Soporte</button>

          <div className="mini-avatar-publicacion">
            <img
              src={fotoPerfilPropio}
              alt="Foto de perfil"
            />
          </div>
        </nav>

      </header>


      {/* CONTENIDO */}
      <main className="contenido-publicacion">

        {/* VOLVER */}
        <button
          className="volver"
          type="button"
          onClick={() => navigate('/')}
        >
          ← Volver a mi perfil
        </button>


        {/* PUBLICACIÓN */}
        <section className="publicacion-card">

          {/* PARTE IZQUIERDA */}
          <div className="publicacion-foto">

            <img
              src={fotoPropia1}
              alt="Look de Taylor Swift"
            />

          </div>


          {/* PARTE DERECHA */}
          <div className="publicacion-info">

            {/* USUARIO */}
            <div className="usuario-publicacion">

              <div className="avatar-publicacion">
                <img
                  src={fotoPerfilPropio}
                  alt="Foto de perfil"
                />
              </div>

              <div>
                <strong>Taylor Swift</strong>
                <span>@taylor_swift13</span>
              </div>

            </div>


            {/* DESCRIPCIÓN */}
            <div className="descripcion-publicacion">

              <p>
                Taylor Swift
              </p>

              <p>
                Un look casual pero con un toque,
                perfecto para salir y sentirte increíble.
              </p>

              <span className="fecha">
                Hace 2 días
              </span>

            </div>


            {/* INTERACCIONES */}
            <div className="interacciones">

              <div className="iconos-interaccion">
                <button type="button">♡</button>
                <button type="button">♡</button>
                <button type="button">↗</button>
              </div>

              <strong className="cantidad-likes">
                189 Me gusta
              </strong>

            </div>


            {/* PRECIO */}
            <div className="precio-publicacion">
              <span>Disponible para comprar</span>
              <strong>$75</strong>
            </div>


            {/* COMENTARIOS */}
            <div className="comentarios">

              <div className="comentario">
                <strong>@fashionlover</strong>
                <span>Me encanta este look ♡</span>
              </div>

              <div className="comentario">
                <strong>@swiftie13</strong>
                <span>Los colores quedan preciosos!!!</span>
              </div>

            </div>


            {/* AGREGAR COMENTARIO */}
            <div className="agregar-comentario">

              <input
                type="text"
                placeholder="Añade un comentario..."
              />

              <button type="button">
                Publicar
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Publicacion1