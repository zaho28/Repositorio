import React from "react";
import perfil from '../assets/icono_usuario.png';
import './HeaderPanel_A.css';


export default function HeaderMovimientos() {
    return(
        <header className="header-panel">
            <h1>Movimientos</h1>
            <div className="usuario">
                <a href="/perfil_admi"> 
                    <span>Admin.Gurama</span>
                    <img src={perfil} alt="perfil" />
                </a>
            </div>
        </header>
    );
} 