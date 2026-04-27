// el Header de cliente con sesion iniciada
import React, { useState, useEffect, useContext } from 'react';
//imagenes
import logo from '../assets/Logo_GO.jpeg';
import carrito from '../assets/icono_carrito.png'; 
import perfil from '../assets/icono_usuario.png'; 
// Íconos Rosas (Versión Activa)
import carrito_rosa from '../assets/icono_carrito2.png'; 
import perfil_rosa from '../assets/icono_usuario2.png';
import notif from '../assets/notif.png';

import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiGet } from '../context/api.js';

import './css/header.css';

const WHATSAPP = 'https://wa.me/573123456789'; // cambiar al número real
const DIRECCION = 'Calle 123 #45-67, Bogotá';

    const Header = () => {
    const location = useLocation();
    
    const { usuarioActual } = useContext(AuthContext);

    const [mostrarNotif, setMostrarNotif] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

    const isCarritoActive = location.pathname.startsWith('/carrito');
    const isPerfilActive = location.pathname.startsWith('/perfil');

    const isPedidosPersonalizadosActive = 
    location.pathname.startsWith('/pedidos_personalizados') ||
    location.pathname.startsWith('/p_sabanas') || 
    location.pathname.startsWith('/p_cubrelecho');

    const isProductosActive = 
    location.pathname.startsWith('/catalogo_c') ||
    location.pathname.startsWith('/producto/');

    // Cargar pedidos del cliente y generar notificaciones
    useEffect(() => {
        const cargarNotificaciones = async () => {
            if (!usuarioActual?.id_usuario) return;
            try {
                const pedidos = await apiGet(`/pedidos/usuario/${usuarioActual.id_usuario}`);
                const data = Array.isArray(pedidos) ? pedidos : pedidos.data || [];
                
                const notifs = [];

                data.forEach(pedido => {
                    notifs.push({
                        id: `confirmacion-${pedido.id_pedido}`,
                        tipo: 'confirmacion',
                        titulo: 'Pedido registrado',
                        mensaje: `Tu pedido #${pedido.id_pedido} fue registrado exitosamente. Pronto lo estaremos preparando.`,
                        fecha: pedido.fecha,
                        leida: false,
                    });

                    // Notificación según estado
                    if (pedido.estado === 'En proceso') {
                        notifs.push({
                            id: `proceso-${pedido.id_pedido}`,
                            tipo: 'proceso',
                            titulo: 'Pedido en proceso',
                            mensaje: `Tu pedido #${pedido.id_pedido} ya está siendo preparado con mucho amor. Te avisaremos cuando esté listo.`,
                            fecha: pedido.fecha,
                            leida: false,
                        });
                    }

                    if (pedido.estado === 'Entregado' || pedido.estado === 'Finalizado') {
                        notifs.push({
                            id: `listo-${pedido.id_pedido}`,
                            tipo: 'listo',
                            titulo: '¡Tu pedido está listo!',
                            mensaje: `Tu pedido #${pedido.id_pedido} está listo para recoger en: ${DIRECCION}. ¡Te esperamos!`,
                            fecha: pedido.fecha,
                            leida: false,
                        });
                    }
                });

                setNotificaciones(notifs);
                setCantidadNoLeidas(notifs.length);
            } catch (error) {
                console.error('Error al cargar notificaciones:', error);
            }
        };

        cargarNotificaciones();
    }, [usuarioActual?.id_usuario]);

    const handleAbrirNotif = () => {
        setMostrarNotif(!mostrarNotif);
        setCantidadNoLeidas(0); // marcar como leídas al abrir
    };

    const getTipoColor = (tipo) => {
        const colores = {
            confirmacion: '#4CAF50',
            proceso: '#2196F3',
            listo: '#E91E63',
        };
        return colores[tipo] || '#999';
    };

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
                <div className="notif-wrapper" onClick={handleAbrirNotif}>
                        <img src={notif} alt="notificaciones" className="notif-icono" />
                        {cantidadNoLeidas > 0 && (
                            <span className="notif-badge">{cantidadNoLeidas}</span>
                        )}
                </div>
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

        {/* VENTANA EMERGENTE DE NOTIFICACIONES */}
            {mostrarNotif && (
                <div className="notif-panel">
                    <div className="notif-panel-header">
                        <h3>Notificaciones</h3>
                        <span className="notif-cerrar" onClick={() => setMostrarNotif(false)}>×</span>
                    </div>

                    <div className="notif-panel-body">
                        {notificaciones.length === 0 ? (
                            <p className="notif-vacia">No tienes notificaciones por ahora.</p>
                        ) : (
                            notificaciones.map(n => (
                                <div key={n.id} className="notif-item" style={{ borderLeft: `4px solid ${getTipoColor(n.tipo)}` }}>
                                    <strong>{n.titulo}</strong>
                                    <p>{n.mensaje}</p>
                                    <a href={WHATSAPP} target="_blank" rel="noreferrer" className="notif-whatsapp">
                                        ¿Tienes preguntas? Escríbenos por WhatsApp
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;