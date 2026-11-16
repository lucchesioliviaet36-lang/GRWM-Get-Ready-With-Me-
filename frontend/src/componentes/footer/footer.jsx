import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./footer.css"


function Footer() {
    const navigate = useNavigate();
    
    return (
      <footer className="footer">
        <div>© 2026 GRWM. Todos los derechos reservados.</div>
        <div className="footer-links">
          <button onClick={() => navigate("/privacidad")}>Privacidad</button>
          <button onClick={() => navigate("/terminosYcondiciones")}>Términos y Condiciones</button>
        </div>
      </footer>
    );
}
export default Footer;
      