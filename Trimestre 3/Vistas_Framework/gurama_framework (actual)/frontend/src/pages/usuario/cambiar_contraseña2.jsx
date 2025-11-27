import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Añadí useNavigate si planeas redirigir

import Header_c from "../../components/Header_c"; 
import "../../components/general.css";

export default function PerfilFormSinSidebar() {
    // Definición de la función handleGuardarClick
    // Usamos e.preventDefault() para evitar que el formulario recargue la página.
    const handleGuardarClick = (e) => {
        e.preventDefault(); 
        console.log('Intento de cambio de contraseña...');
        // Aquí iría tu lógica de actualización de contraseña y redirección
    };

    return (  
        <main className="contenido">
            <Header_c />

            {/* Añado un contenedor para la tarjeta (form-card) y centrado */}
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