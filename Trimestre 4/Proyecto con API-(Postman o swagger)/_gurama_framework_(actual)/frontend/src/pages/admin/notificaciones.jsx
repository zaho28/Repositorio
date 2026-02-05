import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";

const API_URL = "http://localhost:3001/api/notificaciones";

export default function Notificaciones() {
    const navigate = useNavigate();
    const [notificaciones, setNotificaciones] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [filtro, setFiltro] = useState('todas'); // 'todas', 'stock-bajo', 'agotado', 'pedidos'
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar notificaciones
    useEffect(() => {
        cargarNotificaciones();
        cargarEstadisticas();
        
        // Actualizar cada 30 segundos
        const interval = setInterval(() => {
            cargarNotificaciones();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const cargarNotificaciones = async () => {
        try {
            setCargando(true);
            const response = await axios.get(API_URL);
            setNotificaciones(response.data);
            setError(null);
        } catch (err) {
            console.error("Error al cargar notificaciones:", err);
            setError("No se pudieron cargar las notificaciones");
        } finally {
            setCargando(false);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const response = await axios.get(`${API_URL}/estadisticas`);
            setEstadisticas(response.data);
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
        }
    };

    // Filtrar notificaciones
    const notificacionesFiltradas = notificaciones.filter(notif => {
        if (filtro === 'todas') return true;
        if (filtro === 'stock-bajo') return notif.tipo === 'stock-bajo';
        if (filtro === 'agotado') return notif.tipo === 'agotado';
        if (filtro === 'pedidos') return notif.tipo === 'pedido';
        return true;
    });

    // Función para formatear fecha
    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const ahora = new Date();
        const diffMs = ahora - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        
        return date.toLocaleDateString('es-CO', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    // Función para obtener el texto del botón
    const getTextoBoton = (tipo) => {
        if (tipo === 'stock-bajo' || tipo === 'agotado') {
            return 'Ir a movimientos';
        }
        return 'Ir a pedidos';
    };

    // Función para obtener el estilo del badge según el tipo
    const getBadgeStyle = (tipo) => {
        switch (tipo) {
            case 'stock-bajo':
                return {
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    icon: '',
                    label: 'Stock Bajo'
                };
            case 'agotado':
                return {
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    icon: '',
                    label: 'Agotado'
                };
            case 'pedido':
                return {
                    backgroundColor: '#d1ecf1',
                    color: 'rgba(12, 84, 96, 1)',
                    icon: '',
                    label: 'Pedido'
                };
            default:
                return {
                    backgroundColor: '#e2e3e5',
                    color: '#383d41',
                    icon: '',
                    label: 'Info'
                };
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="contenido">
                <HeaderPanel />

                <section className="pedidos cuadro-blanco">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px' 
                    }}>
                        <div>
                            <h2>Notificaciones</h2>
                            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
                                Alertas de stock bajo, productos agotados y nuevos pedidos
                            </p>
                        </div>
                        
                        <button
                            onClick={cargarNotificaciones}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Actualizar
                        </button>
                    </div>

                    {/* Estadísticas rápidas */}
                    {estadisticas && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px',
                            marginBottom: '25px'
                        }}>
                            <div style={{
                                padding: '15px',
                                backgroundColor: '#fff3cd',
                                borderRadius: '8px',
                                borderLeft: '4px solid #ffc107'
                            }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#856404' }}>
                                    Stock Bajo
                                </h4>
                                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
                                    {estadisticas.productos_stock_bajo}
                                </p>
                            </div>

                            <div style={{
                                padding: '15px',
                                backgroundColor: '#f8d7da',
                                borderRadius: '8px',
                                borderLeft: '4px solid #dc3545'
                            }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#721c24' }}>
                                    Agotados
                                </h4>
                                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>
                                    {estadisticas.productos_agotados}
                                </p>
                            </div>

                            <div style={{
                                padding: '15px',
                                backgroundColor: '#d1ecf1',
                                borderRadius: '8px',
                                borderLeft: '4px solid #17a2b8'
                            }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#0c5460' }}>
                                    Pedidos Hoy
                                </h4>
                                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
                                    {estadisticas.pedidos_hoy}
                                </p>
                            </div>

                            <div style={{
                                padding: '15px',
                                backgroundColor: '#d4edda',
                                borderRadius: '8px',
                                borderLeft: '4px solid #28a745'
                            }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#155724' }}>
                                    Pedidos (7 días)
                                </h4>
                                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
                                    {estadisticas.pedidos_semana}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Filtros */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        marginBottom: '20px',
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '10px',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setFiltro('todas')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filtro === 'todas' ? '#c5749de5' : '#f0f0f0',
                                color: filtro === 'todas' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: filtro === 'todas' ? 'bold' : 'normal'
                            }}
                        >
                            Todas ({notificaciones.length})
                        </button>
                        <button
                            onClick={() => setFiltro('stock-bajo')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filtro === 'stock-bajo' ? '#ffc107' : '#f0f0f0',
                                color: filtro === 'stock-bajo' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: filtro === 'stock-bajo' ? 'bold' : 'normal'
                            }}
                        >
                            Stock Bajo ({notificaciones.filter(n => n.tipo === 'stock-bajo').length})
                        </button>
                        <button
                            onClick={() => setFiltro('agotado')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filtro === 'agotado' ? '#dc3545' : '#f0f0f0',
                                color: filtro === 'agotado' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: filtro === 'agotado' ? 'bold' : 'normal'
                            }}
                        >
                            Agotados ({notificaciones.filter(n => n.tipo === 'agotado').length})
                        </button>
                        <button
                            onClick={() => setFiltro('pedidos')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: filtro === 'pedidos' ? '#17a2b8' : '#f0f0f0',
                                color: filtro === 'pedidos' ? 'white' : '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: filtro === 'pedidos' ? 'bold' : 'normal'
                            }}
                        >
                            Pedidos ({notificaciones.filter(n => n.tipo === 'pedido').length})
                        </button>
                    </div>

                    {/* Tabla de notificaciones */}
                    <section className="notificaciones">
                        {cargando ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>Cargando notificaciones...</p>
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                                <p>{error}</p>
                                <button onClick={cargarNotificaciones}>Reintentar</button>
                            </div>
                        ) : notificacionesFiltradas.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <p style={{ fontSize: '18px', color: '#666' }}>
                                    No hay notificaciones {filtro !== 'todas' ? `de tipo "${filtro}"` : ''}
                                </p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo</th>
                                        <th>Mensaje</th>
                                        <th>Detalles</th>
                                        <th>Fecha</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notificacionesFiltradas.map((notif, index) => {
                                        const badgeStyle = getBadgeStyle(notif.tipo);
                                        
                                        return (
                                            <tr key={notif.id_notificacion}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <span style={{
                                                        padding: '5px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: badgeStyle.backgroundColor,
                                                        color: badgeStyle.color,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}>
                                                        {badgeStyle.icon} {badgeStyle.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>{notif.mensaje}</strong>
                                                </td>
                                                <td className="detalles-con-accion">
                                                    <div className="detalles-texto">
                                                        {notif.detalles}
                                                        <br />
                                                        {notif.stock_actual !== null && notif.stock_actual !== undefined && (
                                                            <small style={{ 
                                                                color: notif.stock_actual === 0 ? '#dc3545' : '#ffc107',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {notif.stock_actual === 0 
                                                                    ? 'SIN STOCK' 
                                                                    : `Stock: ${notif.stock_actual} (Mínimo: ${notif.stock_minimo})`
                                                                }
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <small style={{ color: '#666' }}>
                                                        {formatearFecha(notif.fecha)}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Link to={notif.ruta_destino} className="link-boton">
                                                        <button className={`ir ${notif.clase_boton}`}>
                                                            {getTextoBoton(notif.tipo)}
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
}