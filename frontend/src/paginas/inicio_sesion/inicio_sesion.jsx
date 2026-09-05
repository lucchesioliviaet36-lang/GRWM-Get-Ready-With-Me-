import { useState } from "react";
import "./inicio_sesion.css";

import FotoFondo from "../../assets/imagenes/fondoInicioSesion.jpg";

function InicioSesion() {

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [flipped, setFlipped] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (usuario.trim() === "" || password.trim() === "") {
            setError("Complete todos los campos");
            return;
        }

        console.log("Usuario:", usuario);
        console.log("Password:", password);

        alert("Formulario enviado correctamente!");
    };


    return (
        <div className="InicioSesion-Page" style={{ backgroundImage: `url(${FotoFondo})` }}>
            <div className={`flip-card ${flipped ? "flipped" : ""}`}>
                <div className="flip-card-inner">

                    <div className="flip-card-front">

                        <div className="InicioSesion-Header">
                            <h1>GRWM</h1>
                            <p>Get Ready With Me</p>
                        </div>

                        <div className="InicioSesion-Title">
                            <h2>Iniciar Sesión</h2>
                            <p>Ingresá a una cuenta ya existente</p>
                        </div>


                        <form onSubmit={handleSubmit}  className="InicioSesion-Formulario">
                            <div className="form-group">
                                <label htmlFor="usuario">
                                    Usuario o email
                                </label>
                                <input
                                    id="usuario"
                                    type="text"
                                    placeholder="Ingresá tu nombre de usuario o email"
                                    value={usuario}
                                    onChange={(e) =>
                                        setUsuario(e.target.value)
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

                            {error && (
                                <div className="Error-IniciarS">
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="InicioSesion" >
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="Olvidar-Password">
                            <button type="button"  onClick={() =>
                                console.log("Recuperar password")
                                }
                            >¿Olvidaste tu Password?
                            </button>
                        </div>

                        <div className="Opcion-Registro">
                            <span>
                                ¿No tenés una cuenta?
                            </span>

                            <button  type="button"  className="registro" onClick={() => setFlipped(true)}
                            > Registrarse
                            </button>
                        </div>
                    </div>

                    <div className="flip-card-back">
                        <div className="Registro-Header">
                            <h1>GRWM</h1>
                            <p>Get Ready With Me</p>
                        </div>

                        <div className="Registro-Title">
                            <h2>Registrarse</h2>
                            <p>Creá una nueva cuenta</p>
                        </div>

                        <form className="Registro-Formulario">

                            <div className="form-group">
                                <label htmlFor="registroUsuario">
                                    Nombre de usuario
                                </label>

                                <input
                                    id="registroUsuario"
                                    type="text"
                                    placeholder="Ingresá tu nombre de usuario"
                                />
                            </div>

                            <div className="form-group">

                                <label htmlFor="registroEmail">
                                    Email
                                </label>

                                <input
                                    id="registroEmail"
                                    type="email"
                                    placeholder="Ingresá tu email"
                                />
                            </div>

                            <div className="form-group">

                                <label htmlFor="registroPassword">
                                    Password
                                </label>

                                <input
                                    id="registroPassword"
                                    type="password"
                                    placeholder="Ingresá tu password"
                                />

                            </div>

                            <div className="form-group">
                                <input
                                    id="repetirPassword"
                                    type="password"
                                    placeholder="Repetí tu password"
                                />
                            </div>

                            <button type="submit" className="Registro-Boton"
                            > Registrarse
                            </button>
                        </form>

                        <div className="Opcion-InicioSesion">

                            <span>
                                ¿Ya tenés una cuenta?
                            </span>

                            <button type="button"  className="volver-login"  onClick={() => setFlipped(false)}
                            > Iniciar Sesión
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default InicioSesion;