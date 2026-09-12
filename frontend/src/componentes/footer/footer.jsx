import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./footer.css"


function Footer() {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    
    return (
      <footer className="footer">
        <div>© 2026 GRWM. Todos los derechos reservados.</div>
        <div className="footer-links">
          <button>Privacidad</button>
          <button>Términos de servicio</button>
        </div>
      </footer>
    );
}
export default Footer;
      