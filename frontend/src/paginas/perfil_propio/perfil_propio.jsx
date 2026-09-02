import './perfil_propio.css'

function PerfilPropio() {
  return (
    <div className="perfil">

      <header className="perfil-header">
        <h1>GRWM</h1>

        <nav>
          <span>Inicio</span>
          <span>Buscar</span>
          <span>Chat</span>
          <span>Mi perfil</span>
        </nav>
      </header>

      <main>

        <section className="portada">
          <div className="foto-perfil">
            <span>👤</span>
          </div>
        </section>

        <section className="informacion-perfil">

          <div className="nombre-perfil">
            <h2>Mi nombre</h2>
            <p>@miusuario</p>
          </div>

          <button className="boton-editar">
            Editar perfil
          </button>

          <p className="descripcion">
            ✨ Mi perfil de GRWM ✨
            <br />
            Moda, outfits y mis looks favoritos.
          </p>

          <div className="estadisticas">
            <div>
              <strong>12</strong>
              <span>Publicaciones</span>
            </div>

            <div>
              <strong>150</strong>
              <span>Seguidores</span>
            </div>

            <div>
              <strong>120</strong>
              <span>Siguiendo</span>
            </div>
          </div>

        </section>

        <div className="pestanas">
          <button>Publicaciones</button>
          <button>Guardados</button>
        </div>

        <section className="publicaciones">
          <div className="publicacion">Foto 1</div>
          <div className="publicacion">Foto 2</div>
          <div className="publicacion">Foto 3</div>
          <div className="publicacion">Foto 4</div>
          <div className="publicacion">Foto 5</div>
          <div className="publicacion">Foto 6</div>
        </section>

      </main>

    </div>
  )
}

export default PerfilPropio