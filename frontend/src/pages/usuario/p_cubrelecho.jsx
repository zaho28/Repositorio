import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../components/css/styles.css";
import p_cubrelechos from "../../assets/cubrelecho.webp";
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { apiGet, apiPost } from '../../context/api.js';

const METROS_POR_TAMANO = {
    sencilla:  4,
    semidoble: 5,
    doble:     6,
    queen:     7,
    king:      8,
};

const TAMANO_LABEL = {
    sencilla:  'Sencilla',
    semidoble: 'Semidoble',
    doble:     'Doble',
    queen:     'Queen',
    king:      'King',
};

const TAMANOS = [
    { value: 'sencilla',  label: 'Sencilla' },
    { value: 'semidoble', label: 'Semidoble' },
    { value: 'doble',     label: 'Doble' },
    { value: 'queen',     label: 'Queen' },
    { value: 'king',      label: 'King' },
];

const PersonalizarCubrelecho = () => {
    const { usuarioActual } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tamano, setTamano]               = useState('');
    const [ladoActivo, setLadoActivo]       = useState('lado1');
    const [telaLado1, setTelaLado1]         = useState(null);
    const [telaLado2, setTelaLado2]         = useState(null);
    const [telas, setTelas]                 = useState([]);
    const [cargandoTelas, setCargandoTelas] = useState(true);
    const [enviando, setEnviando]           = useState(false);
    const [mensaje, setMensaje]             = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchTelas = async () => {
            try {
                const data = await apiGet('/pedidos-personalizados/materiales/Tela');
                setTelas(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error al cargar telas:', err);
            } finally {
                setCargandoTelas(false);
            }
        };
        fetchTelas();
    }, []);

    const formatPrice = (price) =>
        Number(price)?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    const calcularMetros = () => METROS_POR_TAMANO[tamano] || 0;

    // Cada lado usa la mitad de los metros
    const metrosPorLado = () => calcularMetros() / 2;

    const calcularPrecio = () => {
        if (!tamano || !telaLado1 || !telaLado2) return null;
        const metros = calcularMetros();
        const precioPorLado = metros / 2;
        const total = (precioPorLado * Number(telaLado1.precio_unitario)) +
                      (precioPorLado * Number(telaLado2.precio_unitario));
        return Math.ceil(total / 1000) * 1000;
    };

    const precio = calcularPrecio();
    const puedeConfirmar = tamano && telaLado1 && telaLado2;

    const telaActual    = ladoActivo === 'lado1' ? telaLado1 : telaLado2;
    const setTelaActual = ladoActivo === 'lado1' ? setTelaLado1 : setTelaLado2;

    const handleConfirmar = async () => {
        if (!usuarioActual?.id_usuario) {
            setMensaje({ text: 'Debes iniciar sesión para hacer un pedido.', type: 'error' });
            return;
        }
        if (!puedeConfirmar) {
            setMensaje({ text: 'Completa todas las opciones antes de confirmar.', type: 'error' });
            return;
        }

        setEnviando(true);
        setMensaje({ text: '', type: '' });

        const metros = calcularMetros();

        // Materiales: cada lado con sus metros
        const materiales = [];
        const mitad = metros / 2;

        // Agregar tela lado 1
        const existeLado1 = materiales.find(m => m.id_material === telaLado1.id_material);
        if (existeLado1) {
            existeLado1.cantidad += mitad;
        } else {
            materiales.push({ id_material: telaLado1.id_material, cantidad: mitad });
        }

        // Agregar tela lado 2
        const existeLado2 = materiales.find(m => m.id_material === telaLado2.id_material);
        if (existeLado2) {
            existeLado2.cantidad += mitad;
        } else {
            materiales.push({ id_material: telaLado2.id_material, cantidad: mitad });
        }

        const dto = {
            id_usuario:    usuarioActual.id_usuario,
            tipo_producto: 'Cubrelecho',
            tamanio:       TAMANO_LABEL[tamano],
            metodo_pago:   'Mtd-TJ',
            materiales,
        };

        try {
            const response = await apiPost('/pedidos-personalizados', dto);
            sessionStorage.setItem('ticketPersonalizado', JSON.stringify({
                num_ticket:   response.num_ticket,
                id_pedido:    response.id_pedido,
                precio_total: response.precio_total,
                tipo:         'Cubrelecho',
                tamano:       TAMANO_LABEL[tamano],
                telaLado1:    telaLado1.nombre,
                telaLado2:    telaLado2.nombre,
                metros,
                usuario: {
                    nombre:     `${usuarioActual.nom_1} ${usuarioActual.ape_1}`,
                    correo:     usuarioActual.correo,
                    telefono:   usuarioActual.telefono,
                    id_usuario: usuarioActual.id_usuario,
                }
            }));
            navigate('/ticket_personalizado');
        } catch (error) {
            setMensaje({ text: error.message || 'Error al confirmar el pedido.', type: 'error' });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="app-container">
            <Header />

            <main className="personalizar-main">

                <div className="personalizar-topbar">
                    <Link to="/pedidos_personalizados" className="btn-volver-ped">← Volver</Link>
                    <h2>Personalizar cubrelecho</h2>
                </div>

                {mensaje.text && (
                    <div className={`alerta ${mensaje.type}`} style={{ margin: '0 20px 16px' }}>
                        {mensaje.text}
                    </div>
                )}

                <div className="personalizar-layout">

                    {/* Columna izquierda */}
                    <div className="personalizar-col-imagen">
                        <img src={p_cubrelechos} alt="Cubrelecho" className="personalizar-imagen" />
                        <div className="personalizar-imagen-info">
                            <p className="personalizar-nota">
                                El precio puede variar según la disponibilidad de materiales al momento de confirmar.
                            </p>

                            {(telaLado1 || telaLado2) && tamano && (
                                <div style={{
                                    background: '#fdf8fb', border: '1.5px solid #f0d8e5',
                                    borderRadius: '10px', padding: '12px 14px',
                                    fontSize: '0.82rem', color: '#5a3d54', lineHeight: '1.8',
                                    marginBottom: '12px'
                                }}>
                                    <div><strong>Tamaño:</strong> {TAMANO_LABEL[tamano]}</div>
                                    <div><strong>Metros totales:</strong> {calcularMetros()} m</div>
                                    {telaLado1 && <div> <strong>Lado 1:</strong> {telaLado1.nombre}</div>}
                                    {telaLado2 && <div> <strong>Lado 2:</strong> {telaLado2.nombre}</div>}
                                </div>
                            )}

                            <div className="personalizar-precio-box">
                                <span className="personalizar-precio-label">Precio estimado</span>
                                <span className="personalizar-precio-valor">
                                    {precio ? formatPrice(precio) : '—'}
                                </span>
                            </div>

                            <button
                                className="btn-confirmar-ped"
                                disabled={!puedeConfirmar || enviando}
                                onClick={handleConfirmar}
                            >
                                {enviando ? 'Procesando...' : 'Confirmar pedido'}
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="personalizar-col-opciones">

                        {/* Tamaño */}
                        <div className="opcion-seccion">
                            <h3>Tamaño de cama</h3>
                            <div className="opciones-radio-grid">
                                {TAMANOS.map(t => (
                                    <label key={t.value} className={`radio-card ${tamano === t.value ? 'seleccionado' : ''}`}>
                                        <input type="radio" name="tamano" value={t.value}
                                            checked={tamano === t.value}
                                            onChange={e => setTamano(e.target.value)} />
                                        <span>{t.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Tipo de tela por lado */}
                        <div className="opcion-seccion">
                            <h3>Tipo de tela</h3>

                            <div className="botones-lado">
                                <button
                                    className={`btn-lado ${ladoActivo === 'lado1' ? 'activo' : ''}`}
                                    onClick={() => setLadoActivo('lado1')}
                                    type="button"
                                >
                                    Lado 1 {telaLado1 ? '✓' : ''}
                                </button>
                                <button
                                    className={`btn-lado ${ladoActivo === 'lado2' ? 'activo' : ''}`}
                                    onClick={() => setLadoActivo('lado2')}
                                    type="button"
                                >
                                    Lado 2 {telaLado2 ? '✓' : ''}
                                </button>
                            </div>

                            <div className="panel-tela">
                                <div className="grupo-telas">
                                    <h5>{ladoActivo === 'lado1' ? 'LADO 1' : 'LADO 2'}</h5>
                                    <h4>Telas disponibles</h4>

                                    {cargandoTelas ? (
                                        <p style={{ color: '#9a7a8a' }}>Cargando telas...</p>
                                    ) : telas.length === 0 ? (
                                        <p style={{ color: '#e74c3c' }}>No hay telas disponibles.</p>
                                    ) : (
                                        <div className="lista-telas">
                                            {telas.map(tela => (
                                                <div
                                                    key={tela.id_material}
                                                    className={`tela-item ${telaActual?.id_material === tela.id_material ? 'activo' : ''}`}
                                                    onClick={() => setTelaActual(tela)}
                                                >
                                                    {telaActual?.id_material === tela.id_material ? '✓ ' : ''}
                                                    {tela.nombre}
                                                    <small style={{ color: '#9a7a8a', marginLeft: '8px' }}>
                                                        {formatPrice(tela.precio_unitario)}/metro
                                                    </small>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Diseño */}
                        <div className="opcion-seccion">
                            <h3>Diseño / Estampados</h3>
                            <p style={{ fontSize: '0.88rem', color: '#9a7a8a', marginBottom: '12px', lineHeight: '1.5' }}>
                                Explora los diseños disponibles para personalizar tu cubrelecho.
                            </p>
                            <button className="btn-ver-disenos" type="button">
                                Ver diseños disponibles
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PersonalizarCubrelecho;