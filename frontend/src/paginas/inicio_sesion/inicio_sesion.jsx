import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import "./inicio_sesion.css";

import FotoFondo from '../../assets/imagenes/fondoInicioSesion.jpg'

function InicioSesion() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [flipped, setFlipped] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (usuario.trim() === "" || password.trim() === ""){
            setError("Complete todos los campos");
            return;
        }

        console.log("Usuario: ", usuario);
        console.log("Password: ", password);

        alert("Formulario enviado correctamente!");

    };

    const irARegistro = () => {
    setFlipped(true);

     setTimeout(() => {
       navigate("/registro");
      }, 800);
    };
    

    return(
        <div className="InicioSesion-Page" style={{backgroundImage: `url(${FotoFondo})`}}>
            <div className={`InicioSesion-Container ${flipped ? "flipped" : ""}`}>

                <div className="InicioSesion-Header">
                    <h1>GRWM</h1>
                    <p>Get Ready With Me</p>
                </div>

                <div className="InicioSesion-Title">
                    <h2>Iniciar Sesion</h2>
                    <p>Ingresar a una Cuenta ya existente</p>
                </div>

                <form onSubmit={handleSubmit} className="InicioSesion-Formulario">

                    <div className="form-group">
                        <label htmlFor="usuario">
                            Usuario o email
                        </label>
                            <input 
                                id="Usuario"
                                type="text"
                                placeholder="Ingresa tu nombre de usuario o email"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>
                        <input 
                            id="password"
                            type="password"
                            placeholder="Ingrese su password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button type="submit" className="InicioSesion">
                        Iniciar Sesion
                    </button>

                </form>

                <div className="Olvidar-Password">
                        <button type="button" onClick={() => {
                            console.log("Recuperar password")
                        }}>
                            Olvidaste tu Password?
                        </button>
                </div>

                    {error && (
                        <div className="Error-IniciarS">
                            {error}
                        </div>
                    )}

                <div className="Opcion-Registro">
                    <button type="button" className="registro" onClick={irARegistro}>
                        <p>Registrarse</p>
                    </button>
                </div>

                 
            </div>
        </div>
    );
}

export default InicioSesion;