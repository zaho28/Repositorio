import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../components/css/styles.css";
import p_sabana from "../../assets/sabana.webp";
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';

// Precio base por tamaño (cuando conectes API, este objeto vendrá del backend)
const PRECIOS_TAMANO = {
    cuna:        45000,
    individual:  80000,
    doble:       95000,
    rey:        115000,
    rey_europeo:125000,
    emperador:  140000,
};

const PRECIO_ALMOHADA = 18000;

const PersonalizarSabana = () => {
    const [tamano, setTamano] = useState('');
    const [almohada, setAlmohada] = useState('');
    const [metodoPago, setMetodoPago] = useState('');

    const calcularPrecio = () => {
        if (!tamano) return null;
        let precio = PRECIOS_TAMANO[tamano] || 0;
        if (almohada === 'una')  precio += PRECIO_ALMOHADA;
        if (almohada === 'dos')  precio += PRECIO_ALMOHADA * 2;
        return precio;
    };

    const formatPrice = (price) =>
        price?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    const precio = calcularPrecio();

    const TAMANOS = [
        { value: 'cuna',        label: 'Cuna',         dim: '100 × 145 cm' },
        { value: 'individual',  label: 'Individual',   dim: '180 × 275 cm' },
        { value: 'doble',       label: 'Doble',        dim: '230 × 275 cm' },
        { value: 'rey',         label: 'Rey',          dim: '275 × 275 cm' },
        { value: 'rey_europeo', label: 'Rey europeo',  dim: '300 × 275 cm' },
        { value: 'emperador',   label: 'Emperador',    dim: '320 × 290 cm' },
    ];

    const ALMOHADAS = [
        { value: 'no',   label: 'Sin fundas de almohada',  sub: 'No incluir' },
        { value: 'una',  label: 'Una funda de almohada',   sub: `+ ${formatPrice(PRECIO_ALMOHADA)}` },
        { value: 'dos',  label: 'Dos fundas de almohada',  sub: `+ ${formatPrice(PRECIO_ALMOHADA * 2)}` },
    ];

    const METODOS_PAGO = [
        { value: 'efectivo',    label: 'Pago en tienda',          sub: 'Paga cuando recojas tu pedido' },
        { value: 'transferencia', label: 'Transferencia bancaria', sub: 'Te enviaremos los datos de pago' },
    ];

    return (
        <div className="app-container">
            <Header />

            <main className="personalizar-main">

                {/* Topbar */}
                <div className="personalizar-topbar">
                    <Link to="/pedidos_personalizados" className="btn-volver-ped">
                        ← Volver
                    </Link>
                    <h2>Personalizar sábana</h2>
                </div>

                <div className="personalizar-layout">

                    {/* Columna izquierda: imagen + precio */}
                    <div className="personalizar-col-imagen">
                        <img src={p_sabana} alt="Sábana" className="personalizar-imagen" />
                        <div className="personalizar-imagen-info">
                            <p className="personalizar-nota">
                                ℹ️ El precio puede variar según la disponibilidad de materiales al momento de confirmar.
                            </p>

                            <div className="personalizar-precio-box">
                                <span className="personalizar-precio-label">Vista previa del precio</span>
                                <span className="personalizar-precio-valor">
                                    {precio ? formatPrice(precio) : '—'}
                                </span>
                            </div>

                            <button
                                className="btn-confirmar-ped"
                                disabled={!tamano || !almohada || !metodoPago}
                            >
                                Confirmar pedido
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha: opciones */}
                    <div className="personalizar-col-opciones">

                        {/* Tamaño */}
                        <div className="opcion-seccion">
                            <h3>Tamaño de sábana</h3>
                            <div className="opciones-radio-grid">
                                {TAMANOS.map(t => (
                                    <label
                                        key={t.value}
                                        className={`radio-card ${tamano === t.value ? 'seleccionado' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="tamano"
                                            value={t.value}
                                            checked={tamano === t.value}
                                            onChange={e => setTamano(e.target.value)}
                                        />
                                        <span>{t.label} <small style={{ color: '#9a7a8a', fontSize: '0.8rem' }}>({t.dim})</small></span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Funda de almohada */}
                        <div className="opcion-seccion">
                            <h3>¿Incluir funda de almohada?</h3>
                            <div className="metodo-pago-grid">
                                {ALMOHADAS.map(a => (
                                    <label
                                        key={a.value}
                                        className={`metodo-pago-opcion ${almohada === a.value ? 'seleccionado' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="almohada"
                                            value={a.value}
                                            checked={almohada === a.value}
                                            onChange={e => setAlmohada(e.target.value)}
                                        />
                                        <div className="metodo-pago-texto">
                                            <strong>{a.label}</strong>
                                            <span>{a.sub}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Diseño / Estampados */}
                        <div className="opcion-seccion">
                            <h3>Diseño / Estampados</h3>
                            <p style={{ fontSize: '0.88rem', color: '#9a7a8a', marginBottom: '12px', lineHeight: '1.5' }}>
                                Explora los diseños disponibles para personalizar tu sábana.
                            </p>
                            <button className="btn-ver-disenos">
                                🎨 Ver diseños disponibles
                            </button>
                        </div>

                        {/* Método de pago */}
                        <div className="opcion-seccion">
                            <h3>Método de pago</h3>
                            <div className="metodo-pago-grid">
                                {METODOS_PAGO.map(m => (
                                    <label
                                        key={m.value}
                                        className={`metodo-pago-opcion ${metodoPago === m.value ? 'seleccionado' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value={m.value}
                                            checked={metodoPago === m.value}
                                            onChange={e => setMetodoPago(e.target.value)}
                                        />
                                        <div className="metodo-pago-texto">
                                            <strong>{m.label}</strong>
                                            <span>{m.sub}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PersonalizarSabana;