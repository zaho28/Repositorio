import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebarmov from "../../components/Sidebarmov";
import HeaderMovimientos from "../../components/HeaderMovimientos";
import "../../components/admin.css";

const API_URL = 'http://localhost:3001/api';

export default function Movimientos(){
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos'); // 'todos', 'entradas', 'salidas'
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarMovimientos();
    }, []);

    const cargarMovimientos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/movimientos`);
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error al cargar movimientos:', error);
            alert('Error al cargar los movimientos');
        } finally {
            setLoading(false);
        }
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const movimientosFiltrados = movimientos.filter(mov => {
        const coincideFiltro = filtro === 'todos' || 
            (filtro === 'entradas' && mov.id_m === 'M-E') ||
            (filtro === 'salidas' && mov.id_m === 'M-S');
        
        const coincideBusqueda = busqueda === '' ||
            mov.nom_producto?.toLowerCase().includes(busqueda.toLowerCase()) ||
            mov.id_usuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
            mov.nombre_usuario?.toLowerCase().includes(busqueda.toLowerCase());

        return coincideFiltro && coincideBusqueda;
    });

    return(
        <div className="dashboard-layout">
            <Sidebarmov />
            <main className="contenido">
                <HeaderMovimientos />

                <section className="cuadro-blanco movimientos-principal">
                    <h2>Registre todas sus entradas y salidas aquí</h2>

                    {/* Tarjetas de acceso rápido */}
                    <div className="contenedor-movimientos">
                        <div className="tarjeta">
                            <div className="texto">
                                Entradas 
                            </div>
                            <Link to="/entradas" className="btn-agregar">
                                +
                            </Link>
                        </div>

                        <div className="tarjeta">
                            <div className="texto">
                                Salidas
                            </div>
                            <Link to="/salidas" className="btn-agregar">
                                +
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Historial de Movimientos */}
                <section className="cuadro-blanco" style={{ marginTop: '30px' }}>
                    <h2 style={{ 
                        marginBottom: '20px',
                        borderBottom: '3px solid #c5749d',
                        paddingBottom: '10px'
                    }}>
                        Historial de Movimientos
                    </h2>

                    {/* Controles de filtro */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        marginBottom: '25px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="Buscar por producto o usuario..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="buscar"
                            style={{
                                flex: 1,
                                minWidth: '250px',
                                padding: '12px 15px',
                                borderRadius: '8px',
                                border: '2px solid #e0e0e0',
                                fontSize: '14px'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setFiltro('todos')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: filtro === 'todos' ? '#c5749d' : '#e0e0e0',
                                    color: filtro === 'todos' ? 'white' : '#333',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFiltro('entradas')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: filtro === 'entradas' ? '#28a745' : '#e0e0e0',
                                    color: filtro === 'entradas' ? 'white' : '#333',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Entradas
                            </button>
                            <button
                                onClick={() => setFiltro('salidas')}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: filtro === 'salidas' ? '#dc3545' : '#e0e0e0',
                                    color: filtro === 'salidas' ? 'white' : '#333',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Salidas
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Cargando movimientos...</p>
                        </div>
                    ) : (
                        <>
                            <p style={{ 
                                marginBottom: '15px', 
                                color: '#666',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Mostrando <strong style={{ color: '#c5749d' }}>{movimientosFiltrados.length}</strong> de <strong>{movimientos.length}</strong> movimientos
                            </p>

                            {/* Tabla de movimientos */}
                            <div style={{ overflowX: 'auto' }}>
                                <table className="tabla">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tipo</th>
                                            <th>Fecha y Hora</th>
                                            <th>Producto</th>
                                            <th>Imagen</th>
                                            <th>Cantidad</th>
                                            <th>Usuario</th>
                                            <th>Rol</th>
                                            <th>Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimientosFiltrados.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                                                    {movimientos.length === 0 
                                                        ? "No hay movimientos registrados todavía" 
                                                        : "No se encontraron movimientos con los filtros seleccionados"
                                                    }
                                                </td>
                                            </tr>
                                        ) : (
                                            movimientosFiltrados.map((mov) => (
                                                <tr key={mov.id_movimiento}>
                                                    <td>
                                                        <strong style={{ color: '#666' }}>
                                                            #{mov.id_movimiento}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            padding: '6px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold',
                                                            backgroundColor: mov.id_m === 'M-E' ? '#28a745' : '#dc3545',
                                                            color: 'white',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '5px'
                                                        }}>
                                                            {mov.id_m === 'M-E' ? 'Entrada' : 'Salida'}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontSize: '0.9em', whiteSpace: 'nowrap' }}>
                                                        {formatFecha(mov.fecha_m)}
                                                    </td>
                                                    <td>
                                                        <strong style={{ color: '#333' }}>
                                                            {mov.nom_producto}
                                                        </strong>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {mov.ruta_imagen ? (
                                                            <img 
                                                                src={`http://localhost:3001${mov.ruta_imagen}`}
                                                                alt={mov.nom_producto}
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px',
                                                                    border: '2px solid #e0e0e0'
                                                                }}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/60x60?text=N/A';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{
                                                                width: '60px',
                                                                height: '60px',
                                                                backgroundColor: '#f0f0f0',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                margin: '0 auto'
                                                            }}>
                                                                <span style={{ 
                                                                    color: '#999', 
                                                                    fontSize: '10px' 
                                                                }}>
                                                                    Sin img
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            padding: '8px 12px',
                                                            background: mov.id_m === 'M-E' 
                                                                ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                                                                : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                                                            borderRadius: '8px',
                                                            fontWeight: 'bold',
                                                            fontSize: '16px',
                                                            color: mov.id_m === 'M-E' ? '#2e7d32' : '#c62828',
                                                            display: 'inline-block'
                                                        }}>
                                                            {mov.Cantidad_m}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div style={{ 
                                                                fontWeight: '600',
                                                                color: '#333',
                                                                marginBottom: '3px'
                                                            }}>
                                                                {mov.nombre_usuario}
                                                            </div>
                                                            <div style={{ 
                                                                fontSize: '0.85em',
                                                                color: '#999'
                                                            }}>
                                                                ID: {mov.id_usuario}
                                                            </div>
                                                            {/* Mostrar el origen del movimiento */}
                                                            <div style={{
                                                                fontSize: '0.75em',
                                                                marginTop: '4px',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                display: 'inline-block',
                                                                backgroundColor: mov.origen_movimiento === 'Venta Online' ? '#e3f2fd' : '#fff3e0',
                                                                color: mov.origen_movimiento === 'Venta Online' ? '#1565c0' : '#e65100'
                                                            }}>
                                                                {mov.origen_movimiento === 'Venta Online' ? 'Venta Online' : 'Manual'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            padding: '5px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            backgroundColor: mov.nombre_rol === 'Administrador' 
                                                                ? '#e3f2fd' 
                                                                : '#f3e5f5',
                                                            color: mov.nombre_rol === 'Administrador' 
                                                                ? '#1976d2' 
                                                                : '#7b1fa2'
                                                        }}>
                                                            {mov.nombre_rol === 'Administrador' ? '1' : '2'} {mov.nombre_rol}
                                                        </span>
                                                    </td>
                                                    <td style={{ 
                                                        maxWidth: '200px',
                                                        fontSize: '0.9em',
                                                        color: '#666'
                                                    }}>
                                                        {mov.observaciones || (
                                                            <span style={{ color: '#ccc', fontStyle: 'italic' }}>
                                                                Sin observaciones
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}