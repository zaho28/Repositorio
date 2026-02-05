// src/components/HeaderPerfil.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo_GO.jpeg'; 
// importación de estilos globales o específicos del header

export default function HeaderPerfil() {
    return (
        <header>
            <Link to="/cliente"> 
                <img src={logo} alt="Logo Gurama Online" />            
            </Link>
            
            {/* Usamos <Link> para la navegación hacia el panel principal */}
            <Link to="/perfil">
                <button className="registrarse">Volver</button>
            </Link>
        </header>
    );
}