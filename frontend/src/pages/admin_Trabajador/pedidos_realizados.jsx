import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderPedidos from "../../components/HeaderPedidos";
import "../../components/css/styles.css";

import { apiGet, apiPatch } from '../../context/api.js';

export default function PedidosRealizados() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPedido, setExpandedPedido] = useState(null);
    const [detallesPedido, setDetallesPedido] = useState({});
    const [editandoId, setEditandoId] = useState(null);
    const [nuevoEstadoTemp, setNuevoEstadoTemp] = useState('');

    const opcionesEstado = ['Pendiente', 'Pagado', 'Entegado', 'Finalizado'];

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const response = await apiGet('/pedidos');
            const data = Array.isArray(response) ? response : response.data || [];
            setPedidos(data);
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
            const response = await apiGet(`/pedidos/detalle/${id_pedido}`);
            const data = Array.isArray(response) ? response : response.data || [];
            setDetallesPedido(prev => ({ ...prev, [id_pedido]: data }));
            setExpandedPedido(id_pedido);
        } catch (error) {
            console.error('Error al cargar detalle:', error);
            alert('Error al cargar el detalle del pedido');
        }
    };

    const handleEditarEstado = (pedido) => {
        setEditandoId(pedido.id_pedido);
        setNuevoEstadoTemp(pedido.estado);
    };

    const handleGuardarEstado = async (id_pedido) => {
        try {
            await apiPatch(`/pedidos/${id_pedido}`, { estado: nuevoEstadoTemp }); // 
            setPedidos(prev => prev.map(p =>
                p.id_pedido === id_pedido ? { ...p, estado: nuevoEstadoTemp } : p
            ));
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

    const getEstadoClass = (estado) => {
        const clases = {
            'Pendiente': 'estado-pendiente',
            'pagado': 'estado-en-proceso',
            'Finalizado': 'estado-Finalizado',
            'Entegado': 'estado-Entegado'
        };
        return `pedido-estado-badge ${clases[estado] || ''}`;
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderPedidos />
                    <div className="pedidos-loading">
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
                                        <td colSpan="8" className="pedidos-tabla-vacia">
                                            No hay pedidos registrados todavía
                                        </td>
                                    </tr>
                                ) : (
                                    pedidos.map((pedido) => (
                                        <React.Fragment key={pedido.id_pedido}>
                                            <tr>
                                                <td>
                                                    <strong className="pedido-id">
                                                        #{pedido.id_pedido}
                                                    </strong>
                                                    {pedido.num_ticket && (
                                                        <span className="pedido-ticket">
                                                            Ticket: {pedido.num_ticket}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="pedido-cliente-nombre">
                                                        {pedido.cliente}
                                                    </div>
                                                    <span className="pedido-cliente-telefono">
                                                        {pedido.telefono}
                                                    </span>
                                                </td>
                                                <td className="pedido-fecha">
                                                    {formatFecha(pedido.fecha)}
                                                </td>
                                                <td>
                                                    {editandoId === pedido.id_pedido ? (
                                                        <select 
                                                            value={nuevoEstadoTemp} 
                                                            onChange={(e) => setNuevoEstadoTemp(e.target.value)}
                                                            className="pedido-estado-select"
                                                        >
                                                            {opcionesEstado.map(op => (
                                                                <option key={op} value={op}>{op}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className={getEstadoClass(pedido.estado)}>
                                                            {pedido.estado}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="pedido-metodo-pago">
                                                    {pedido.metodo_pago || 'N/A'}
                                                </td>
                                                <td>
                                                    <strong className="pedido-total">
                                                        {formatPrice(pedido.total_ticket)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <span className="pedido-productos-badge">
                                                        {pedido.total_productos} items
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="pedido-acciones">
                                                        {editandoId === pedido.id_pedido ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleGuardarEstado(pedido.id_pedido)}
                                                                    className="btn-guardar"
                                                                >
                                                                    ✓ Guardar
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelar}
                                                                    className="btn-cancelar-edicion"
                                                                >
                                                                    ✕ Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleEditarEstado(pedido)}
                                                                className="btn-editar-estado"
                                                            >
                                                                Editar Estado
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => cargarDetallePedido(pedido.id_pedido)}
                                                            className={`btn-ver-detalles ${expandedPedido === pedido.id_pedido ? 'activo' : ''}`}
                                                        >
                                                            {expandedPedido === pedido.id_pedido ? 'Ocultar' : ' Ver Detalles'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {/* FILA EXPANDIDA CON DETALLES */}
                                            {expandedPedido === pedido.id_pedido && detallesPedido[pedido.id_pedido] && (
                                                <tr className="detalle-pedido-row">
                                                    <td colSpan="8">
                                                        <div className="detalle-pedido-container">
                                                            <h4 className="detalle-pedido-titulo">
                                                                Detalle del Pedido #{pedido.id_pedido}
                                                            </h4>
                                                            
                                                            {/* Información del Cliente */}
                                                            <div className="detalle-cliente-box">
                                                                <div className="detalle-cliente-grid">
                                                                    <div className="detalle-cliente-item">
                                                                        <strong className="detalle-cliente-label">Cliente:</strong>
                                                                        <p className="detalle-cliente-valor">
                                                                            {detallesPedido[pedido.id_pedido][0].cliente}
                                                                        </p>
                                                                    </div>
                                                                    <div className="detalle-cliente-item">
                                                                        <strong className="detalle-cliente-label">Correo:</strong>
                                                                        <p className="detalle-cliente-valor">
                                                                            {detallesPedido[pedido.id_pedido][0].correo}
                                                                        </p>
                                                                    </div>
                                                                    <div className="detalle-cliente-item">
                                                                        <strong className="detalle-cliente-label">Teléfono:</strong>
                                                                        <p className="detalle-cliente-valor">
                                                                            {detallesPedido[pedido.id_pedido][0].telefono}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tabla de Productos */}
                                                            <table className="detalle-tabla-productos">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Producto</th>
                                                                        <th>Precio Unitario</th>
                                                                        <th>Cantidad</th>
                                                                        <th>Subtotal</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {detallesPedido[pedido.id_pedido].map((detalle, idx) => (
                                                                        <tr key={idx}>
                                                                            <td className="detalle-producto-nombre">
                                                                                {detalle.nom_producto}
                                                                            </td>
                                                                            <td className="detalle-producto-precio">
                                                                                {formatPrice(detalle.precio_unitario)}
                                                                            </td>
                                                                            <td style={{textAlign: 'center'}}>
                                                                                <span className="detalle-producto-cantidad-badge">
                                                                                    {detalle.cantidad}
                                                                                </span>
                                                                            </td>
                                                                            <td className="detalle-producto-subtotal">
                                                                                {formatPrice(detalle.subtotal_producto)}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <td colSpan="3" className="detalle-total-label">
                                                                            TOTAL:
                                                                        </td>
                                                                        <td className="detalle-total-valor">
                                                                            {formatPrice(detallesPedido[pedido.id_pedido][0].total_ticket)}
                                                                        </td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>

                                                            {/* Información de Pago */}
                                                            <div className="detalle-pago-box">
                                                                <div className="detalle-pago-info">
                                                                    <div className="detalle-pago-metodo">
                                                                        <strong>Método de Pago:</strong>{' '}
                                                                        <span className="detalle-pago-metodo-valor">
                                                                            {detallesPedido[pedido.id_pedido][0].metodo_pago}
                                                                        </span>
                                                                    </div>
                                                                    <div className="detalle-pago-estado">
                                                                        <strong>Estado:</strong>{' '}
                                                                        <span className="detalle-estado-pago-badge">
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