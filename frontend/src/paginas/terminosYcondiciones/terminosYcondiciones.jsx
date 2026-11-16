import "./terminosYcondiciones.css";
import { useNavigate } from "react-router-dom";

const TerminosCondiciones = () => {

    const navigate = useNavigate();

  return (
    <div className="pagina-terminos">
      <div className="terminos-contenedor">

        <div className="terminos-encabezado">
          <span className="terminos-etiqueta">GRWM · GET READY WITH ME</span>
          <h1>Términos y Condiciones</h1>
          <p>
            Conocé las condiciones para utilizar nuestra plataforma
            y formar parte de la comunidad GRWM.
          </p>
          <span className="terminos-fecha">
            Última actualización: 16 de noviembre de 2026
          </span>
        </div>

        <div className="terminos-contenido">

          <section>
            <h2>01. Aceptación de los términos</h2>
            <p>
              Al registrarte y utilizar GRWM, aceptás estos Términos
              y Condiciones. Si no estás de acuerdo con ellos,
              deberás abstenerte de utilizar la plataforma.
            </p>
          </section>

          <section>
            <h2>02. ¿Qué es GRWM?</h2>
            <p>
              GRWM es una plataforma digital dedicada a la moda,
              la vestimenta y el estilo personal. Permite a los
              usuarios compartir contenido, descubrir tendencias
              e interactuar con otros integrantes de la comunidad.
            </p>
            <ul>
              <li>Crear y administrar perfiles.</li>
              <li>Publicar fotografías e historias.</li>
              <li>Seguir a otros usuarios.</li>
              <li>Dar Me gusta y comentar publicaciones.</li>
              <li>Guardar publicaciones favoritas.</li>
              <li>Enviar mensajes privados.</li>
              <li>Comprar y vender prendas en la tienda.</li>
            </ul>
          </section>

          <section>
            <h2>03. Registro y cuentas</h2>
            <p>
              Para utilizar determinadas funcionalidades es necesario
              crear una cuenta y proporcionar información válida.
              Cada usuario es responsable de mantener la
              confidencialidad de su contraseña y de la actividad
              realizada desde su cuenta.
            </p>
          </section>

          <section>
            <h2>04. Publicaciones y contenido</h2>
            <p>
              Los usuarios son responsables del contenido que
              comparten en GRWM. Deben contar con los derechos
              o permisos necesarios para publicar fotografías,
              textos y cualquier otro material.
            </p>
            <p>No está permitido compartir contenido que:</p>
            <ul>
              <li>Vulnere los derechos de otras personas.</li>
              <li>Contenga acoso, amenazas o discriminación.</li>
              <li>Utilice información privada sin autorización.</li>
              <li>Infrinja las normas de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2>05. Interacción entre usuarios</h2>
            <p>
              Las funciones de seguimiento, comentarios, Me gusta
              e historias deben utilizarse de manera respetuosa.
              No se permite acosar a otros usuarios, enviar spam
              ni utilizar estas herramientas para perjudicar
              a integrantes de la comunidad.
            </p>
          </section>

          <section>
            <h2>06. Historias y mensajes privados</h2>
            <p>
              Las historias son publicaciones temporales.
              Los mensajes privados permiten comunicarse con
              otros usuarios. Cada persona es responsable de
              los mensajes y archivos que envía.
            </p>
            <p>
              Se recomienda no compartir contraseñas, datos
              bancarios ni información personal sensible.
            </p>
          </section>

          <section>
            <h2>07. Tienda y compras</h2>
            <p>
              GRWM permite explorar productos publicados por
              otros usuarios. Los vendedores son responsables
              de la información, las imágenes y las descripciones
              de los productos que ofrecen.
            </p>
            <p>
              Los compradores deben revisar las características
              del producto antes de realizar una operación.
              Las funcionalidades de saldo y compra deben
              utilizarse respetando las condiciones de la plataforma.
            </p>
          </section>

          <section>
            <h2>08. Uso adecuado de GRWM</h2>
            <p>Está prohibido:</p>
            <ul>
              <li>Suplantar la identidad de otra persona.</li>
              <li>Intentar acceder a cuentas ajenas.</li>
              <li>Realizar actividades ilegales.</li>
              <li>Alterar o perjudicar el funcionamiento del sitio.</li>
              <li>Utilizar la plataforma para engañar a otros usuarios.</li>
            </ul>
          </section>

          <section>
            <h2>09. Privacidad y datos personales</h2>
            <p>
              GRWM utiliza los datos proporcionados por los usuarios
              para permitir el funcionamiento de sus servicios.
              La información personal debe tratarse de acuerdo
              con la Política de Privacidad y la normativa aplicable.
            </p>
          </section>

          <section>
            <h2>10. Disponibilidad del servicio</h2>
            <p>
              GRWM procura mantener la plataforma disponible.
              Sin embargo, pueden existir interrupciones por
              mantenimiento, actualizaciones o inconvenientes
              técnicos.
            </p>
          </section>

          <section>
            <h2>11. Modificaciones</h2>
            <p>
              GRWM podrá actualizar estos términos cuando sea
              necesario. Las modificaciones serán comunicadas
              a través de la plataforma.
            </p>
          </section>

          <section>
            <h2>12. Suspensión y eliminación de cuentas</h2>
            <p>
              Las cuentas que incumplan estos términos podrán
              ser restringidas o suspendidas. Los usuarios
              podrán solicitar la eliminación de su cuenta
              mediante los canales de contacto disponibles.
            </p>
          </section>

          <section>
            <h2>13. Contacto</h2>
            <p>
              Si tenés consultas sobre estos términos,
              podés comunicarte con el equipo de GRWM
              mediante nuestro correo de contacto:
            </p>
            <p className="terminos-contacto">
              flores.miaet36@gmail.com
            </p>
          </section>

        </div>

        <div className="terminos-pie">
          <span>GRWM</span>
          <p>Compartí tu estilo, descubrí tendencias y conectá.</p>
          <button
            className="boton-volver"
            onClick={() => navigate("/paginaPrincipal")}
            >
            ← Volver a la página principal
            </button>
        </div>

      </div>
    </div>
  );
};

export default TerminosCondiciones;