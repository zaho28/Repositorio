// el Header de cliente con sesion iniciada
import React from 'react';
//imagenes
import logo from '../assets/Logo_GO.jpeg';
import carrito from '../assets/icono_carrito.png'; 
import perfil from '../assets/icono_usuario.png'; 
// Íconos Rosas (Versión Activa)
import carrito_rosa from '../assets/icono_carrito2.png'; 
import perfil_rosa from '../assets/icono_usuario2.png';

    import { Link, useLocation } from 'react-router-dom';

    import './css/header.css';

    const Header = () => {
    const location = useLocation();

    const isCarritoActive = location.pathname.startsWith('/carrito');
    const isPerfilActive = location.pathname.startsWith('/perfil');

    const isPedidosPersonalizadosActive = 
    location.pathname.startsWith('/pedidos_personalizados') ||
    location.pathname.startsWith('/p_sabanas') || 
    location.pathname.startsWith('/p_cubrelecho');

    const isProductosActive = 
    location.pathname.startsWith('/catalogo_c') ||
    location.pathname.startsWith('/producto/');


    return (
        <header className="Header">
        <div className="Header-container">
            <div className="logoG">
            <Link to="/cliente"> 
                <img src={logo} alt="Logo Gurama Online" />            
            </Link>
            </div>

            <nav className="Menu">
            <ul>
                <li>
                    <Link 
                        to="/cliente" 
                        className={location.pathname === '/' || location.pathname === '/cliente' ? 'activo' : ''}
                    >
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/catalogo_c" 
                        className={isProductosActive ? 'activo' : ''}
                    >
                        Catálogo
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/pedidos_personalizados" 
                        className={isPedidosPersonalizadosActive ? 'activo' : ''}
                    >
                        Pedidos personalizados
                    </Link>
                </li>
            </ul>
            </nav>

            <div className="iconos">
                <Link to="/carrito">
                    <img 
                        src={isCarritoActive ? carrito_rosa : carrito}
                        alt="icono carrito" 
                    />
                </Link>
                <Link to="/perfil">
                    <img 
                        src={isPerfilActive ? perfil_rosa : perfil}
                        alt="icono perfil" 
                    />
                </Link>
            </div>
        </div>
    </header>
    );
    };

    export default Header;