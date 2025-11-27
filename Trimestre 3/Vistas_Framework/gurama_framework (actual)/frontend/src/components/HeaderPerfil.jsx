// src/components/HeaderPerfil.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo_GO.jpeg'; 
// importación de estilos globales o específicos del header

export default function HeaderPerfil() {
    return (
        <header>
            {/* NOTA: La ruta de la imagen debe ser accesible desde tu configuración de React */}
            <Link to="/"> 
                <img src={logo} alt="Logo Gurama Online" />            
            </Link>
            
            {/* Usamos <Link> para la navegación hacia el panel principal */}
            <Link to="/panel_control">
                <button className="registrarse">Volver</button>
            </Link>
        </header>
    );
}