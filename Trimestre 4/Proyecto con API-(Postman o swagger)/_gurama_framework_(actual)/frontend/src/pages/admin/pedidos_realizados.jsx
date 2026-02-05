import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderPedidos from "../../components/HeaderPedidos";
import "../../components/admin.css";

const API_URL = 'http://localhost:3001/api';

export default function PedidosRealizados() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPedido, setExpandedPedido] = useState(null);
    const [detallesPedido, setDetallesPedido] = useState({});
    const [editandoId, setEditandoId] = useState(null);
    const [nuevoEstadoTemp, setNuevoEstadoTemp] = useState('');

    // Opciones de estado disponibles
    const opcionesEstado = ['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'];

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const response = await axios.get(`${API_URL}/pedidos/todos`);
            setPedidos(response.data);
            console.log('Pedidos cargados:', response.data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            alert('Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const cargarDetallePedido = async (id_pedido) => {
        if (expandedPedido === id_pedido) {
            setExpandedPedido(null);
            return;
        }

        if (detallesPedido[id_pedido]) {
            setExpandedPedido(id_pedido);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/pedidos/detalle/${id_pedido}`);
            setDetallesPedido(prev => ({
                ...prev,
                [id_pedido]: response.data
            }));
            setExpandedPedido(id_pedido);
        } catch (error) {
            console.error('Error al cargar detalle:', error);
            alert('Error al cargar el detalle del pedido');
        }
    };

    // Iniciar edición de estado
    const handleEditarEstado = (pedido) => {
        setEditandoId(pedido.id_pedido);
        setNuevoEstadoTemp(pedido.estado);
    };

    // Guardar el nuevo estado
    const handleGuardarEstado = async (id_pedido) => {
        try {
            // Aquí deberías crear una ruta en el backend para actualizar el estado
            await axios.put(`${API_URL}/pedidos/estado/${id_pedido}`, {
                estado: nuevoEstadoTemp
            });

            // Actualizar el estado local
            const pedidosActualizados = pedidos.map(p =>
                p.id_pedido === id_pedido ? { ...p, estado: nuevoEstadoTemp } : p
            );
            
            setPedidos(pedidosActualizados);
            setEditandoId(null);
            alert('Estado actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al actualizar el estado del pedido');
        }
    };

    const handleCancelar = () => {
        setEditandoId(null);
        setNuevoEstadoTemp('');
    };

    const formatPrice = (price) => {
        if (!price) return '$0';
        return price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        });
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstadoColor = (estado) => {
        const colores = {
            'Pendiente': { bg: '#ffc107', color: '#333' },
            'En proceso': { bg: '#17a2b8', color: 'white' },
            'Enviado': { bg: '#007bff', color: 'white' },
            'Entregado': { bg: '#28a745', color: 'white' },
            'Cancelado': { bg: '#dc3545', color: 'white' },
            'Pagado': { bg: '#28a745', color: 'white' }
        };
        return colores[estado] || { bg: '#6c757d', color: 'white' };
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderPedidos />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                        fontSize: '18px',
                        color: '#666'
                    }}>
                        <p>Cargando pedidos...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="contenido">
                <HeaderPedidos />

                <section className="cuadro-blanco pedidos">
                    <h2>Pedidos Realizados ({pedidos.length})</h2>

                    <div className="tabla-usuarios">
                        <table>
                            <thead>
                                <tr>
                                    <th>Pedido #</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Método Pago</th>
                                    <th>Total</th>
                                    <th>Productos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                            No hay pedidos registrados todavía
                                        </td>
                                    </tr>
                                ) : (
                                    pedidos.map((pedido) => (
                                        <React.Fragment key={pedido.id_pedido}>
                                            <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                                                <td>
                                                    <strong style={{fontSize: '16px', color: '#333'}}>
                                                        #{pedido.id_pedido}
                                                    </strong>
                                                    {pedido.num_ticket && (
                                                        <div style={{fontSize: '0.85em', color: '#666', marginTop: '4px'}}>
                                                            Ticket: {pedido.num_ticket}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{fontWeight: '500', color: '#333'}}>
                                                        {pedido.cliente}
                                                    </div>
                                                    <div style={{fontSize: '0.85em', color: '#666', marginTop: '2px'}}>
                                                        {pedido.telefono}
                                                    </div>
                                                </td>
                                                <td style={{fontSize: '0.9em'}}>
                                                    {formatFecha(pedido.fecha)}
                                                </td>
                                                <td>
                                                    {editandoId === pedido.id_pedido ? (
                                                        <select 
                                                            value={nuevoEstadoTemp} 
                                                            onChange={(e) => setNuevoEstadoTemp(e.target.value)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                border: '2px solid #007bff',
                                                                fontSize: '0.9em',
                                                                fontWeight: '600',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {opcionesEstado.map(op => (
                                                                <option key={op} value={op}>{op}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.85em',
                                                            fontWeight: '600',
                                                            backgroundColor: getEstadoColor(pedido.estado).bg,
                                                            color: getEstadoColor(pedido.estado).color
                                                        }}>
                                                            {pedido.estado}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.9em', color: '#555'}}>
                                                        {pedido.metodo_pago || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong style={{fontSize: '16px', color: '#e63946'}}>
                                                        {formatPrice(pedido.total_ticket)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        background: '#f0f0f0',
                                                        borderRadius: '8px',
                                                        fontSize: '0.85em'
                                                    }}>
                                                        {pedido.total_productos} items
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{display: 'flex', gap: '8px', flexDirection: 'column'}}>
                                                        {editandoId === pedido.id_pedido ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleGuardarEstado(pedido.id_pedido)}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        background: '#28a745',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85em',
                                                                        fontWeight: '500'
                                                                    }}
                                                                >
                                                                     Guardar
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelar}
                                                                    style={{
                                                                        padding: '6px 12px',
                                                                        background: '#6c757d',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85em',
                                                                        fontWeight: '500'
                                                                    }}
                                                                >
                                                                     Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleEditarEstado(pedido)}
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    background: '#ffc107',
                                                                    color: '#333',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.85em',
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                 Editar Estado
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => cargarDetallePedido(pedido.id_pedido)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: expandedPedido === pedido.id_pedido ? '#6c757d' : '#007bff',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.85em',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {expandedPedido === pedido.id_pedido ? '▼ Ocultar' : '▶ Ver Detalles'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {/* FILA EXPANDIDA CON DETALLES */}
                                            {expandedPedido === pedido.id_pedido && detallesPedido[pedido.id_pedido] && (
                                                <tr>
                                                    <td colSpan="8" style={{
                                                        background: 'linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)',
                                                        padding: '20px',
                                                        borderTop: '2px solid #007bff'
                                                    }}>
                                                        <div style={{
                                                            background: 'white',
                                                            padding: '20px',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <h4 style={{
                                                                marginBottom: '15px',
                                                                color: '#333',
                                                                fontSize: '18px',
                                                                borderBottom: '2px solid #007bff',
                                                                paddingBottom: '10px'
                                                            }}>
                                                                 Detalle del Pedido #{pedido.id_pedido}
                                                            </h4>
                                                            
                                                            {/* Información del Cliente */}
                                                            <div style={{
                                                                background: '#f8f9fa',
                                                                padding: '15px',
                                                                borderRadius: '6px',
                                                                marginBottom: '15px'
                                                            }}>
                                                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
                                                                    <div>
                                                                        <strong style={{color: '#666', fontSize: '0.85em'}}>Cliente:</strong>
                                                                        <p style={{margin: '5px 0', fontSize: '0.95em'}}>
                                                                            {detallesPedido[pedido.id_pedido][0].cliente}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <strong style={{color: '#666', fontSize: '0.85em'}}>Correo:</strong>
                                                                        <p style={{margin: '5px 0', fontSize: '0.95em'}}>
                                                                            {detallesPedido[pedido.id_pedido][0].correo}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <strong style={{color: '#666', fontSize: '0.85em'}}>Teléfono:</strong>
                                                                        <p style={{margin: '5px 0', fontSize: '0.95em'}}>
                                                                            {detallesPedido[pedido.id_pedido][0].telefono}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tabla de Productos */}
                                                            <table style={{
                                                                width: '100%',
                                                                marginTop: '15px',
                                                                borderCollapse: 'collapse'
                                                            }}>
                                                                <thead>
                                                                    <tr style={{background: '#e9ecef'}}>
                                                                        <th style={{
                                                                            padding: '12px',
                                                                            textAlign: 'left',
                                                                            borderBottom: '2px solid #dee2e6',
                                                                            color: '#495057',
                                                                            fontWeight: '600'
                                                                        }}>Producto</th>
                                                                        <th style={{
                                                                            padding: '12px',
                                                                            textAlign: 'center',
                                                                            borderBottom: '2px solid #dee2e6',
                                                                            color: '#495057',
                                                                            fontWeight: '600'
                                                                        }}>Precio Unitario</th>
                                                                        <th style={{
                                                                            padding: '12px',
                                                                            textAlign: 'center',
                                                                            borderBottom: '2px solid #dee2e6',
                                                                            color: '#495057',
                                                                            fontWeight: '600'
                                                                        }}>Cantidad</th>
                                                                        <th style={{
                                                                            padding: '12px',
                                                                            textAlign: 'right',
                                                                            borderBottom: '2px solid #dee2e6',
                                                                            color: '#495057',
                                                                            fontWeight: '600'
                                                                        }}>Subtotal</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {detallesPedido[pedido.id_pedido].map((detalle, idx) => (
                                                                        <tr key={idx} style={{
                                                                            borderBottom: '1px solid #dee2e6'
                                                                        }}>
                                                                            <td style={{padding: '12px', color: '#333'}}>
                                                                                {detalle.nom_producto}
                                                                            </td>
                                                                            <td style={{padding: '12px', textAlign: 'center', color: '#666'}}>
                                                                                {formatPrice(detalle.precio_unitario)}
                                                                            </td>
                                                                            <td style={{padding: '12px', textAlign: 'center'}}>
                                                                                <span style={{
                                                                                    background: '#007bff',
                                                                                    color: 'white',
                                                                                    padding: '4px 12px',
                                                                                    borderRadius: '12px',
                                                                                    fontWeight: '600'
                                                                                }}>
                                                                                    {detalle.cantidad}
                                                                                </span>
                                                                            </td>
                                                                            <td style={{
                                                                                padding: '12px',
                                                                                textAlign: 'right',
                                                                                fontWeight: '600',
                                                                                color: '#e63946'
                                                                            }}>
                                                                                {formatPrice(detalle.subtotal_producto)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr style={{background: '#f8f9fa'}}>
                                                                        <td colSpan="3" style={{
                                                                            padding: '15px',
                                                                            textAlign: 'right',
                                                                            fontWeight: '700',
                                                                            fontSize: '16px',
                                                                            color: '#333'
                                                                        }}>
                                                                            TOTAL:
                                                                        </td>
                                                                        <td style={{
                                                                            padding: '15px',
                                                                            textAlign: 'right',
                                                                            fontWeight: '700',
                                                                            fontSize: '18px',
                                                                            color: '#28a745'
                                                                        }}>
                                                                            {formatPrice(detallesPedido[pedido.id_pedido][0].total_ticket)}
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>

                                                            {/* Información de Pago */}
                                                            <div style={{
                                                                marginTop: '15px',
                                                                padding: '15px',
                                                                background: '#e7f3ff',
                                                                borderRadius: '6px',
                                                                borderLeft: '4px solid #007bff'
                                                            }}>
                                                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                    <div>
                                                                        <strong style={{color: '#333'}}>Método de Pago:</strong>{' '}
                                                                        <span style={{color: '#007bff', fontWeight: '600'}}>
                                                                            {detallesPedido[pedido.id_pedido][0].metodo_pago}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <strong style={{color: '#333'}}>Estado:</strong>{' '}
                                                                        <span style={{
                                                                            padding: '4px 12px',
                                                                            background: '#28a745',
                                                                            color: 'white',
                                                                            borderRadius: '12px',
                                                                            fontSize: '0.9em',
                                                                            fontWeight: '600'
                                                                        }}>
                                                                            {detallesPedido[pedido.id_pedido][0].estado_pago}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}