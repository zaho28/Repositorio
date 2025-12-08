import React from 'react';
import { Link } from 'react-router-dom';

//imagenes
import logo from '../assets/Logo_GO.jpeg';

const Headerreg = () => {

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
                    <li><Link to="/">Volver</Link></li>
                    <li><Link to="/login">iniciar sesión </Link></li>
                </ul>
            </nav>
            </div>
        </header>
    );
};

export default Headerreg;