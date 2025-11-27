import React, { useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { AuthContext } from "../context/AuthContext.jsx";

import Headerlog from "../components/Header_log";
import "../components/general.css";

const CambiarContrasenaForm = () => {
    const handleGuardarClick = () => {
        // Ejemplo de lógica de navegación o envío del formulario
        console.log('Cambios guardados. Navegando a iniciar_sesion.html');
        // Si usas React Router, sería algo como: history.push('/iniciar_sesion');
    };

    return (
        <>
        <Headerlog />
            <main>
                <form className="form-cambiar">
                    <div className="subtitulo">
                        <h2>Cambiar contraseña</h2>
                    </div>
                    
                    {/* Nueva Contraseña */}
                    <label htmlFor="nueva">Nueva contraseña</label>
                    <input 
                        type="password" 
                        id="nueva" 
                        name="nueva" // Agregado el atributo name por buena práctica
                        placeholder="Ingresa tu nueva contraseña" 
                    />

                    {/* Confirmar Contraseña */}
                    <label htmlFor="confirmar">Confirmar contraseña</label>
                    <input 
                        type="password" 
                        id="confirmar" 
                        name="confirmar" // Agregado el atributo name
                        placeholder="Confirma tu nueva contraseña" 
                    />

                    {/* Botón Guardar Cambios */}
                    <button 
                        type="submit" // Usar 'submit' si el formulario debe enviarse
                        className="btn-guardarc" // Agregué una clase para estilizar 
                    >
                        Guardar cambios
                    </button>
                </form>
           </main>
        </>
    );
};

export default CambiarContrasenaForm;