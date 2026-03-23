import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../components/css/styles.css";
import p_cubrelechos from "../../assets/cubrelecho.webp";
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';

// Precios base (cuando conectes la API vendrán del backend)
const PRECIOS_TAMANO = {
    sencilla:  90000,
    semidoble: 105000,
    doble:     120000,
    queen:     140000,
    king:      160000,
};

// Telas disponibles (luego vendrán de GET /pedidos-personalizados/materiales?tipo=Tela)
const TELAS_DISPONIBLES = [
    { id: 1, nombre: 'Ovejero' },
    { id: 2, nombre: 'Conejo' },
    { id: 3, nombre: 'Venus pelo largo' },
    { id: 4, nombre: 'Peluche liso' },
    { id: 5, nombre: 'Micropolar' },
];

const PersonalizarCubrelecho = () => {
    const [tamano, setTamano]       = useState('');
    const [ladoActivo, setLadoActivo] = useState('lado1');
    const [telaLado1, setTelaLado1] = useState(null);
    const [telaLado2, setTelaLado2] = useState(null);
    const [metodoPago, setMetodoPago] = useState('');

    const calcularPrecio = () => {
        if (!tamano) return null;
        return PRECIOS_TAMANO[tamano] || 0;
    };

    const formatPrice = (price) =>
        price?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    const precio = calcularPrecio();

    const TAMANOS = [
        { value: 'sencilla',  label: 'Sencilla' },
        { value: 'semidoble', label: 'Semidoble' },
        { value: 'doble',     label: 'Doble' },
        { value: 'queen',     label: 'Queen' },
        { value: 'king',      label: 'King' },
    ];

    const METODOS_PAGO = [
        { value: 'efectivo',      label: 'Pago en tienda',          sub: 'Paga cuando recojas tu pedido' },
        { value: 'transferencia', label: 'Transferencia bancaria',   sub: 'Te enviaremos los datos de pago' },
    ];

    const telaActual    = ladoActivo === 'lado1' ? telaLado1 : telaLado2;
    const setTelaActual = ladoActivo === 'lado1' ? setTelaLado1 : setTelaLado2;

    const puedeConfirmar = tamano && telaLado1 && telaLado2 && metodoPago;

    return (
        <div className="app-container">
            <Header />

            <main className="personalizar-main">

                {/* Topbar */}
                <div className="personalizar-topbar">
                    <Link to="/pedidos_personalizados" className="btn-volver-ped">
                        ← Volver
                    </Link>
                    <h2>Personalizar cubrelecho</h2>
                </div>

                <div className="personalizar-layout">

                    {/* Columna izquierda: imagen + precio */}
                    <div className="personalizar-col-imagen">
                        <img src={p_cubrelechos} alt="Cubrelecho" className="personalizar-imagen" />
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

                            {/* Resumen de selección */}
                            {(telaLado1 || telaLado2) && (
                                <div style={{
                                    background: '#fdf8fb',
                                    border: '1.5px solid #f0d8e5',
                                    borderRadius: '10px',
                                    padding: '12px 14px',
                                    fontSize: '0.82rem',
                                    color: '#5a3d54',
                                    lineHeight: '1.7',
                                }}>
                                    {telaLado1 && <div>🧵 <strong>Lado 1:</strong> {telaLado1}</div>}
                                    {telaLado2 && <div>🧵 <strong>Lado 2:</strong> {telaLado2}</div>}
                                </div>
                            )}

                            <button
                                className="btn-confirmar-ped"
                                disabled={!puedeConfirmar}
                            >
                                Confirmar pedido
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha: opciones */}
                    <div className="personalizar-col-opciones">

                        {/* Tamaño */}
                        <div className="opcion-seccion">
                            <h3>Tamaño de cama</h3>
                            <select
                                value={tamano}
                                onChange={e => setTamano(e.target.value)}
                            >
                                <option value="" disabled>Seleccionar tamaño...</option>
                                {TAMANOS.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo de tela por lado */}
                        <div className="opcion-seccion">
                            <h3>Tipo de tela</h3>

                            {/* Tabs lado 1 / lado 2 */}
                            <div className="botones-lado">
                                <button
                                    className={`btn-lado ${ladoActivo === 'lado1' ? 'activo' : ''}`}
                                    onClick={() => setLadoActivo('lado1')}
                                >
                                    Lado 1 {telaLado1 ? '✓' : ''}
                                </button>
                                <button
                                    className={`btn-lado ${ladoActivo === 'lado2' ? 'activo' : ''}`}
                                    onClick={() => setLadoActivo('lado2')}
                                >
                                    Lado 2 {telaLado2 ? '✓' : ''}
                                </button>
                            </div>

                            <div className="panel-tela">
                                <div className="grupo-telas">
                                    <h5>{ladoActivo === 'lado1' ? 'LADO 1' : 'LADO 2'}</h5>
                                    <h4>Telas disponibles</h4>
                                    <div className="lista-telas">
                                        {TELAS_DISPONIBLES.map(tela => (
                                            <div
                                                key={tela.id}
                                                className={`tela-item ${telaActual === tela.nombre ? 'activo' : ''}`}
                                                onClick={() => setTelaActual(tela.nombre)}
                                            >
                                                {telaActual === tela.nombre ? '✓ ' : ''}{tela.nombre}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Diseño / Estampados */}
                        <div className="opcion-seccion">
                            <h3>Diseño / Estampados</h3>
                            <p style={{ fontSize: '0.88rem', color: '#9a7a8a', marginBottom: '12px', lineHeight: '1.5' }}>
                                Explora los diseños disponibles para personalizar tu cubrelecho.
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

export default PersonalizarCubrelecho;