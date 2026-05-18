import { useState, useContext, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../components/general.css";
import Headerreg from "../components/Header_reg";

export default function LoginAdminCode() {
  const [codigo, setCodigo] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { verifyAdminCode, pendingUser, currentUser } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {    
  e.preventDefault();
  setErrorMessage(null);

      if (!pendingUser) {
      setErrorMessage("Error: No hay sesión de administrador pendiente. Vuelva a iniciar sesión.");
      return;
    }

    const result = await verifyAdminCode(codigo.trim());

    if (result.success) {
      navigate("/panel_control"); 
    } else {
      setErrorMessage(result.message || "Error al verificar el código.");
    }
  };

  const volver = () => {
    sessionStorage.removeItem('pendingUser');
    navigate("/login");
  };

  useEffect(() => {
    // Si ya tiene una sesión activa (currentUser existe)
    if (currentUser) {
      navigate("/panel_control"); 
    }
    // Si no hay un usuario pendiente (llegó aquí por error)
    if (!pendingUser) {
      console.log("No hay pendingUser, redirigiendo a login");
      navigate("/login"); 
    } else {
      console.log("PendingUser encontrado:", pendingUser);
      console.log("ID Usuario:", pendingUser.id_usuario);
    }
  }, [currentUser, pendingUser, navigate]);

  if (!pendingUser && !currentUser) {
      return null; 
  }

  return (
    <>
      <Headerreg /> 

        <main> 
            <div className="contenedor">
              <div className="formulario_inicio">
                <h2>Iniciar sesión</h2>
                  {errorMessage && (
                    <div className="alerta error" style={{marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e53e3e', backgroundColor: '#fef2f2', color: '#c53030'}}>
                        {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <p>
                      Está ingresando como administrador, para continuar ingrese su código
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
        </main>
      </>
  );
}