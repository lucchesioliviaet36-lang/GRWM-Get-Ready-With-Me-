import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import "./registro.css";



function Registro() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    
    
}

export default Registro;