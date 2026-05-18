import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";
import axios from 'axios';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const API_URL = 'http://localhost:3001/api';

// Iconos SVG
const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const TrendingUpIcon = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity: 0.5}}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);

const PackageIcon = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity: 0.5}}>
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);

const ShoppingCartIcon = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity: 0.5}}>
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
);

const DollarSignIcon = ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity: 0.5}}>
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

const UsersIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const AlertTriangleIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const AwardIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
);

export default function Reportes() {
    const [loading, setLoading] = useState(false);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const [resumenGeneral, setResumenGeneral] = useState(null);
    const [ventasPorMetodoPago, setVentasPorMetodoPago] = useState([]);
    const [topClientes, setTopClientes] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [productosStockBajo, setProductosStockBajo] = useState([]);
    const [pedidosPorEstado, setPedidosPorEstado] = useState([]);
    const [ingresosPorPedido, setIngresosPorPedido] = useState([]);
    const [movimientosPorDia, setMovimientosPorDia] = useState([]);
    const [ventasPorOrigen, setVentasPorOrigen] = useState([]);
    const [resumenMensual, setResumenMensual] = useState([]);

    useEffect(() => {
        const hoy = new Date();
        const haceUnMes = new Date();
        haceUnMes.setMonth(haceUnMes.getMonth() - 1);
        
        setFechaHasta(hoy.toISOString().split('T')[0]);
        setFechaDesde(haceUnMes.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (fechaDesde && fechaHasta) {
            cargarDatos();
        }
    }, [fechaDesde, fechaHasta]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const params = { desde: fechaDesde, hasta: fechaHasta };

            const [resumenRes, porDiaRes, topProdRes, mensualRes, movimientosRes] = await Promise.all([
                axios.get(`${API_URL}/movimientos/resumen-general`, { params }),
                axios.get(`${API_URL}/movimientos/por-dia`, { params }),
                axios.get(`${API_URL}/movimientos/top-productos`, { params: { ...params, limit: 10 } }),
                axios.get(`${API_URL}/movimientos/resumen-mensual`),
                axios.get(`${API_URL}/movimientos`, { params: { ...params, limit: 1000 } })
            ]);

            setResumenGeneral(resumenRes.data);
            setMovimientosPorDia(porDiaRes.data);
            setResumenMensual(mensualRes.data);

            const prodVendidos = topProdRes.data
                .sort((a, b) => b.salidas - a.salidas)
                .slice(0, 10)
                .map(p => ({
                    producto: p.producto,
                    cantidad_vendida: p.salidas,
                    stock_actual: p.stock_actual
                }));
            setProductosMasVendidos(prodVendidos);

            const stockBajo = topProdRes.data
                .filter(p => p.stock_actual < p.stock_minimo || p.stock_actual < 5)
                .sort((a, b) => a.stock_actual - b.stock_actual)
                .slice(0, 5);
            setProductosStockBajo(stockBajo);

            procesarVentasPorOrigen(movimientosRes.data);
            await cargarDatosPedidos();

        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarDatosPedidos = async () => {
        try {
            const pedidosRes = await axios.get(`${API_URL}/pedidos/todos`);
            const pedidos = pedidosRes.data;

            const metodosPago = {};
            pedidos.forEach(pedido => {
                const metodo = pedido.metodo_pago || 'Sin definir';
                if (!metodosPago[metodo]) {
                    metodosPago[metodo] = { metodo, monto_total: 0, cantidad: 0 };
                }
                metodosPago[metodo].monto_total += parseFloat(pedido.total_ticket) || 0;
                metodosPago[metodo].cantidad += 1;
            });
            setVentasPorMetodoPago(Object.values(metodosPago));

            const clientes = {};
            pedidos.forEach(pedido => {
                const cliente = pedido.cliente || 'Sin nombre';
                const idCliente = pedido.id_usuario;
                if (!clientes[idCliente]) {
                    clientes[idCliente] = {
                        id_usuario: idCliente,
                        nombre: cliente,
                        telefono: pedido.telefono,
                        cantidad_pedidos: 0,
                        total_monto: 0
                    };
                }
                clientes[idCliente].cantidad_pedidos += 1;
                clientes[idCliente].total_monto += parseFloat(pedido.total_ticket) || 0;
            });
            const topCli = Object.values(clientes)
                .sort((a, b) => b.total_monto - a.total_monto)
                .slice(0, 3);
            setTopClientes(topCli);

            const estados = {};
            pedidos.forEach(pedido => {
                const estado = pedido.estado_pago || 'Sin estado';
                if (!estados[estado]) {
                    estados[estado] = { estado, cantidad: 0, monto: 0 };
                }
                estados[estado].cantidad += 1;
                estados[estado].monto += parseFloat(pedido.total_ticket) || 0;
            });
            setPedidosPorEstado(Object.values(estados));

            const ingresos = pedidos
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .slice(0, 10)
                .map(p => ({
                    id_pedido: p.id_pedido,
                    cliente: p.cliente,
                    fecha: new Date(p.fecha).toLocaleDateString(),
                    metodo: p.metodo_pago,
                    estado: p.estado_pago,
                    total: parseFloat(p.total_ticket) || 0
                }));
            setIngresosPorPedido(ingresos);

        } catch (error) {
            console.error('Error al cargar datos de pedidos:', error);
        }
    };

    const procesarVentasPorOrigen = (movimientos) => {
        const origen = { online: 0, manual: 0, admin: 0 };
        movimientos.forEach(mov => {
            if (mov.id_m === 'M-S') {
                const obs = mov.observaciones || '';
                if (obs.includes('Pedido #') || obs.includes('Venta Online')) {
                    origen.online++;
                } else if (obs.includes('Realizado por:')) {
                    origen.admin++;
                } else {
                    origen.manual++;
                }
            }
        });
        setVentasPorOrigen([
            { name: 'Ventas Online', value: origen.online, color: '#f596bdff' },
            { name: 'Ventas Manuales', value: origen.manual, color: '#ec4899' },
            { name: 'Ventas Admin', value: origen.admin, color: '#f59e0b' }
        ]);
    };

    const imprimirReporte = () => window.print();

    const encontrarDiaMasVentas = () => {
        if (!movimientosPorDia.length) return null;
        return movimientosPorDia.reduce((max, dia) => 
            dia.salidas > (max.salidas || 0) ? dia : max, {});
    };

    const encontrarMesMasVentas = () => {
        if (!resumenMensual.length) return null;
        return resumenMensual.reduce((max, mes) => 
            mes.salidas > (max.salidas || 0) ? mes : max, {});
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderPanel title="Reportes de Ventas" />
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>Generando reportes...</p>
                    </div>
                </main>
            </div>
        );
    }

    const diaMasVentas = encontrarDiaMasVentas();
    const mesMasVentas = encontrarMesMasVentas();

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="contenido">
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    @media print {
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                        .no-print { display: none !important; }
                        @page { margin: 1.5cm; size: letter; }
                    }
                    .tabla {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .tabla th, .tabla td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .tabla th {
                        background-color: #f9fafb;
                        font-weight: 600;
                        text-transform: uppercase;
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .tabla tbody tr:hover {
                        background-color: #f9fafb;
                    }
                `}</style>

                <HeaderPanel title="Reportes de Ventas" />

                {/* Filtros de fecha */}
                <section className="cuadro-blanco no-print" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Desde:
                            </label>
                            <input 
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Hasta:
                            </label>
                            <input 
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da'
                                }}
                            />
                        </div>
                        <button 
                            onClick={imprimirReporte}
                            style={{
                                padding: '10px 20px',
                                background: '#f596bdff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '20px',
                                fontWeight: '500'
                            }}
                        >
                            Imprimir Reporte
                        </button>
                    </div>
                </section>

                {/* Tarjetas de resumen */}
                {resumenGeneral && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                            color: 'white',
                            padding: '25px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Entradas</div>
                                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                                        {resumenGeneral.totalEntradas || 0}
                                    </div>
                                    <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>unidades recibidas</div>
                                </div>
                                <TrendingUpIcon />
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                            color: 'white',
                            padding: '25px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Salidas</div>
                                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                                        {resumenGeneral.totalSalidas || 0}
                                    </div>
                                    <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>unidades vendidas</div>
                                </div>
                                <ShoppingCartIcon />
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                            color: 'white',
                            padding: '25px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Balance Neto</div>
                                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                                        {(resumenGeneral.totalEntradas || 0) - (resumenGeneral.totalSalidas || 0)}
                                    </div>
                                    <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>diferencia</div>
                                </div>
                                <PackageIcon />
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #f596bdff 0%, #ec4899 100%)',
                            color: 'white',
                            padding: '25px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Valor Total</div>
                                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                                        ${(ventasPorMetodoPago.reduce((sum, m) => sum + m.monto_total, 0) || 0).toLocaleString('es-CO')}
                                    </div>
                                    <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>en ventas</div>
                                </div>
                                <DollarSignIcon />
                            </div>
                        </div>
                    </div>
                )}

                {/* Períodos Destacados */}
                {(diaMasVentas?.fecha || mesMasVentas?.mes) && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px',
                        borderLeft: '4px solid #f59e0b'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AwardIcon size={24} />                            Períodos Destacados
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                            {diaMasVentas?.fecha && (
                                <div style={{
                                    background: 'linear-gradient(to bottom right, #fef3c7, #fde68a)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    border: '2px solid #fbbf24'
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', textTransform: 'uppercase' }}>
                                        Día con más ventas
                                    </p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#78350f', marginTop: '8px' }}>
                                        {new Date(diaMasVentas.fecha).toLocaleDateString('es-CO', { 
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                                        })}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#92400e', marginTop: '8px', fontWeight: '500' }}>
                                        {diaMasVentas.salidas} unidades vendidas
                                    </p>
                                </div>
                            )}
                            
                            {mesMasVentas?.mes && (
                                <div style={{
                                    background: 'linear-gradient(to bottom right, #fae8ff, #f3e8ff)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    border: '2px solid #d946ef'
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#701a75', textTransform: 'uppercase' }}>
                                        Mes con más ventas
                                    </p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#581c87', marginTop: '8px' }}>
                                        {mesMasVentas.mes}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#701a75', marginTop: '8px', fontWeight: '500' }}>
                                        {mesMasVentas.salidas} unidades vendidas
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Gráficos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                    {ventasPorOrigen.length > 0 && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            padding: '24px'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShoppingCartIcon size={20} />                                Origen de Ventas
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={ventasPorOrigen}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name.split(' ')[1]}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        {ventasPorOrigen.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ marginTop: '16px' }}>
                                {ventasPorOrigen.map((origen, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: origen.color }} />
                                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{origen.name}</span>
                                        </div>
                                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{origen.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {ventasPorMetodoPago.length > 0 && (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            padding: '24px'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DollarSignIcon size={20} />                                Ventas por Método de Pago
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={ventasPorMetodoPago}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="metodo" tick={{ fontSize: 11 }} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `$${value.toLocaleString('es-CO')}`} />
                                    <Bar dataKey="monto_total" fill="#f596bdff" name="Monto Total" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                                    Total recaudado: <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                                        ${ventasPorMetodoPago.reduce((sum, m) => sum + m.monto_total, 0).toLocaleString('es-CO')}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* Top 3 Clientes */}
                {topClientes.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px',
                        borderLeft: '4px solid #2196f3'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UsersIcon size={24} />                            Top 3 Mejores Clientes
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                            {topClientes.map((cliente, idx) => (
                                <div key={idx} style={{
                                    background: idx === 0 ? 'linear-gradient(to bottom right, #fbbf24, #f59e0b)' :
                                            idx === 1 ? 'linear-gradient(to bottom right, #9ca3af, #6b7280)' :
                                            'linear-gradient(to bottom right, #fb923c, #f97316)',
                                    color: 'white',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                                            {idx === 0 ? '1' : idx === 1 ? '2' : '3'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{cliente.nombre}</p>
                                            <p style={{ fontSize: '14px', opacity: 0.9 }}>{cliente.telefono}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', opacity: 0.9 }}>
                                            Pedidos: <span style={{ fontWeight: 'bold' }}>{cliente.cantidad_pedidos}</span>
                                        </p>
                                        <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>
                                            ${cliente.total_monto.toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top 10 Productos */}
                {productosMasVendidos.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingUpIcon size={24} />                            Top 10 Productos Más Vendidos
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={productosMasVendidos} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="producto" type="category" width={150} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="cantidad_vendida" fill="#f596bdff" name="Unidades Vendidas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Stock Bajo */}
                {productosStockBajo.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px',
                        borderLeft: '4px solid #f44336'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangleIcon size={24} />                            Alerta: Productos con Stock Bajo
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th style={{ textAlign: 'center' }}>Stock Actual</th>
                                        <th style={{ textAlign: 'center' }}>Stock Mínimo</th>
                                        <th style={{ textAlign: 'center' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosStockBajo.map((prod, idx) => (
                                        <tr key={idx}>
                                            <td style={{ fontWeight: '500' }}>{prod.producto}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>
                                                    {prod.stock_actual}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', color: '#6b7280' }}>
                                                {prod.stock_minimo}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#fee2e2',
                                                    color: '#991b1b',
                                                    borderRadius: '9999px'
                                                }}>
                                                    URGENTE
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Ventas por Día */}
                {movimientosPorDia.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                            Reporte de Ventas por Día
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={movimientosPorDia}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="entradas" fill="#10b981" name="Entradas" stackId="a" />
                                <Bar dataKey="salidas" fill="#f596bdff" name="Salidas" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Tendencia Mensual */}
                {resumenMensual.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                            Tendencia de Ventas Mensual
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={resumenMensual}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={3} name="Entradas" />
                                <Line type="monotone" dataKey="salidas" stroke="#f596bdff" strokeWidth={3} name="Salidas" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Últimos Pedidos */}
                {ingresosPorPedido.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <DollarSignIcon size={24} />                            Últimos 10 Ingresos por Pedido
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Pedido</th>
                                        <th>Cliente</th>
                                        <th>Fecha</th>
                                        <th>Método</th>
                                        <th>Estado</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingresosPorPedido.map((pedido, idx) => (
                                        <tr key={idx}>
                                            <td style={{ fontWeight: 'bold', color: '#f596bdff' }}>
                                                #{pedido.id_pedido}
                                            </td>
                                            <td>{pedido.cliente}</td>
                                            <td style={{ color: '#6b7280' }}>{pedido.fecha}</td>
                                            <td style={{ color: '#6b7280' }}>{pedido.metodo}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    borderRadius: '4px',
                                                    backgroundColor: pedido.estado === 'Pagado' ? '#d1fae5' : pedido.estado === 'Pendiente' ? '#fef3c7' : '#dbeafe',
                                                    color: pedido.estado === 'Pagado' ? '#065f46' : pedido.estado === 'Pendiente' ? '#92400e' : '#1e40af'
                                                }}>
                                                    {pedido.estado}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                ${pedido.total.toLocaleString('es-CO')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot style={{ backgroundColor: '#f9fafb' }}>
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', color: '#374151' }}>
                                            Total:
                                        </td>
                                        <td style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                                            ${ingresosPorPedido.reduce((sum, p) => sum + p.total, 0).toLocaleString('es-CO')}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* Pedidos por Estado */}
                {pedidosPorEstado.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        padding: '24px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                            Pedidos por Estado de Pago
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {pedidosPorEstado.map((estado, idx) => (
                                <div key={idx} style={{
                                    borderRadius: '8px',
                                    padding: '20px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    backgroundColor: estado.estado === 'Pagado' ? '#d1fae5' : estado.estado === 'Pendiente' ? '#fef3c7' : '#dbeafe',
                                    borderLeft: `4px solid ${estado.estado === 'Pagado' ? '#10b981' : estado.estado === 'Pendiente' ? '#f59e0b' : '#3b82f6'}`
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                                        {estado.estado}
                                    </p>
                                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>
                                        {estado.cantidad}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>pedidos</p>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151', marginTop: '8px' }}>
                                        ${estado.monto.toLocaleString('es-CO')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
                    <p style={{ fontWeight: '600' }}>Sistema de Gestión de Inventario - Gurama Online</p>
                    <p style={{ marginTop: '4px' }}>
                        Reporte generado automáticamente el {new Date().toLocaleString('es-CO')}
                    </p>
                </div>
            </main> 
        </div>
    );
};