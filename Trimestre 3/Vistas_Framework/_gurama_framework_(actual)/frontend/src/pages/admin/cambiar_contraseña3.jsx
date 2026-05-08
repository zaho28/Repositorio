import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPerfil from "../../components/HeaderPerfil";
import "../../components/admin.css";

// Cambié el nombre del componente de 'FormularioProducto' a 'PerfilForm' 
// para ser más consistente con lo que contiene el JSX.
export default function PerfilForm() { 
    return (
        <main className="contenido">
            <HeaderPerfil />

            <div className="perfil-container">
                <form className="form-cambiar">
                    <div className="subtitulo">
                        <h2>Cambiar contraseña</h2>
                    </div>
                    
                    {/* Nueva Contraseña */}
                    <label htmlFor="nueva">Nueva contraseña</label>
                    <input 
                        type="password" 
                        id="nueva" 
                        name="nueva" 
                        placeholder="Ingresa tu nueva contraseña" 
                    />

                    {/* Confirmar Contraseña */}
                    <label htmlFor="confirmar">Confirmar contraseña</label>
                    <input 
                        type="password" 
                        id="confirmar" 
                        name="confirmar" 
                        placeholder="Confirma tu nueva contraseña" 
                    />

                    {/* Botón Guardar Cambios */}
                    <button 
                        type="submit" 
                        className="btn-guardarc" 
                    >
                        Guardar cambios
                    </button>
                </form>
            </div>
        </main>
    );
}
