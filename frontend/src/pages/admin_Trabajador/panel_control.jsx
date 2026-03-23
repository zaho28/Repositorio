import React from "react";
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/css/styles.css";
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────
//  SUBCOMPONENTE: HISTORIAL DE VENTAS
// ─────────────────────────────────────────────
const API_URL = 'http://localhost:3000'; 

function HistorialVentas() {
    const [estadisticas, setEstadisticas] = React.useState({
        totalEntradas: 0,
        totalSalidas: 0,
        productosMasMovidos: [],
        resumenMensual: []
    });
    const [cargando, setCargando] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rangoFechas, setRangoFechas] = React.useState({
        desde: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        hasta: new Date().toISOString().split('T')[0]
    });

    const fetchEstadisticas = async () => {
        try {
            setCargando(true);
            setError(null);
            const [resumenGeneral, , , topProductos, resumenMensual] = await Promise.all([
                axios.get(`${API_MOV}/resumen-general`, { params: rangoFechas }),
                axios.get(`${API_MOV}/por-dia`, { params: rangoFechas }),
                axios.get(`${API_MOV}/por-tipo`, { params: rangoFechas }),
                axios.get(`${API_MOV}/top-productos`, { params: { ...rangoFechas, limit: 10 } }),
                axios.get(`${API_MOV}/resumen-mensual`)
            ]);
            setEstadisticas({
                totalEntradas: resumenGeneral.data.totalEntradas || 0,
                totalSalidas: resumenGeneral.data.totalSalidas || 0,
                productosMasMovidos: topProductos.data || [],
                resumenMensual: resumenMensual.data || []
            });
        } catch {
            setError("Error al cargar las estadísticas. Verifica que el backend esté funcionando.");
        } finally {
            setCargando(false);
        }
    };

    React.useEffect(() => { fetchEstadisticas(); }, [rangoFechas]);

    if (cargando) return <p className="panel-loading">Cargando estadísticas...</p>;
    if (error) return (
        <div className="panel-error">
            <p>{error}</p>
            <button className="btn-registrar" onClick={fetchEstadisticas}>Reintentar</button>
        </div>
    );

    return (
        <div>
            {/* Filtros de fecha */}
            <div className="panel-filtros-fila">
                <div>
                    <label className="filtro-label">Desde:</label>
                    <input type="date" value={rangoFechas.desde}
                        onChange={(e) => setRangoFechas(p => ({ ...p, desde: e.target.value }))}
                        className="filtro-date-input" />
                </div>
                <div>
                    <label className="filtro-label">Hasta:</label>
                    <input type="date" value={rangoFechas.hasta}
                        onChange={(e) => setRangoFechas(p => ({ ...p, hasta: e.target.value }))}
                        className="filtro-date-input" />
                </div>
                <button className="btn-registrar" onClick={fetchEstadisticas}>Actualizar</button>
            </div>

            {/* Tarjetas resumen */}
            <div className="panel-stats-grid">
                <div className="panel-stat-card verde">
                    <div className="panel-stat-label">Total Entradas</div>
                    <div className="panel-stat-value">{estadisticas.totalEntradas.toLocaleString()}</div>
                    <div className="panel-stat-sub">unidades recibidas</div>
                </div>
                <div className="panel-stat-card rojo">
                    <div className="panel-stat-label">Total Salidas</div>
                    <div className="panel-stat-value">{estadisticas.totalSalidas.toLocaleString()}</div>
                    <div className="panel-stat-sub">unidades vendidas</div>
                </div>
            </div>

            {/* Gráfico mensual */}
            <div className="panel-chart-box">
                <h3 className="panel-chart-titulo">Resumen Mensual (Último Año)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={estadisticas.resumenMensual}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="entradas" fill="#4caf50" name="Entradas" />
                        <Bar dataKey="salidas" fill="#f44336" name="Salidas" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla productos más movidos */}
            <div className="panel-chart-box">
                <h3 className="panel-chart-titulo">Productos Más Movidos</h3>
                <div className="tabla-scroll">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Total Movimientos</th>
                                <th>Entradas</th>
                                <th>Salidas</th>
                                <th>Stock Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estadisticas.productosMasMovidos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="tabla-vacia-mensaje">No hay datos para mostrar</td>
                                </tr>
                            ) : estadisticas.productosMasMovidos.map((prod, i) => (
                                <tr key={prod.id_producto}>
                                    <td>{i + 1}</td>
                                    <td>{prod.producto}</td>
                                    <td><strong>{prod.total_movimientos}</strong></td>
                                    <td className="celda-entrada">+{prod.entradas || 0}</td>
                                    <td className="celda-salida">-{prod.salidas || 0}</td>
                                    <td>
                                        <span className={`stock-badge ${prod.stock_actual <= prod.stock_minimo ? 'stock-bajo' : 'stock-ok'}`}>
                                            {prod.stock_actual}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  SUBCOMPONENTE: NOTIFICACIONES
// ─────────────────────────────────────────────

const NOTIF_FILTROS = [
    { key: 'todas',      clase: 'activo-todas',      label: 'Todas',      tipo: null },
    { key: 'stock-bajo', clase: 'activo-stockbajo',   label: 'Stock Bajo', tipo: 'stock-bajo' },
    { key: 'agotado',    clase: 'activo-agotado',     label: 'Agotados',   tipo: 'agotado' },
    { key: 'pedidos',    clase: 'activo-pedidos',     label: 'Pedidos',    tipo: 'pedido' },
];

const BADGE_TIPO = {
    'stock-bajo': { bg: '#fff3cd', color: '#856404', label: 'Stock Bajo' },
    'agotado':    { bg: '#f8d7da', color: '#721c24', label: 'Agotado' },
    'pedido':     { bg: '#d1ecf1', color: '#0c5460', label: 'Pedido' },
};

function Notificaciones() {
    const [notificaciones, setNotificaciones] = React.useState([]);
    const [estadisticas, setEstadisticas] = React.useState(null);
    const [filtro, setFiltro] = React.useState('todas');
    const [cargando, setCargando] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        cargarNotificaciones();
        cargarEstadisticas();
        const interval = setInterval(cargarNotificaciones, 30000);
        return () => clearInterval(interval);
    }, []);

    const cargarNotificaciones = async () => {
        try {
            setCargando(true);
            const res = await axios.get(API_NOTIF);
            setNotificaciones(res.data);
            setError(null);
        } catch {
            setError("No se pudieron cargar las notificaciones");
        } finally {
            setCargando(false);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const res = await axios.get(`${API_NOTIF}/estadisticas`);
            setEstadisticas(res.data);
        } catch {}
    };

    const getFiltroPorKey = (key) => NOTIF_FILTROS.find(f => f.key === key);
    const filtradas = notificaciones.filter(n => {
        const f = getFiltroPorKey(filtro);
        return filtro === 'todas' || n.tipo === f?.tipo;
    });
    const countPor = (key) => {
        const f = getFiltroPorKey(key);
        return key === 'todas' ? notificaciones.length : notificaciones.filter(n => n.tipo === f?.tipo).length;
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const diffMins = Math.floor((new Date() - date) / 60000);
        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours}h`;
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    };

    const getBadge = (tipo) => BADGE_TIPO[tipo] || { bg: '#e2e3e5', color: '#383d41', label: 'Info' };

    return (
        <div>
            {/* Tarjetas de estadísticas */}
            {estadisticas && (
                <div className="panel-stats-grid">
                    <div className="panel-stat-card amarillo">
                        <div className="panel-stat-label notif-label-amarillo">Stock Bajo</div>
                        <div className="panel-stat-value notif-valor-amarillo">{estadisticas.productos_stock_bajo}</div>
                    </div>
                    <div className="panel-stat-card rojo-claro">
                        <div className="panel-stat-label notif-label-rojo">Agotados</div>
                        <div className="panel-stat-value notif-valor-rojo">{estadisticas.productos_agotados}</div>
                    </div>
                    <div className="panel-stat-card cyan">
                        <div className="panel-stat-label notif-label-cyan">Pedidos Hoy</div>
                        <div className="panel-stat-value notif-valor-cyan">{estadisticas.pedidos_hoy}</div>
                    </div>
                    <div className="panel-stat-card verde-claro">
                        <div className="panel-stat-label notif-label-verde">Pedidos (7 días)</div>
                        <div className="panel-stat-value notif-valor-verde">{estadisticas.pedidos_semana}</div>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="notif-filtros-fila">
                {NOTIF_FILTROS.map(({ key, clase, label }) => (
                    <button
                        key={key}
                        className={`btn-notif-filtro ${filtro === key ? clase : ''}`}
                        onClick={() => setFiltro(key)}
                    >
                        {label} ({countPor(key)})
                    </button>
                ))}
                <button className="btn-notif-actualizar" onClick={cargarNotificaciones}>
                    Actualizar
                </button>
            </div>

            {/* Contenido */}
            {cargando ? (
                <p className="panel-loading">Cargando notificaciones...</p>
            ) : error ? (
                <p className="panel-error">{error}</p>
            ) : filtradas.length === 0 ? (
                <div className="tabla-vacia-mensaje">
                    No hay notificaciones {filtro !== 'todas' ? `de tipo "${filtro}"` : ''}
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="tabla">
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
                            {filtradas.map((notif, i) => {
                                const b = getBadge(notif.tipo);
                                return (
                                    <tr key={notif.id_notificacion}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <span className="notif-tipo-badge"
                                                style={{ backgroundColor: b.bg, color: b.color }}>
                                                {b.label}
                                            </span>
                                        </td>
                                        <td><strong>{notif.mensaje}</strong></td>
                                        <td>
                                            <div>{notif.detalles}</div>
                                            {notif.stock_actual != null && (
                                                <small className={notif.stock_actual === 0 ? 'texto-sin-stock' : 'texto-stock-bajo'}>
                                                    {notif.stock_actual === 0
                                                        ? 'SIN STOCK'
                                                        : `Stock: ${notif.stock_actual} (Mín: ${notif.stock_minimo})`}
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            <small className="mov-usuario-id">{formatearFecha(notif.fecha)}</small>
                                        </td>
                                        <td>
                                            <Link to={notif.ruta_destino}>
                                                <button className={`btn-filtro-mov ${notif.tipo === 'pedido' ? 'todos activo' : 'entradas activo'}`}>
                                                    {notif.tipo === 'pedido' ? 'Ir a pedidos' : 'Ir a movimientos'}
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
//  SUBCOMPONENTE: REPORTES
// ─────────────────────────────────────────────
const TARJETAS_CLIENTES = ['oro', 'plata', 'bronce'];

function Reportes() {
    const [loading, setLoading] = React.useState(false);
    const [fechaDesde, setFechaDesde] = React.useState('');
    const [fechaHasta, setFechaHasta] = React.useState('');
    const [resumenGeneral, setResumenGeneral] = React.useState(null);
    const [ventasPorMetodoPago, setVentasPorMetodoPago] = React.useState([]);
    const [topClientes, setTopClientes] = React.useState([]);
    const [productosStockBajo, setProductosStockBajo] = React.useState([]);
    const [ingresosPorPedido, setIngresosPorPedido] = React.useState([]);
    const [resumenMensual, setResumenMensual] = React.useState([]);
    const [ventasPorOrigen, setVentasPorOrigen] = React.useState([]);

    React.useEffect(() => {
        const hoy = new Date();
        const haceUnMes = new Date();
        haceUnMes.setMonth(haceUnMes.getMonth() - 1);
        setFechaHasta(hoy.toISOString().split('T')[0]);
        setFechaDesde(haceUnMes.toISOString().split('T')[0]);
    }, []);

    React.useEffect(() => {
        if (fechaDesde && fechaHasta) cargarDatos();
    }, [fechaDesde, fechaHasta]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const params = { desde: fechaDesde, hasta: fechaHasta };
            const [resumenRes, topProdRes, mensualRes, movimientosRes] = await Promise.all([
                axios.get(`${API_REP}/movimientos/resumen-general`, { params }),
                axios.get(`${API_REP}/movimientos/top-productos`, { params: { ...params, limit: 10 } }),
                axios.get(`${API_REP}/movimientos/resumen-mensual`),
                axios.get(`${API_REP}/movimientos`, { params: { ...params, limit: 1000 } })
            ]);
            setResumenGeneral(resumenRes.data);
            setResumenMensual(mensualRes.data);
            setProductosStockBajo(topProdRes.data
                .filter(p => p.stock_actual < p.stock_minimo || p.stock_actual < 5)
                .sort((a, b) => a.stock_actual - b.stock_actual).slice(0, 5));

            const origen = { online: 0, manual: 0, admin: 0 };
            movimientosRes.data.forEach(mov => {
                if (mov.id_m === 'M-S') {
                    const obs = mov.observaciones || '';
                    if (obs.includes('Pedido #') || obs.includes('Venta Online')) origen.online++;
                    else if (obs.includes('Realizado por:')) origen.admin++;
                    else origen.manual++;
                }
            });
            setVentasPorOrigen([
                { name: 'Online', value: origen.online, color: '#c45a77' },
                { name: 'Manual', value: origen.manual, color: '#ec4899' },
                { name: 'Admin',  value: origen.admin,  color: '#f59e0b' }
            ]);
            await cargarDatosPedidos();
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const cargarDatosPedidos = async () => {
        try {
            const pedidosRes = await axios.get(`${API_REP}/pedidos/todos`);
            const pedidos = pedidosRes.data;

            const metodosPago = {};
            pedidos.forEach(p => {
                const m = p.metodo_pago || 'Sin definir';
                if (!metodosPago[m]) metodosPago[m] = { metodo: m, monto_total: 0, cantidad: 0 };
                metodosPago[m].monto_total += parseFloat(p.total_ticket) || 0;
                metodosPago[m].cantidad += 1;
            });
            setVentasPorMetodoPago(Object.values(metodosPago));

            const clientes = {};
            pedidos.forEach(p => {
                const id = p.id_usuario;
                if (!clientes[id]) clientes[id] = { id_usuario: id, nombre: p.cliente, telefono: p.telefono, cantidad_pedidos: 0, total_monto: 0 };
                clientes[id].cantidad_pedidos += 1;
                clientes[id].total_monto += parseFloat(p.total_ticket) || 0;
            });
            setTopClientes(Object.values(clientes).sort((a, b) => b.total_monto - a.total_monto).slice(0, 3));

            setIngresosPorPedido(pedidos
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10)
                .map(p => ({
                    id_pedido: p.id_pedido, cliente: p.cliente,
                    fecha: new Date(p.fecha).toLocaleDateString(),
                    metodo: p.metodo_pago, estado: p.estado_pago,
                    total: parseFloat(p.total_ticket) || 0
                })));
        } catch (e) { console.error(e); }
    };

    const getEstadoClase = (estado) => {
        if (estado === 'Pagado')   return 'pedido-estado-pagado';
        if (estado === 'Pendiente') return 'pedido-estado-pendiente';
        return 'pedido-estado-otro';
    };

    const totalVentas  = ventasPorMetodoPago.reduce((s, m) => s + m.monto_total, 0);
    const totalPedidos = ingresosPorPedido.reduce((s, p) => s + p.total, 0);

    if (loading) return <p className="panel-loading">Generando reportes...</p>;

    return (
        <div>
            {/* Filtros */}
            <div className="panel-filtros-fila">
                <div>
                    <label className="filtro-label">Desde:</label>
                    <input type="date" value={fechaDesde}
                        onChange={e => setFechaDesde(e.target.value)}
                        className="filtro-date-input" />
                </div>
                <div>
                    <label className="filtro-label">Hasta:</label>
                    <input type="date" value={fechaHasta}
                        onChange={e => setFechaHasta(e.target.value)}
                        className="filtro-date-input" />
                </div>
                <button className="btn-registrar" onClick={() => window.print()}>
                    Imprimir Reporte
                </button>
            </div>

            {/* Tarjetas */}
            {resumenGeneral && (
                <div className="panel-stats-grid">
                    <div className="panel-stat-card verde">
                        <div className="panel-stat-label">Total Entradas</div>
                        <div className="panel-stat-value">{resumenGeneral.totalEntradas || 0}</div>
                        <div className="panel-stat-sub">unidades recibidas</div>
                    </div>
                    <div className="panel-stat-card rojo">
                        <div className="panel-stat-label">Total Salidas</div>
                        <div className="panel-stat-value">{resumenGeneral.totalSalidas || 0}</div>
                        <div className="panel-stat-sub">unidades vendidas</div>
                    </div>
                    <div className="panel-stat-card azul">
                        <div className="panel-stat-label">Balance Neto</div>
                        <div className="panel-stat-value">
                            {(resumenGeneral.totalEntradas || 0) - (resumenGeneral.totalSalidas || 0)}
                        </div>
                        <div className="panel-stat-sub">diferencia</div>
                    </div>
                    <div className="panel-stat-card rosa">
                        <div className="panel-stat-label">Valor Total</div>
                        <div className="panel-stat-value panel-stat-value-sm">
                            ${totalVentas.toLocaleString('es-CO')}
                        </div>
                        <div className="panel-stat-sub">en ventas</div>
                    </div>
                </div>
            )}

            {/* Top 3 Clientes */}
            {topClientes.length > 0 && (
                <div className="panel-chart-box">
                    <h3 className="panel-chart-titulo">Top 3 Mejores Clientes</h3>
                    <div className="panel-top-clientes-grid">
                        {topClientes.map((cliente, idx) => (
                            <div key={idx} className={`panel-cliente-card ${TARJETAS_CLIENTES[idx]}`}>
                                <div className="panel-cliente-puesto">{idx + 1}</div>
                                <div className="panel-cliente-nombre">{cliente.nombre}</div>
                                <div className="panel-cliente-telefono">{cliente.telefono}</div>
                                <div className="panel-cliente-monto">${cliente.total_monto.toLocaleString('es-CO')}</div>
                                <div className="panel-cliente-pedidos">{cliente.cantidad_pedidos} pedidos</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gráficos */}
            <div className="panel-graficos-grid">
                {ventasPorOrigen.length > 0 && (
                    <div className="panel-chart-box">
                        <h3 className="panel-chart-titulo">Origen de Ventas</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={ventasPorOrigen} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                                    {ventasPorOrigen.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
                {ventasPorMetodoPago.length > 0 && (
                    <div className="panel-chart-box">
                        <h3 className="panel-chart-titulo">Ventas por Método de Pago</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={ventasPorMetodoPago}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="metodo" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip formatter={v => `$${v.toLocaleString('es-CO')}`} />
                                <Bar dataKey="monto_total" fill="#c45a77" name="Monto Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Tendencia mensual */}
            {resumenMensual.length > 0 && (
                <div className="panel-chart-box">
                    <h3 className="panel-chart-titulo">Tendencia de Ventas Mensual</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={resumenMensual}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={3} name="Entradas" />
                            <Line type="monotone" dataKey="salidas"  stroke="#c45a77" strokeWidth={3} name="Salidas" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Stock bajo */}
            {productosStockBajo.length > 0 && (
                <div className="panel-chart-box alerta">
                    <h3 className="panel-chart-titulo danger">⚠ Productos con Stock Bajo</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Stock Actual</th>
                                    <th>Stock Mínimo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosStockBajo.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.producto}</td>
                                        <td className="celda-center">
                                            <span className="stock-badge stock-bajo">{p.stock_actual}</span>
                                        </td>
                                        <td className="celda-center celda-gris">{p.stock_minimo}</td>
                                        <td className="celda-center">
                                            <span className="badge-urgente">URGENTE</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Últimos pedidos */}
            {ingresosPorPedido.length > 0 && (
                <div className="panel-chart-box">
                    <h3 className="panel-chart-titulo">Últimos 10 Ingresos por Pedido</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Pedido</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Método</th>
                                    <th>Estado</th>
                                    <th className="celda-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingresosPorPedido.map((p, i) => (
                                    <tr key={i}>
                                        <td className="celda-id-pedido">#{p.id_pedido}</td>
                                        <td>{p.cliente}</td>
                                        <td className="celda-gris">{p.fecha}</td>
                                        <td className="celda-gris">{p.metodo}</td>
                                        <td>
                                            <span className={`pedido-estado-inline ${getEstadoClase(p.estado)}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="celda-right celda-bold">${p.total.toLocaleString('es-CO')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="5" className="celda-right celda-bold celda-gris-oscuro">Total:</td>
                                    <td className="celda-right celda-total-verde">${totalPedidos.toLocaleString('es-CO')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="panel-reporte-footer">
                <p>Sistema de Gestión de Inventario — Gurama Online</p>
                <p>Reporte generado el {new Date().toLocaleString('es-CO')}</p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: PANEL DE CONTROL
// ─────────────────────────────────────────────
const OPCIONES_PANEL = [
    { key: 'reportes',         label: 'Reportes' },
    { key: 'historial_ventas', label: 'Historial de ventas' },
    { key: 'notificaciones',   label: 'Notificaciones' },
];

export default function PanelControl() {
    const [activo, setActivo] = React.useState(null);

    const handleOpcion = (key) => setActivo(prev => prev === key ? null : key);

    const renderContenido = () => {
        switch (activo) {
            case 'reportes':         return <Reportes />;
            case 'historial_ventas': return <HistorialVentas />;
            case 'notificaciones':   return <Notificaciones />;
            default: return (
                <div className="panel-placeholder">
                    <div className="panel-placeholder-icono">☝</div>
                    <p>Seleccione una opción para ver su contenido aquí</p>
                </div>
            );
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="contenido">
                <HeaderPanel />

                {/* Selector — border-radius solo arriba, se fusiona con cuadro-blanco */}
                <section className="opciones panel-selector">
                    <h2>Selecciona una opción</h2>
                    <div className="opciones-botones">
                        {OPCIONES_PANEL.map(({ key, label }) => (
                            <div
                                key={key}
                                className={`opcion ${activo === key ? 'opcion-activa' : ''}`}
                                onClick={() => handleOpcion(key)}
                            >
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contenido dinámico — border-radius solo abajo */}
                <section className="cuadro-blanco panel-contenido">
                    {renderContenido()}
                </section>
            </main>
        </div>
    );
}