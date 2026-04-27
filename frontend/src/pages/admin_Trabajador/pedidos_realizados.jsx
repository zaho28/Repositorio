import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderPedidos from "../../components/HeaderPedidos";
import "../../components/css/styles.css";
import { apiGet, apiPatch, apiPost } from '../../context/api.js';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function PedidosRealizados() {
    const { userId } = useContext(AuthContext);

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPedido, setExpandedPedido] = useState(null);
    const [detallesPedido, setDetallesPedido] = useState({});

    const [editandoId, setEditandoId] = useState(null);
    const [nuevoEstadoTemp, setNuevoEstadoTemp] = useState('');

    const [editandoMetodoId, setEditandoMetodoId] = useState(null);
    const [nuevoMetodoTemp, setNuevoMetodoTemp] = useState('');
    const [procesandoMetodo, setProcesandoMetodo] = useState(false);

    const opcionesEstado = ['Pendiente', 'Pagado', 'Entregado', 'Finalizado'];
    const opcionesMetodoPago = ['Por_definir', 'Efectivo', 'Tarjeta', 'Transferencia', 'Nequi', 'DaviPlata'];

    useEffect(() => { cargarPedidos(); }, []);

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
        if (expandedPedido === id_pedido) { setExpandedPedido(null); return; }
        if (detallesPedido[id_pedido]) { setExpandedPedido(id_pedido); return; }
        try {
            const detalle = await apiGet(`/pedidos/detalle/${id_pedido}`);
            console.log(`Detalle pedido #${id_pedido}:`, JSON.stringify(detalle, null, 2));
            setDetallesPedido(prev => ({ ...prev, [id_pedido]: detalle }));
            setExpandedPedido(id_pedido);
        } catch (error) {
            console.error('Error al cargar detalle:', error);
            alert('Error al cargar el detalle del pedido');
        }
    };

    // ─── DETECTAR TIPO DE PEDIDO ──────────────────────────────────────────────
    /**
     * Un pedido es "personalizado" (p-p) si tiene campos como tipo/tamano/telaLado1
     * y NO tiene detalles_pedido con productos.
     */
    const esPedidoPersonalizado = (detalle) => {
        const tieneEspecificaciones = !!(detalle?.tipo || detalle?.tamano || detalle?.telaLado1);
        const tieneProductos = obtenerProductos(detalle).length > 0;
        return tieneEspecificaciones && !tieneProductos;
    };

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    const obtenerTotal = (obj) =>
        obj?.ticket_compra?.precio_total
        ?? obj?.ticket_compra?.total_ticket
        ?? obj?.precio_total
        ?? obj?.total
        ?? 0;

    const obtenerProductos = (detalle) =>
        detalle?.detalles_pedido
        ?? detalle?.detalle_pedido
        ?? detalle?.productos
        ?? detalle?.items
        ?? [];

    const obtenerNombreCliente = (usuario) => {
        if (!usuario) return 'N/A';
        // p-e: nom_1 + ape_1 | p-p: nombre completo en "nombre"
        if (usuario.nom_1) return `${usuario.nom_1} ${usuario.ape_1 ?? ''}`.trim();
        if (usuario.nombre) return usuario.nombre;
        return 'N/A';
    };

    // ─── ESTADO ──────────────────────────────────────────────────────────────
    const handleEditarEstado = (pedido) => { setEditandoId(pedido.id_pedido); setNuevoEstadoTemp(pedido.estado); };
    const handleCancelarEstado = () => { setEditandoId(null); setNuevoEstadoTemp(''); };
    const handleGuardarEstado = async (id_pedido) => {
        try {
            await apiPatch(`/pedidos/${id_pedido}`, { estado: nuevoEstadoTemp });
            setPedidos(prev => prev.map(p => p.id_pedido === id_pedido ? { ...p, estado: nuevoEstadoTemp } : p));
            setEditandoId(null);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al actualizar el estado');
        }
    };

    // ─── MÉTODO DE PAGO ───────────────────────────────────────────────────────
    const handleEditarMetodo = (pedido) => {
        setEditandoMetodoId(pedido.id_pedido);
        setNuevoMetodoTemp(pedido.ticket_compra?.metodo_pago?.nom_metodo || 'Por_definir');
    };
    const handleCancelarMetodo = () => { setEditandoMetodoId(null); setNuevoMetodoTemp(''); };

    const handleGuardarMetodo = async (pedido) => {
        const metodoActual = pedido.ticket_compra?.metodo_pago?.nom_metodo || 'Por_definir';
        if (nuevoMetodoTemp === metodoActual) { setEditandoMetodoId(null); return; }

        setProcesandoMetodo(true);
        try {
            await apiPatch(`/pedidos/${pedido.id_pedido}`, { metodo_pago: nuevoMetodoTemp });

            if (nuevoMetodoTemp !== 'Por_definir') {
                let detalle = detallesPedido[pedido.id_pedido];
                if (!detalle) {
                    detalle = await apiGet(`/pedidos/detalle/${pedido.id_pedido}`);
                    setDetallesPedido(prev => ({ ...prev, [pedido.id_pedido]: detalle }));
                }

                const esPP = esPedidoPersonalizado(detalle);
                const cliente = obtenerNombreCliente(detalle?.usuario);
                const telefono = detalle?.usuario?.telefono?.toString() || 'N/A';
                const totalFormateado = formatPrice(obtenerTotal(detalle));

                if (esPP) {
                    // Pedido personalizado: no tiene productos en inventario para descontar
                    alert(`✅ Método de pago actualizado.\n(Pedido personalizado — no genera movimiento de inventario)`);
                } else {
                    const productos = obtenerProductos(detalle);
                    if (productos.length === 0) {
                        alert('⚠️ Método actualizado, pero no se encontraron productos para registrar salidas.');
                    } else {
                        await Promise.all(productos.map((item) => {
                            const id_prod = item.id_producto ?? item.producto?.id_producto;
                            return apiPost('/movimientos', {
                                Cantidad_m: parseInt(item.cantidad),
                                observaciones: `PEDIDO #${pedido.id_pedido} - Cliente: ${cliente} | Tel: ${telefono} | Total: ${totalFormateado} | Pago: ${nuevoMetodoTemp}`,
                                id_m: 'M_S',
                                id_producto: parseInt(id_prod),
                                id_usuario: userId || 'Adm-01',
                            });
                        }));
                        alert(`✅ Método actualizado y ${productos.length} movimiento(s) de salida creado(s).`);
                    }
                }
            }

            setPedidos(prev => prev.map(p => {
                if (p.id_pedido !== pedido.id_pedido) return p;
                return {
                    ...p,
                    ticket_compra: {
                        ...p.ticket_compra,
                        metodo_pago: { ...(p.ticket_compra?.metodo_pago || {}), nom_metodo: nuevoMetodoTemp },
                    },
                };
            }));
            setEditandoMetodoId(null);
        } catch (error) {
            console.error('Error al actualizar método:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setProcesandoMetodo(false);
        }
    };

    // ─── FORMAT ───────────────────────────────────────────────────────────────
    const formatPrice = (price) => {
        if (!price) return '$0';
        return Number(price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleString('es-CO', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };

    const getEstadoClass = (estado) => {
        const clases = { 'Pendiente': 'estado-pendiente', 'Pagado': 'estado-en-proceso', 'Finalizado': 'estado-Finalizado', 'Entregado': 'estado-Entegado' };
        return `pedido-estado-badge ${clases[estado] || ''}`;
    };

    // ─── SUB-COMPONENTE: detalle pedido personalizado ─────────────────────────
    const DetallePersonalizado = ({ d, pedidoId }) => (
        <div className="detalle-pedido-container">
            <h4 className="detalle-pedido-titulo">
                Detalle del Pedido #{pedidoId}
                <span style={{ marginLeft: '10px', fontSize: '13px', background: '#da819f', color: '#fff', padding: '2px 10px', borderRadius: '20px' }}>
                    Pedido Personalizado
                </span>
            </h4>

            {/* Cliente */}
            <div className="detalle-cliente-box">
                <div className="detalle-cliente-grid">
                    <div className="detalle-cliente-item">
                        <strong className="detalle-cliente-label">Cliente:</strong>
                        <p className="detalle-cliente-valor">{obtenerNombreCliente(d.usuario)}</p>
                    </div>
                    <div className="detalle-cliente-item">
                        <strong className="detalle-cliente-label">Correo:</strong>
                        <p className="detalle-cliente-valor">{d.usuario?.correo || 'N/A'}</p>
                    </div>
                    <div className="detalle-cliente-item">
                        <strong className="detalle-cliente-label">Teléfono:</strong>
                        <p className="detalle-cliente-valor">{d.usuario?.telefono?.toString() || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Especificaciones del producto personalizado */}
            <div style={{ marginTop: '15px' }}>
                <h5 style={{ color: '#da819f', marginBottom: '10px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Especificaciones del Producto
                </h5>
                <table className="detalle-tabla-productos">
                    <thead>
                        <tr>
                            <th>Especificación</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {d.tipo && (
                            <tr>
                                <td className="detalle-producto-nombre"><strong>Tipo de Producto</strong></td>
                                <td>{d.tipo}</td>
                            </tr>
                        )}
                        {d.tamano && (
                            <tr>
                                <td className="detalle-producto-nombre"><strong>Tamaño</strong></td>
                                <td>{d.tamano}</td>
                            </tr>
                        )}
                        {d.telaLado1 && (
                            <tr>
                                <td className="detalle-producto-nombre"><strong>Tela Lado 1</strong></td>
                                <td>{d.telaLado1}</td>
                            </tr>
                        )}
                        {d.telaLado2 && (
                            <tr>
                                <td className="detalle-producto-nombre"><strong>Tela Lado 2</strong></td>
                                <td>{d.telaLado2}</td>
                            </tr>
                        )}
                        {d.metros && (
                            <tr>
                                <td className="detalle-producto-nombre"><strong>Metros de Tela</strong></td>
                                <td>{d.metros} m</td>
                            </tr>
                        )}
                        {d.num_ticket && (
                            <tr>
                                <td className="detalle-producto-nombre"><strong>N° Ticket</strong></td>
                                <td>{d.num_ticket}</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="detalle-total-label">TOTAL:</td>
                            <td className="detalle-total-valor">{formatPrice(obtenerTotal(d))}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Pago */}
            <div className="detalle-pago-box">
                <div className="detalle-pago-info">
                    <div className="detalle-pago-metodo">
                        <strong>Método de Pago:</strong>{' '}
                        <span className="detalle-pago-metodo-valor">
                            {d.ticket_compra?.metodo_pago?.nom_metodo || d.metodo_pago || 'Por_definir'}
                        </span>
                    </div>
                    <div className="detalle-pago-estado">
                        <strong>Estado de Pago:</strong>{' '}
                        <span className="detalle-estado-pago-badge">
                            {d.ticket_compra?.estado_pago?.nom_metodo || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    // ─── SUB-COMPONENTE: detalle pedido estándar ──────────────────────────────
    const DetalleEstandar = ({ d, pedidoId }) => {
        const productos = obtenerProductos(d);
        return (
            <div className="detalle-pedido-container">
                <h4 className="detalle-pedido-titulo">
                    Detalle del Pedido #{pedidoId}
                    <span style={{ marginLeft: '10px', fontSize: '13px', background: '#5dade2', color: '#fff', padding: '2px 10px', borderRadius: '20px' }}>
                        Pedido Estándar
                    </span>
                </h4>

                {/* Cliente */}
                <div className="detalle-cliente-box">
                    <div className="detalle-cliente-grid">
                        <div className="detalle-cliente-item">
                            <strong className="detalle-cliente-label">Cliente:</strong>
                            <p className="detalle-cliente-valor">{obtenerNombreCliente(d.usuario)}</p>
                        </div>
                        <div className="detalle-cliente-item">
                            <strong className="detalle-cliente-label">Correo:</strong>
                            <p className="detalle-cliente-valor">{d.usuario?.correo || 'N/A'}</p>
                        </div>
                        <div className="detalle-cliente-item">
                            <strong className="detalle-cliente-label">Teléfono:</strong>
                            <p className="detalle-cliente-valor">{d.usuario?.telefono?.toString() || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Productos */}
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
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '15px' }}>
                                    No hay productos registrados en este pedido
                                </td>
                            </tr>
                        ) : (
                            productos.map((item, idx) => {
                                const nombre = item.producto?.nom_producto ?? item.nom_producto ?? 'N/A';
                                const precio = item.producto?.precio_unitario ?? item.precio_unitario ?? 0;
                                const cantidad = item.cantidad ?? 1;
                                return (
                                    <tr key={idx}>
                                        <td className="detalle-producto-nombre">{nombre}</td>
                                        <td className="detalle-producto-precio">{formatPrice(precio)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="detalle-producto-cantidad-badge">{cantidad}</span>
                                        </td>
                                        <td className="detalle-producto-subtotal">{formatPrice(Number(precio) * cantidad)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="detalle-total-label">TOTAL:</td>
                            <td className="detalle-total-valor">{formatPrice(obtenerTotal(d))}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Pago */}
                <div className="detalle-pago-box">
                    <div className="detalle-pago-info">
                        <div className="detalle-pago-metodo">
                            <strong>Método de Pago:</strong>{' '}
                            <span className="detalle-pago-metodo-valor">
                                {d.ticket_compra?.metodo_pago?.nom_metodo || 'Por_definir'}
                            </span>
                        </div>
                        <div className="detalle-pago-estado">
                            <strong>Estado de Pago:</strong>{' '}
                            <span className="detalle-estado-pago-badge">
                                {d.ticket_compra?.estado_pago?.nom_metodo || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ─── RENDER ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="dashboard-layout"><Sidebar /><main className="contenido"><HeaderPedidos />
            <div className="pedidos-loading"><p>Cargando pedidos...</p></div>
        </main></div>
    );

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
                                    <th>Items</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length === 0 ? (
                                    <tr><td colSpan="8" className="pedidos-tabla-vacia">No hay pedidos registrados todavía</td></tr>
                                ) : (
                                    pedidos.map((pedido) => (
                                        <React.Fragment key={pedido.id_pedido}>
                                            <tr>
                                                <td>
                                                    <strong className="pedido-id">#{pedido.id_pedido}</strong>
                                                    {pedido.ticket_compra?.num_ticket && (
                                                        <span className="pedido-ticket">Ticket: {pedido.ticket_compra.num_ticket}</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="pedido-cliente-nombre">
                                                        {pedido.usuario ? `${pedido.usuario.nom_1} ${pedido.usuario.ape_1}` : 'N/A'}
                                                    </div>
                                                    <span className="pedido-cliente-telefono">{pedido.usuario?.telefono?.toString() || 'N/A'}</span>
                                                </td>

                                                <td className="pedido-fecha">{formatFecha(pedido.fecha)}</td>

                                                {/* ESTADO */}
                                                <td>
                                                    {editandoId === pedido.id_pedido ? (
                                                        <select value={nuevoEstadoTemp} onChange={(e) => setNuevoEstadoTemp(e.target.value)} className="pedido-estado-select">
                                                            {opcionesEstado.map(op => <option key={op} value={op}>{op}</option>)}
                                                        </select>
                                                    ) : (
                                                        <span className={getEstadoClass(pedido.estado)}>{pedido.estado}</span>
                                                    )}
                                                </td>

                                                {/* MÉTODO PAGO */}
                                                <td className="pedido-metodo-pago">
                                                    {editandoMetodoId === pedido.id_pedido ? (
                                                        <select value={nuevoMetodoTemp} onChange={(e) => setNuevoMetodoTemp(e.target.value)} className="pedido-estado-select" disabled={procesandoMetodo}>
                                                            {opcionesMetodoPago.map(op => <option key={op} value={op}>{op}</option>)}
                                                        </select>
                                                    ) : (
                                                        <span className={
                                                            (!pedido.ticket_compra?.metodo_pago?.nom_metodo || pedido.ticket_compra?.metodo_pago?.nom_metodo === 'Por_definir')
                                                                ? 'pedido-estado-badge estado-pendiente'
                                                                : 'pedido-estado-badge estado-en-proceso'
                                                        }>
                                                            {pedido.ticket_compra?.metodo_pago?.nom_metodo || 'Por_definir'}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* TOTAL */}
                                                <td>
                                                    <strong className="pedido-total">{formatPrice(obtenerTotal(pedido))}</strong>
                                                </td>

                                                {/* ITEMS */}
                                                <td>
                                                    <span className="pedido-productos-badge">
                                                        {pedido.detalles_pedido?.length || 0} items
                                                    </span>
                                                </td>

                                                {/* ACCIONES */}
                                                <td>
                                                    <div className="pedido-acciones">
                                                        {editandoId === pedido.id_pedido ? (
                                                            <>
                                                                <button onClick={() => handleGuardarEstado(pedido.id_pedido)} className="btn-guardar">✓ Guardar</button>
                                                                <button onClick={handleCancelarEstado} className="btn-cancelar-edicion">✕ Cancelar</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => handleEditarEstado(pedido)} className="btn-editar-estado" disabled={editandoMetodoId === pedido.id_pedido}>
                                                                Editar Estado
                                                            </button>
                                                        )}

                                                        {editandoMetodoId === pedido.id_pedido ? (
                                                            <>
                                                                <button onClick={() => handleGuardarMetodo(pedido)} className="btn-guardar" disabled={procesandoMetodo} style={{ opacity: procesandoMetodo ? 0.6 : 1 }}>
                                                                    {procesandoMetodo ? '...' : '✓ Confirmar'}
                                                                </button>
                                                                <button onClick={handleCancelarMetodo} className="btn-cancelar-edicion" disabled={procesandoMetodo}>✕ Cancelar</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => handleEditarMetodo(pedido)} className="btn-editar-estado" disabled={editandoId === pedido.id_pedido} style={{ backgroundColor: '#3498db' }}>
                                                                Editar Pago
                                                            </button>
                                                        )}

                                                        <button onClick={() => cargarDetallePedido(pedido.id_pedido)} className={`btn-ver-detalles ${expandedPedido === pedido.id_pedido ? 'activo' : ''}`}>
                                                            {expandedPedido === pedido.id_pedido ? 'Ocultar' : 'Ver Detalles'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* ── FILA EXPANDIDA ── */}
                                            {expandedPedido === pedido.id_pedido && detallesPedido[pedido.id_pedido] && (
                                                <tr className="detalle-pedido-row">
                                                    <td colSpan="8">
                                                        {esPedidoPersonalizado(detallesPedido[pedido.id_pedido])
                                                            ? <DetallePersonalizado d={detallesPedido[pedido.id_pedido]} pedidoId={pedido.id_pedido} />
                                                            : <DetalleEstandar d={detallesPedido[pedido.id_pedido]} pedidoId={pedido.id_pedido} />
                                                        }
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