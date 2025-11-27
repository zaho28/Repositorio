import React from "react";
import perfil from '../assets/icono_usuario.png';
import './HeaderPanel_A.css';


export default function HeaderPedidos() {
    return(
        <header className="header-panel">
            <h1>Pedidos Realizados</h1>
            <div className="usuario">
                <a href="/perfil_admi"> 
                    <span>Admin.Gurama</span>
                    <img src={perfil} alt="perfil" />
                </a>
            </div>
        </header>
    );
}