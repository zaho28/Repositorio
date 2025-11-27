 import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginAdminCode() {
  const [codigo, setCodigo] = useState("");
  const { verifyAdminCode } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = verifyAdminCode(codigo.trim());

    if (result.success) {
      navigate("/panel_control"); // ahora sí te dejará entrar
    } else {
      alert(result.message);
    }
  };

  const volver = () => {
    navigate("/login");
  };

  return (
    <div>
      <header>
        <img src="/imagenes/Gurama_Logo.jpeg" alt="Logo del sitio" />

        <Link to="/registrarse">
          <button>Registrarse</button>
        </Link>
      </header>

      <div className="contenedor">
        <div className="formulario_inicio">
          <h2>Iniciar sesión</h2>

          <form onSubmit={handleSubmit}>
            <p>
              Estás ingresando como administrador, para continuar ingresa tu código
            </p>

            <label htmlFor="codigo">Código de administrador</label>
            <input
              type="password"
              id="codigo"
              name="codigo"
              placeholder="Ingresa tu código de administrador"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />

            <button type="submit">Ingresar</button>
            <button type="button" onClick={volver}>Volver</button>
          </form>
        </div>
      </div>
    </div>
  );
}