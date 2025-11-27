import React from "react";
import perfil from '../assets/icono_usuario.png';
import './HeaderPanel_A.css';
 

export default function HeaderPanel() {
    return(
        <header className="header-panel">
            <h1>Panel de control</h1>
            <div className="usuario">
                <a href="/perfil_admin"> 
                    <span>Admin.Gurama</span>
                    <img src={perfil} alt="perfil" />
                </a>
            </div>
        </header> 
    );
}