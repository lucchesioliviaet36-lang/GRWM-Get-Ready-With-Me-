import './perfil_propio.css'
import logo from '../../assets/imagenes/logo.png'

function PerfilPropio() {
  return (
    <div className="pagina-perfil">

      {/* BARRA SUPERIOR */}
      <header className="barra-superior">

        <div className="logo">
          ✧ <span>GRWM</span>
        </div>

        <div className="buscador">
          🔍
          <span>Buscar outfits, marcas, tendencias...</span>
        </div>

        <nav className="menu">
          <span>Comunidad</span>
          <span>Tienda</span>
          <span>Soporte</span>
          <div className="mini-avatar">E</div>
        </nav>

      </header>


      {/* CONTENIDO */}
      <main className="contenido">

        {/* PORTADA + PERFIL */}
        <section className="tarjeta-perfil">

          <div className="portada">
            {/* Acá después pondremos la imagen de portada */}
          </div>

          <div className="datos-perfil">

            <div className="avatar">
              E
            </div>

            <div className="nombre-y-descripcion">
              <h1>Elena Gómez</h1>
              <p className="usuario">@elenag_style</p>

              <p className="descripcion">
                Amante de la moda urbana. Vendiendo joyas de
                <br />
                mi clóset vintage 🧥👠
              </p>
            </div>

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

          <article className="post">
            <div className="foto-post foto-1">
              <span>Foto</span>
            </div>

            <div className="pie-post">
              <span>♡ 189</span>
              <strong>€75</strong>
            </div>
          </article>


          <article className="post">
            <div className="foto-post foto-2">
              <span>Foto</span>
            </div>

            <div className="pie-post">
              <span>♡ 245</span>
            </div>
          </article>


          <article className="post">
            <div className="foto-post foto-3">
              <span>Foto</span>
            </div>

            <div className="pie-post">
              <span>♡ 98</span>
              <strong>€95</strong>
            </div>
          </article>


          <article className="post">
            <div className="foto-post foto-4">
              <span>Foto</span>
            </div>

            <div className="pie-post">
              <span>♡ 150</span>
            </div>
          </article>

        </section>

      </main>

    </div>
  )
}

export default PerfilPropio