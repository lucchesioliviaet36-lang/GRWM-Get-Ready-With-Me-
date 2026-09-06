import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./registro.css";

import FotoFondo from "../../assets/imagenes/fondoInicioSesion.jpg";

function Registro() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repetirPassword, setRepetirPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");

        // Verificar campos vacíos
        if (
            usuario.trim() === "" ||
            email.trim() === "" ||
            password.trim() === "" ||
            repetirPassword.trim() === ""
        ) {
            setError("Complete todos los campos");
            return;
        }

        if (password !== repetirPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        console.log("Usuario:", usuario);
        console.log("Email:", email);
        console.log("Password:", password);

        alert("Registro realizado correctamente!");
    };


    const volverInicioSesion = () => {

        navigate("/");
    };

    return (
        <div className="Registro-Page" style={{ backgroundImage: `url(${FotoFondo})` }}>
            <div className="Registro-Container">
                <div className="Registro-Header">
                    <h1>GRWM</h1>
                    <p>Get Ready With Me</p>
                </div>

                <div className="Registro-Title">
                    <h2>Registrarse</h2>
                    <p>Creá una nueva cuenta</p>
                </div>

                <form onSubmit={handleSubmit} className="Registro-Formulario">

                    <div className="form-group">

                        <label htmlFor="usuario">
                            Nombre de usuario
                        </label>

                        <input
                            id="usuario"
                            type="text"
                            placeholder="Ingresá tu nombre de usuario"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Ingresá tu email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Ingresá tu password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">
                        <input
                            id="repetirPassword"
                            type="password"
                            placeholder="Repetir tu password"
                            value={repetirPassword}
                            onChange={(e) =>
                                setRepetirPassword(e.target.value)
                            }
                        />

                    </div>

                    {error && (

                        <div className="Error-Registro">

                            {error}

                        </div>

                    )}

                    <button type="submit" className="Registro-Boton">
                        Registrarse
                    </button>

                </form>

                <div className="Opcion-InicioSesion">

                    <p>
                        ¿Ya tenés una cuenta?
                    </p>

                    <button type="button" className="volver-login" onClick={volverInicioSesion}>
                        Iniciar Sesión
                    </button>
                </div>

            </div>

        </div>

    );

}

export default Registro;