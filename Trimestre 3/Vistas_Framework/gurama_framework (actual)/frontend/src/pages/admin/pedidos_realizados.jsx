// src/pages/PedidosRealizados.jsx
import React, { useState } from 'react';
// Asegúrate de que las rutas de tus componentes sean correctas
import Sidebar from "../../components/Sidebar_p-a"; 
import HeaderPedidos from "../../components/HeaderPedidos"; 

// --- Datos de ejemplo (simulando una llamada a una API) ---
const pedidosIniciales = [
    {
        id: '01',
        cliente: 'Maria Lopez',
        fecha: '20/10/2025',
        estado: 'Entregado',
        detalles: 'Id_pedido: P06705C, Producto: Sábanas personalizada, Total: $85.000'
    },
    {
        id: '02',
        cliente: 'Carlos Ramirez',
        fecha: '19/10/2025',
        estado: 'Pendiente',
        detalles: 'Id_pedido: P06704C, Producto: Juego de cama infantil, Total: $120.000'
    },
    {
        id: '03',
        cliente: 'Laura Pérez',
        fecha: '17/10/2025',
        estado: 'En proceso',
        detalles: 'Id_pedido: P06701A, Producto: Edredón estampado, Total: $95.000'
    }
];

export default function PedidosRealizados() {
    // Estado para guardar la lista de pedidos
    const [pedidos, setPedidos] = useState(pedidosIniciales);
    
    // Estado para saber qué pedido estamos editando (guarda el ID del pedido)
    const [editandoId, setEditandoId] = useState(null);
    
    // Estado temporal para guardar el nuevo estado seleccionado antes de guardar
    const [nuevoEstadoTemp, setNuevoEstadoTemp] = useState('');

    // Opciones de estado para el <select>
    const opcionesEstado = ['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'];

    // --- Funciones de Manejo ---

    // 1. Inicia el modo de edición para una fila
    const handleEditar = (pedido) => {
        setEditandoId(pedido.id);
        setNuevoEstadoTemp(pedido.estado); // Carga el estado actual como temporal
    };

    // 2. Guarda el nuevo estado y sale del modo de edición
    const handleGuardar = (id) => {
        // Mapea la lista y actualiza el estado del pedido con el nuevo valor temporal
        const pedidosActualizados = pedidos.map(p =>
            p.id === id ? { ...p, estado: nuevoEstadoTemp } : p
        );
        
        setPedidos(pedidosActualizados);
        setEditandoId(null); // Sale del modo de edición
    };

    // 3. Cancela la edición y sale del modo de edición
    const handleCancelar = () => {
        setEditandoId(null);
        setNuevoEstadoTemp('');
    };

    // 4. Muestra la etiqueta de estado con el color correspondiente
    const EstadoLabel = ({ estado }) => {
        let clase = '';
        if (estado === 'Entregado') clase = 'entregado';
        else if (estado === 'Pendiente') clase = 'pendiente';
        else if (estado === 'En proceso' || estado === 'Enviado') clase = 'en-proceso';
        else if (estado === 'Cancelado') clase = 'cancelado';
        
        return <span className={`estado-label ${clase}`}>{estado}</span>;
    };
    
    return (
        <div className="dashboard-layout">
           <Sidebar />
           <main className="contenido">
                <HeaderPedidos />

                <section className="pedidos cuadro-blanco">
                    <h2>Pedidos realizados</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Detalles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>{pedido.fecha}</td>
                                    
                                    {/* COLUMNA DE ESTADO: Modo Normal vs. Modo Edición */}
                                    <td>
                                        {editandoId === pedido.id ? (
                                            <select 
                                                value={nuevoEstadoTemp} 
                                                onChange={(e) => setNuevoEstadoTemp(e.target.value)}
                                                className="selector-estado"
                                            >
                                                {opcionesEstado.map(op => (
                                                    <option key={op} value={op}>{op}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <EstadoLabel estado={pedido.estado} />
                                        )}
                                    </td>
                                    
                                    <td>{pedido.detalles}</td>
                                    
                                    {/* COLUMNA DE ACCIONES: Botones de Edición vs. Botones de Guardar/Cancelar */}
                                    <td>
                                        {editandoId === pedido.id ? (
                                            <div className="btn-acciones-edicion">
                                                <button 
                                                    onClick={() => handleGuardar(pedido.id)} 
                                                    className="btn-guardar"
                                                >
                                                    Guardar
                                                </button>
                                                <button 
                                                    onClick={handleCancelar} 
                                                    className="btn-cancelar"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleEditar(pedido)} 
                                                className="btn-editar"
                                            >
                                                Editar
                                            </button>
                                        )}
                                        {/* Botón de Eliminar siempre visible */}
                                        <button className="btn-eliminar">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}