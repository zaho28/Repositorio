import React, { useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext.jsx";

import Headerlog from "../components/Header_log";
import "../components/general.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(correo, contrasena);

    if (result.success) {
      navigate("/cliente");
    } 
    else if (result.needs_code) {
      navigate("/admin-code");
    } 
    else {
      alert(result.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <>
      <Headerlog /> 

      <main>
        <form onSubmit={handleSubmit}>
          <div className="subtitulo">
            <h2>Iniciar sesión</h2>
          </div>

          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <button type="submit">Ingresar</button>

          <div className="preguntas">
            <p>
              <Link to="/registro">¿No tienes cuenta?</Link>
            </p>
            <p>
              <Link to="/cambiar_contraseña1">¿Olvidaste tu contraseña?</Link>
            </p>
          </div>
        </form>
      </main>
    </>
  );
}