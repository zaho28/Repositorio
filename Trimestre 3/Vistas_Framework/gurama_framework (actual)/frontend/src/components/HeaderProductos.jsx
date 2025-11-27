// src/components/HeaderProductos.jsx
import React from 'react';
import perfil from '../assets/icono_usuario.png';
import './HeaderPanel_A.css';

const HeaderProductos = () => {
  return (
    <header className="header-panel">
      <h1>Productos</h1>
        <div className="usuario">
           <a href="/perfil_admin"> 
              <span>Admin.Gurama</span>
              <img src={perfil} alt="perfil" />
          </a>
        </div>
    </header> 
  );
};

export default HeaderProductos; 