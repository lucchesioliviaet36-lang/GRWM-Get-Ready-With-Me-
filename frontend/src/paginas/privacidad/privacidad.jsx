import { useNavigate } from "react-router-dom";
import "./privacidad.css";

const Privacidad = () => {
  const navigate = useNavigate();

  return (
    <div className="pagina-privacidad">
      <div className="privacidad-contenedor">

        <div className="privacidad-encabezado">
          <span className="privacidad-etiqueta">
            GRWM · GET READY WITH ME
          </span>

          <h1>Política de Privacidad</h1>

          <p>
            Tu privacidad es importante para nosotros.
            Conocé cómo GRWM utiliza y protege tu información.
          </p>

          <span className="privacidad-fecha">
            Última actualización: 16 de noviembre de 2026
          </span>
        </div>

        <div className="privacidad-contenido">

          <section>
            <h2>01. Introducción</h2>
            <p>
              En GRWM nos importa la privacidad de nuestra comunidad.
              Esta Política de Privacidad explica qué información se
              utiliza dentro de la plataforma, para qué se utiliza y
              cómo se busca protegerla.
            </p>
          </section>

          <section>
            <h2>02. Información que recopilamos</h2>
            <p>
              Para crear una cuenta y utilizar las funcionalidades de
              GRWM, se solicitan diferentes datos, entre ellos:
            </p>
            <ul>
              <li>Nombre y apellido.</li>
              <li>Nombre de usuario.</li>
              <li>Correo electrónico.</li>
              <li>Contraseña.</li>
              <li>Fotografía de perfil y portada.</li>
              <li>Biografía y descripción del perfil.</li>
            </ul>
            <p>
              También se almacena información relacionada con las
              publicaciones, prendas, productos y actividades
              realizadas dentro de la aplicación.
            </p>
          </section>

          <section>
            <h2>03. Fotografías y contenido compartido</h2>
            <p>
              GRWM permite cargar fotografías de prendas y accesorios
              para organizar el guardarropa, generar outfits y compartir
              contenido con otros usuarios.
            </p>
            <p>
              Las fotografías, publicaciones, historias, descripciones
              y productos que compartís forman parte del contenido
              utilizado por las distintas funcionalidades de la
              plataforma.
            </p>
            <p>
              Antes de publicar, recomendamos revisar que las imágenes
              y los textos no incluyan información personal que no
              quieras compartir.
            </p>
          </section>

          <section>
            <h2>04. Uso de la información</h2>
            <p>
              La información recopilada se utiliza para permitir el
              funcionamiento de GRWM y ofrecer sus diferentes
              funcionalidades, como:
            </p>
            <ul>
              <li>Crear y administrar cuentas de usuario.</li>
              <li>Mostrar y actualizar perfiles.</li>
              <li>Guardar prendas y accesorios en el armario.</li>
              <li>Generar recomendaciones de outfits.</li>
              <li>Mostrar publicaciones, historias y sugerencias.</li>
              <li>Permitir comentarios, likes y favoritos.</li>
              <li>Facilitar la compra y venta de productos.</li>
              <li>Permitir la comunicación entre usuarios mediante el chat.</li>
            </ul>
          </section>

          <section>
            <h2>05. Visibilidad de la información</h2>
            <p>
              GRWM cuenta con funciones sociales que permiten
              interactuar con otros usuarios.
            </p>
            <p>
              La información del perfil, las publicaciones, las
              historias y los productos compartidos pueden ser
              visualizados por otros integrantes de la plataforma,
              según las funcionalidades disponibles.
            </p>
            <p>
              Por eso, es importante tener cuidado con los datos
              personales que decidís incluir en tu perfil o en
              el contenido que publicás.
            </p>
          </section>

          <section>
            <h2>06. Mensajes privados</h2>
            <p>
              La aplicación permite que los usuarios se comuniquen
              mediante un chat privado.
            </p>
            <p>
              Cada usuario es responsable del contenido que envía
              a través de esta función. Se recomienda no compartir
              contraseñas, información bancaria ni otros datos
              personales sensibles.
            </p>
          </section>

          <section>
            <h2>07. Compras y pagos</h2>
            <p>
              GRWM cuenta con una tienda donde los usuarios pueden
              comprar y vender prendas y accesorios.
            </p>
            <p>
              Para gestionar estas operaciones, el sistema contempla
              información relacionada con los productos, pedidos,
              métodos de pago, montos y transacciones.
            </p>
            <p>
              Los pagos se realizan mediante los métodos disponibles
              en la plataforma. El proceso contempla la intervención
              de un sistema de pago externo.
            </p>
          </section>

          <section>
            <h2>08. Seguridad de la información</h2>
            <p>
              GRWM contempla diferentes mecanismos para proteger
              la información almacenada y evitar modificaciones
              no autorizadas.
            </p>
            <ul>
              <li>
                Las contraseñas se almacenan mediante el método
                SHA-256, según el diseño del proyecto.
              </li>
              <li>
                Se utilizan Dígitos Verificadores Horizontales
                (DVH) y Verticales (DVV) para controlar la
                integridad de los datos.
              </li>
              <li>
                Se aplican permisos de acceso según el usuario
                y su rol.
              </li>
              <li>
                Se registra la actividad del sistema mediante
                una bitácora.
              </li>
              <li>
                Se contempla la generación de copias de seguridad
                de la base de datos.
              </li>
            </ul>
          </section>

          <section>
            <h2>09. Modificación de datos personales</h2>
            <p>
              Los usuarios pueden modificar determinados datos
              de su perfil desde la opción de edición, como el
              nombre, apellido, nombre de usuario, correo
              electrónico, fotografía, portada y biografía.
            </p>
          </section>

          <section>
            <h2>10. Eliminación de la cuenta</h2>
            <p>
              GRWM contempla la posibilidad de que los usuarios
              eliminen su cuenta.
            </p>
            <p>
              Si deseás solicitar la eliminación de tu cuenta
              o realizar una consulta relacionada con tus datos
              personales, podés comunicarte con el equipo de
              soporte de GRWM.
            </p>
          </section>

          <section>
            <h2>11. Actualizaciones de esta política</h2>
            <p>
              Esta Política de Privacidad puede actualizarse
              cuando se incorporen nuevas funcionalidades
              o se realicen modificaciones en la plataforma.
            </p>
            <p>
              Se recomienda consultar esta sección periódicamente
              para conocer las condiciones vigentes.
            </p>
          </section>

          <section>
            <h2>12. Contacto</h2>
            <p>
              Si tenés dudas o consultas sobre el uso de tus
              datos personales, podés comunicarte con el equipo
              de GRWM a través de nuestro correo de contacto:
            </p>
            <p className="privacidad-contacto">
              flores.miaet36@gmail.com
            </p>
          </section>

        </div>

        <div className="privacidad-pie">
          <span>GRWM</span>

          <p>
            Tu estilo, tu comunidad y tu privacidad.
          </p>

          <button
            className="boton-volver-privacidad"
            onClick={() => navigate("/paginaPrincipal")}
          >
            ← Volver a la página principal
          </button>
        </div>

      </div>
    </div>
  );
};

export default Privacidad;