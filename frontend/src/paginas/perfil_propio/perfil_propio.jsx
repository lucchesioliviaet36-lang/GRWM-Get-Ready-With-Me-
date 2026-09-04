import './perfil_propio.css'

import bannerFotoDePerfilPropio from '../../assets/imagenes/bannerFotoDePerfilPropio.jpg'
import fotoPerfilPropio from '../../assets/imagenes/fotoDePerfilPropio.jpg'
import fotoPropia1 from '../../assets/imagenes/fotoPropia1.jpg'
import fotoPropia2 from '../../assets/imagenes/fotoPropia2.jpg'
import fotoPropia3 from '../../assets/imagenes/fotoPropia3.jpg'
import fotoPropia4 from '../../assets/imagenes/fotoPropia4.jpg'


function PerfilPropio() {
  return (
    <div className="pagina-perfil">

      {/* BARRA SUPERIOR */}
      <header className="barra-superior">

        <div className="logo">
          ✧ <span>GRWM</span>
        </div>
        
        <div className="buscador">
          <span className="icono-busqueda">🔍︎</span>

          <input
            type="text"
            placeholder="Buscar outfits, marcas, tendencias..."
          />
        </div>

        <nav className="menu">
          <button>Comunidad</button>
          <button>Tienda</button>
          <button>Soporte</button>

          <div className="mini-avatar">
            <img src={fotoPerfilPropio} alt="Foto de perfil" />
          </div>
        </nav>

      </header>


      {/* CONTENIDO */}
      <main className="contenido">

        {/* PORTADA + PERFIL */}
        <section className="tarjeta-perfil">

          {/* PORTADA */}
          <div
            className="portada"
            style={{
              backgroundImage: `url(${bannerFotoDePerfilPropio})`
            }}
          >
          </div>


          {/* INFORMACIÓN DEL PERFIL */}
          <div className="datos-perfil">

            {/* FOTO DE PERFIL */}
            <div className="avatar">
              <img
                src={fotoPerfilPropio}
                alt="Avatar de Elena Gómez"
              />
            </div>


            {/* NOMBRE Y DESCRIPCIÓN */}
            <div className="nombre-y-descripcion">

              <h1>Taylor Swift</h1>

              <p className="usuario">
                @taylor_swift13
              </p>

              <p className="descripcion">
                Cantante, compositora y amante de la moda -`𖹭´-
                <br />
                Compartiendo looks de cada era ♬⋆.˚
              </p>

            </div>


            {/* ESTADÍSTICAS Y BOTONES */}
            <div className="estadisticas">

              <div>
                <strong>24</strong>
                <span>Publicaciones</span>
              </div>

              <div>
                <strong>1.8k</strong>
                <span>Seguidores</span>
              </div>

              <div>
                <strong>352</strong>
                <span>Siguiendo</span>
              </div>

              <div className="botones">

                <button className="btn-editar">
                  Editar Perfil
                </button>

                <button className="btn-tienda">
                  Mi Tienda
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* PESTAÑAS */}
        <div className="pestanas">

          <button className="activa">
            Publicaciones
          </button>

          <button>
            Ventas
          </button>

          <button>
            Guardados
          </button>

        </div>


        {/* PUBLICACIONES */}
        <section className="grid-publicaciones">

          {/* PUBLICACIÓN 1 */}
          <button className="post" type="button">

            <div className="foto-post">
              <img
                src={fotoPropia1}
                alt="Publicación de Taylor"
              />
            </div>

            <div className="pie-post">
              <span>♡ 189</span>
              <strong>$75</strong>
            </div>

          </button>


          {/* PUBLICACIÓN 2 */}
          <button className="post" type="button">

            <div className="foto-post">
              <img
                src={fotoPropia2}
                alt="Publicación de Taylor"
              />
            </div>

            <div className="pie-post">
              <span>♡ 245</span>
            </div>

          </button>


          {/* PUBLICACIÓN 3 */}
          <button className="post" type="button">

            <div className="foto-post">
              <img
                src={fotoPropia3}
                alt="Publicación de Taylor"
              />
            </div>

            <div className="pie-post">
              <span>♡ 98</span>
              <strong>$95</strong>
            </div>

          </button>


          {/* PUBLICACIÓN 4 */}
          <button className="post" type="button">

            <div className="foto-post">
              <img
                src={fotoPropia4}
                alt="Publicación de Taylor"
              />
            </div>

            <div className="pie-post">
              <span>♡ 150</span>
            </div>

          </button>

        </section>

      </main>

    </div>
  )
}

export default PerfilPropio