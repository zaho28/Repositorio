import React from 'react';
import { Link } from 'react-router-dom';

//imagenes
import logo from '../assets/Logo_GO.jpeg';

import './header.css';

const Headeri = () => {

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/"> 
                        <img src={logo} alt="Logo Gurama Online" />            
                    </Link>
                </div>

            <nav className="menu">
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/registro">Registrarse</Link></li>
                    <li><Link to="/login">iniciar sesion </Link></li>
                </ul>
            </nav>
            </div>
        </header>
    );
};

export default Headeri;