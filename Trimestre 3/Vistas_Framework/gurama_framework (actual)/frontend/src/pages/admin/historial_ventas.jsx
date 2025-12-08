import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API_URL = "http://localhost:3001/api/movimientos";

export default function HistorialVentas() {
    const [estadisticas, setEstadisticas] = useState({
        totalEntradas: 0,
        totalSalidas: 0,
        movimientosPorDia: [],
        movimientosPorTipo: [],
        productosMasMovidos: [],
        resumenMensual: []
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [rangoFechas, setRangoFechas] = useState({
        desde: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        hasta: new Date().toISOString().split('T')[0]
    });

    const fetchEstadisticas = async () => {
        try {
            setCargando(true);
            setError(null);

            // Hacer múltiples consultas en paralelo
            const [
                resumenGeneral,
                movimientosDiarios,
                movimientosTipo,
                topProductos,
                resumenMensual
            ] = await Promise.all([
                axios.get(`${API_URL}/resumen-general`, {
                    params: rangoFechas
                }),
                axios.get(`${API_URL}/por-dia`, {
                    params: rangoFechas
                }),
                axios.get(`${API_URL}/por-tipo`, {
                    params: rangoFechas
                }),
                axios.get(`${API_URL}/top-productos`, {
                    params: { ...rangoFechas, limit: 10 }
                }),
                axios.get(`${API_URL}/resumen-mensual`)
            ]);

            setEstadisticas({
                totalEntradas: resumenGeneral.data.totalEntradas || 0,
                totalSalidas: resumenGeneral.data.totalSalidas || 0,
                movimientosPorDia: movimientosDiarios.data || [],
                movimientosPorTipo: movimientosTipo.data || [],
                productosMasMovidos: topProductos.data || [],
                resumenMensual: resumenMensual.data || []
            });

        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
            setError("Error al cargar las estadísticas. Verifica que el backend esté funcionando.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchEstadisticas();
    }, [rangoFechas]);

    const COLORS = {
        entrada: '#4caf50',
        salida: '#f44336',
        primary: '#f596bdff',
    };

    const PIE_COLORS = ['#f596bdff', '#f44336', '#4caf50'];

    if (cargando) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderPanel title="Historial de Ventas" />
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>Cargando estadísticas...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderPanel title="Historial de Ventas" />
                    <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                        <p>{error}</p>
                        <button onClick={fetchEstadisticas} style={{
                            padding: '10px 20px',
                            marginTop: '15px',
                            cursor: 'pointer'
                        }}>
                            Reintentar
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="contenido">
                <HeaderPanel title=" Historial de Ventas y Movimientos" />

                {/* Filtros de fecha */}
                <section className="cuadro-blanco" style={{ marginBottom: '20px' }}>
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Desde:
                            </label>
                            <input 
                                type="date"
                                value={rangoFechas.desde}
                                onChange={(e) => setRangoFechas(prev => ({
                                    ...prev,
                                    desde: e.target.value
                                }))}
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
                                value={rangoFechas.hasta}
                                onChange={(e) => setRangoFechas(prev => ({
                                    ...prev,
                                    hasta: e.target.value
                                }))}
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da'
                                }}
                            />
                        </div>
                        <button 
                            onClick={fetchEstadisticas}
                            style={{
                                padding: '10px 20px',
                                background: '#f596bdff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '20px'
                            }}
                        >
                            Actualizar
                        </button>
                    </div>
                </section>

                {/* Tarjetas de resumen */}
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
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Entradas</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                            {estadisticas.totalEntradas.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                            unidades recibidas
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        color: 'white',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Salidas</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '10px' }}>
                            {estadisticas.totalSalidas.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                            unidades vendidas
                        </div>
                    </div>
                </div>

                {/* Gráfico de barras: Resumen mensual */}
                <section className="cuadro-blanco">
                    <h2 style={{ marginBottom: '20px' }}>Resumen Mensual (Último Año)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={estadisticas.resumenMensual}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="entradas" fill={COLORS.entrada} name="Entradas" />
                            <Bar dataKey="salidas" fill={COLORS.salida} name="Salidas" />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* Tabla de detalles */}
                <section className="cuadro-blanco">
                    <h2 style={{ marginBottom: '20px' }}>Detalle de Productos Más Movidos</h2>
                    <div style={{ overflowX: 'auto' }}>
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
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                            No hay datos para mostrar
                                        </td>
                                    </tr>
                                ) : (
                                    estadisticas.productosMasMovidos.map((prod, index) => (
                                        <tr key={prod.id_producto}>
                                            <td>{index + 1}</td>
                                            <td>{prod.producto}</td>
                                            <td><strong>{prod.total_movimientos}</strong></td>
                                            <td style={{ color: COLORS.entrada }}>
                                                +{prod.entradas || 0}
                                            </td>
                                            <td style={{ color: COLORS.salida }}>
                                                -{prod.salidas || 0}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: prod.stock_actual <= prod.stock_minimo ? '#ffebee' : '#e8f5e9',
                                                    color: prod.stock_actual <= prod.stock_minimo ? '#c62828' : '#2e7d32',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {prod.stock_actual}
                                                </span>
                                            </td>
                                        </tr>
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