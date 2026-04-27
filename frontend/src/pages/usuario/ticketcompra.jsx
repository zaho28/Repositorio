import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/logica_carrito.jsx';
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';
import '../../components/css/styles.css';

import { apiPost} from '../../context/api.js';

const TicketCompra = () => {
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);
    const ticketRef = useRef(null);

    useEffect(() => {
        const storedData    = sessionStorage.getItem('paymentData');
        const yaProcesado   = sessionStorage.getItem('pedidoProcesado');

        if (storedData && !yaProcesado) { 
            try {
                const data = JSON.parse(storedData);
                sessionStorage.setItem('pedidoProcesado', 'true');
                procesarPedido(data);
            } catch {
                setError('Error al cargar los datos del pedido');
            }
        } else if (!storedData) {
            setError('No hay información de pedido');
        }
    }, []);

    const procesarPedido = async (pedidoData) => {
        setLoading(true);
        setError(null);

        try {
            const datosUsuarioString = localStorage.getItem('user');
            const datosUsuario = datosUsuarioString ? JSON.parse(datosUsuarioString) : {};
            const id_usuario = datosUsuario.id_usuario || 'GUEST';

            if (!pedidoData.cartItems || pedidoData.cartItems.length === 0) {
                throw new Error('No hay productos en el pedido');
            }

            const items = pedidoData.cartItems.map(item => ({
                id_producto: item.id,
                cantidad: item.cantidad,
                precio: item.price,
            }));

            const apiData = {
                items,
                id_usuario,
                metodo_pago: pedidoData.metodoPago || 'Mtd-TJ', 
                subtotal: pedidoData.subtotal,
                total: pedidoData.total,
            };

            const response = await apiPost('/pedidos/crear', apiData);

            if (!response || !response.success) {
                throw new Error(response?.message || 'Respuesta inválida del servidor');
            }

            const resData = response.data;

            const ticket = {
                num_ticket: `TKT-${resData.num_ticket}`,
                id_pedido: resData.id_pedido,
                fecha_emision: new Date().toLocaleString('es-CO', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                }),
                cliente: `${datosUsuario.nom_1 || 'Cliente'} ${datosUsuario.ape_1 || ''}`.trim(),
                id_usuario: datosUsuario.id_usuario || 'N/A',
                correo: datosUsuario.correo || 'N/A',
                telefono: datosUsuario.telefono || 'N/A',
                productos: pedidoData.cartItems,
                subtotal: pedidoData.subtotal,
                total: pedidoData.total,
                metodo_pago: 'Pago en tienda',
                estado: resData.estado || 'Pendiente',
                nota: 'Puede realizar el pago en la tienda física o coordinar con el administrador.',
            };

            setTicketData(ticket);
            sessionStorage.removeItem('paymentData');
            sessionStorage.removeItem('pedidoProcesado');
            clearCart();

        } catch (err) {
            sessionStorage.removeItem('pedidoProcesado');
            const msg = err.message || 'Error al procesar el pedido.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) =>
        price?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    const handleVolverInicio = () => {
        sessionStorage.removeItem('paymentData');
        sessionStorage.removeItem('pedidoProcesado');
        navigate('/cliente');
    };

    /* ─── Pantalla de carga ─── */
    if (loading) {
        return (
            <div className="ticket-loading-container">
                <Header />
                <main className="ticket-loading-main">
                    <div className="ticket-loading-content">
                        <div className="ticket-spinner"></div>
                        <p className="ticket-loading-text">Generando su ticket de pedido...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ─── Pantalla de error ─── */
    if (error) {
        return (
            <div className="ticket-error-container">
                <Header />
                <main className="ticket-error-main">
                    <div className="ticket-error-content">
                        <h2 className="ticket-error-title"> {error}</h2>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            Por favor, intente nuevamente o contacte al administrador.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/carrito')} className="ticket-btn-volver">
                                Volver al Carrito
                            </button>
                            <button onClick={handleVolverInicio} className="ticket-btn-volver">
                                Ir al Inicio
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ─── Sin datos ─── */
    if (!ticketData) {
        return (
            <div className="ticket-error-container">
                <Header />
                <main className="ticket-error-main">
                    <div className="ticket-error-content">
                        <h2 className="ticket-error-title">No hay información de pedido</h2>
                        <p style={{ marginBottom: '20px' }}>
                            No se encontraron datos del pedido. Por favor, vuelva al carrito.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/carrito')} className="ticket-btn-volver">
                                Volver al Carrito
                            </button>
                            <button onClick={handleVolverInicio} className="ticket-btn-volver">
                                Ir al Inicio
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ─── Ticket completo ─── */
    return (
        <div className="ticket-page">
            <Header />

            <main className="ticket-main">

                <div ref={ticketRef} className="ticket-container">

                    {/* Header */}
                    <div className="ticket-header">
                        <h1 className="ticket-header-title">¡Pedido Generado!</h1>
                        <p className="ticket-header-subtitle">Su pedido ha sido registrado correctamente</p>
                    </div>

                    <div className="ticket-body">

                        {/* Nº ticket y fecha */}
                        <div className="ticket-info-box">
                            <div className="ticket-info-grid">
                                <div>
                                    <p className="ticket-info-label">Nº Ticket</p>
                                    <p className="ticket-info-value">{ticketData.num_ticket}</p>
                                </div>
                                <div className="ticket-info-right">
                                    <p className="ticket-info-label">Nº Pedido</p>
                                    <p className="ticket-info-value">#{ticketData.id_pedido}</p>
                                </div>
                            </div>
                            <div className="ticket-info-divider">
                                <p className="ticket-info-label">Fecha y Hora</p>
                                <p className="ticket-info-date">{ticketData.fecha_emision}</p>
                            </div>
                        </div>

                        {/* Cliente */}
                        <div className="ticket-section">
                            <h3 className="ticket-section-title">Información del Cliente</h3>
                            <p className="ticket-cliente-nombre">{ticketData.cliente}</p>
                            <p className="ticket-cliente-info">ID: {ticketData.id_usuario}</p>
                            <p className="ticket-cliente-info">Correo: {ticketData.correo}</p>
                            <p className="ticket-cliente-info">Teléfono: {ticketData.telefono}</p>
                        </div>

                        {/* Productos */}
                        <div className="ticket-section">
                            <h3 className="ticket-section-title">Productos</h3>
                            <div className="ticket-productos-lista">
                                {ticketData.productos.map((producto, index) => (
                                    <div key={index} className="ticket-producto-item">
                                        <div className="ticket-producto-info">
                                            <p className="ticket-producto-nombre">{producto.name}</p>
                                            <p className="ticket-producto-cantidad">
                                                {producto.cantidad} x {formatPrice(producto.price)}
                                            </p>
                                        </div>
                                        <p className="ticket-producto-total">
                                            {formatPrice(producto.price * producto.cantidad)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="ticket-totales">
                            <div className="ticket-subtotal">
                                <span>Subtotal</span>
                                <span>{formatPrice(ticketData.subtotal)}</span>
                            </div>
                            <div className="ticket-total">
                                <span>Total</span>
                                <span>{formatPrice(ticketData.total)}</span>
                            </div>
                        </div>

                        {/* Pago */}
                        <div className="ticket-pago-box">
                            <div className="ticket-pago-metodo">
                                <span>Método de pago:</span>
                                <span className="ticket-pago-valor">{ticketData.metodo_pago}</span>
                            </div>
                            <p className="ticket-nota-pago">{ticketData.nota}</p>
                        </div>

                        {/* Estado */}
                        <div className="ticket-estado-container">
                            <span className="ticket-estado-badge">
                                Estado: {ticketData.estado}
                            </span>
                        </div>

                        {/* Footer */}
                        <div className="ticket-footer">
                            <p className="ticket-footer-gracias">¡Gracias por su pedido!</p>
                            <p className="ticket-footer-empresa">Gurama Online — Productos Artesanales</p>
                        </div>

                    </div>
                </div>

                {/* Botones */}
                <div className="ticket-acciones">
                    <button onClick={() => window.print()} className="ticket-btn-descargar">
                        Descargar / Imprimir
                    </button>
                    <button onClick={handleVolverInicio} className="ticket-btn-inicio">
                        Volver al Inicio
                    </button>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default TicketCompra;