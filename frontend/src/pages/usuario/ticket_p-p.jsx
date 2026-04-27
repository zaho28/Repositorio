import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';
import '../../components/css/styles.css';

const TicketPersonalizado = () => {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('ticketPersonalizado');
        
        console.log("DATA RAW:", data);

        if (data) {
            const parsed = JSON.parse(data);
            console.log("DATA PARSED:", parsed);
            setTicket(parsed);
        }
    }, []);

    const formatPrice = (price) =>
        Number(price)?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    if (!ticket) {
        return ( 
            <>
                <Header />
                <main style={{ textAlign: 'center', padding: '60px' }}>
                    <h2>No hay información de pedido</h2>
                    <button className="ticket-btn-volver" onClick={() => navigate('/pedidos_personalizados')}>
                        Volver
                    </button>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <div className="ticket-page">
            <Header />
            <main className="ticket-main">
                <div className="ticket-container">

                    {/* Header */}
                    <div className="ticket-header">
                        <h1 className="ticket-header-title">¡Pedido Personalizado Generado!</h1>
                        <p className="ticket-header-subtitle">Tu pedido ha sido registrado. Te contactaremos pronto.</p>
                    </div>

                    <div className="ticket-body">

                        {/* Números */}
                        <div className="ticket-info-box">
                            <div className="ticket-info-grid">
                                <div>
                                    <p className="ticket-info-label">Nº Ticket</p>
                                    <p className="ticket-info-value">TKT-{ticket.num_ticket}</p>
                                </div>
                                <div className="ticket-info-right">
                                    <p className="ticket-info-label">Nº Pedido</p>
                                    <p className="ticket-info-value">#{ticket.id_pedido}</p>
                                </div>
                            </div>
                            <div className="ticket-info-divider">
                                <p className="ticket-info-label">Fecha</p>
                                <p className="ticket-info-date">
                                    {new Date().toLocaleString('es-CO', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Cliente */}
                        <div className="ticket-section">
                            <h3 className="ticket-section-title">Cliente</h3>
                            <p className="ticket-cliente-nombre">{ticket.usuario.nombre}</p>
                            <p className="ticket-cliente-info">ID: {ticket.usuario.id_usuario}</p>
                            <p className="ticket-cliente-info">Correo: {ticket.usuario.correo}</p>
                            <p className="ticket-cliente-info">Teléfono: {ticket.usuario.telefono}</p>
                        </div>

                        {/* Detalles del pedido */}
                        <div className="ticket-section">
                            <h3 className="ticket-section-title">Detalles del Pedido</h3>
                            <div className="ticket-productos-lista">
                                <div className="ticket-producto-item">
                                    <div className="ticket-producto-info">
                                        <p className="ticket-producto-nombre">
                                            {ticket.tipo} — {ticket.tamano}
                                        </p>
                                        <p className="ticket-producto-cantidad">
                                            Tela: {ticket.tela} x {ticket.metros} metros
                                        </p>
                                        {ticket.sobresabana && (
                                            <p className="ticket-producto-cantidad"> Incluye sobresábana</p>
                                        )}
                                        {ticket.almohadas !== 'no' && (
                                            <p className="ticket-producto-cantidad">
                                                {ticket.almohadas === 'una' ? '1 funda' : '2 fundas'} de almohada
                                            </p>
                                        )}
                                    </div>
                                    <p className="ticket-producto-total">{formatPrice(ticket.precio_total)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="ticket-totales">
                            <div className="ticket-total">
                                <span>Total estimado</span>
                                <span>{formatPrice(ticket.precio_total)}</span>
                            </div>
                        </div>

                        {/* Pago */}
                        <div className="ticket-pago-box">
                            <div className="ticket-pago-metodo">
                                <span>Pago:</span>
                                <span className="ticket-pago-valor">Presencial en tienda</span>
                            </div>
                            <p className="ticket-nota-pago">
                                Tu pedido está en estado <strong>Pendiente</strong>. 
                                El administrador lo revisará y te notificará cuando esté listo para recoger.
                            </p>
                        </div>

                        {/* Estado */}
                        <div className="ticket-estado-container">
                            <span className="ticket-estado-badge">Estado: Pendiente</span>
                        </div>

                        <div className="ticket-footer">
                            <p className="ticket-footer-gracias">¡Gracias por tu pedido personalizado!</p>
                            <p className="ticket-footer-empresa">Gurama Online — Productos Artesanales</p>
                        </div>
                    </div>
                </div>

                <div className="ticket-acciones">
                    <button onClick={() => window.print()} className="ticket-btn-descargar">
                        Imprimir ticket
                    </button>
                    <button onClick={() => navigate('/cliente')} className="ticket-btn-inicio">
                        Volver al Inicio
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TicketPersonalizado;