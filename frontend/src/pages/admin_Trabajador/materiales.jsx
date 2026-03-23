import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar_p-a.jsx';
import '../../components/css/styles.css';

// ─── Datos de ejemplo mientras conectas la API ───────────────────────
const MATERIALES_MOCK = [
    { id_material: 1,  nombre: 'Tela Ovejero',        tipo: 'Tela',      unidad: 'metro',   precio_unitario: 18000, stock_actual: 45, stock_minimo: 10, estado: true,  ruta_imagen: null },
    { id_material: 2,  nombre: 'Tela Conejo',          tipo: 'Tela',      unidad: 'metro',   precio_unitario: 22000, stock_actual: 8,  stock_minimo: 10, estado: true,  ruta_imagen: null },
    { id_material: 3,  nombre: 'Venus pelo largo',     tipo: 'Tela',      unidad: 'metro',   precio_unitario: 25000, stock_actual: 0,  stock_minimo: 5,  estado: true,  ruta_imagen: null },
    { id_material: 4,  nombre: 'Bordado flores',       tipo: 'Bordado',   unidad: 'unidad',  precio_unitario: 8000,  stock_actual: 30, stock_minimo: 5,  estado: true,  ruta_imagen: null },
    { id_material: 5,  nombre: 'Estampado geométrico', tipo: 'Diseño',    unidad: 'unidad',  precio_unitario: 5000,  stock_actual: 50, stock_minimo: 10, estado: true,  ruta_imagen: null },
    { id_material: 6,  nombre: 'Relleno fibra 300gr',  tipo: 'Relleno',   unidad: 'unidad',  precio_unitario: 35000, stock_actual: 20, stock_minimo: 8,  estado: true,  ruta_imagen: null },
    { id_material: 7,  nombre: 'Cierre invisible 2m',  tipo: 'Accesorio', unidad: 'unidad',  precio_unitario: 4500,  stock_actual: 3,  stock_minimo: 10, estado: true,  ruta_imagen: null },
    { id_material: 8,  nombre: 'Micropolar',           tipo: 'Tela',      unidad: 'metro',   precio_unitario: 19000, stock_actual: 0,  stock_minimo: 5,  estado: false, ruta_imagen: null },
];

const TIPOS = ['Todos', 'Tela', 'Bordado', 'Diseño', 'Relleno', 'Accesorio'];

const TIPO_COLORS = {
    Tela:      'badge-tipo-Tela',
    Bordado:   'badge-tipo-Bordado',
    'Diseño':  'badge-tipo-Diseno',
    Relleno:   'badge-tipo-Relleno',
    Accesorio: 'badge-tipo-Accesorio',
};

const MODAL_VACIO = {
    id_material: null,
    nombre: '',
    tipo: 'Tela',
    unidad: 'metro',
    precio_unitario: '',
    stock_actual: '',
    stock_minimo: '',
    estado: true,
};

// ────────────────────────────────────────────────────────────────────

const Materiales = () => {
    const [materiales, setMateriales] = useState(MATERIALES_MOCK);
    const [buscar, setBuscar]         = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('Todos');
    const [modal, setModal]           = useState(false);
    const [form, setForm]             = useState(MODAL_VACIO);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [alerta, setAlerta]         = useState(null);

    // ── Estadísticas ──
    const total     = materiales.length;
    const activos   = materiales.filter(m => m.estado).length;
    const sinStock  = materiales.filter(m => m.stock_actual === 0).length;
    const stockBajo = materiales.filter(m => m.stock_actual > 0 && m.stock_actual <= m.stock_minimo).length;

    // ── Filtrado ──
    const materialesFiltrados = materiales.filter(m => {
        const coincideBusqueda = m.nombre.toLowerCase().includes(buscar.toLowerCase());
        const coincideTipo     = tipoFiltro === 'Todos' || m.tipo === tipoFiltro;
        return coincideBusqueda && coincideTipo;
    });

    // ── Helpers ──
    const formatPrice = (p) =>
        Number(p).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

    const getStockClass = (m) => {
        if (m.stock_actual === 0) return 'stock-material-cero';
        if (m.stock_actual <= m.stock_minimo) return 'stock-material-bajo';
        return 'stock-material-ok';
    };

    const mostrarAlerta = (msg, tipo = 'success') => {
        setAlerta({ msg, tipo });
        setTimeout(() => setAlerta(null), 3000);
    };

    // ── Modal ──
    const abrirAgregar = () => {
        setForm(MODAL_VACIO);
        setModoEdicion(false);
        setModal(true);
    };

    const abrirEditar = (material) => {
        setForm({ ...material });
        setModoEdicion(true);
        setModal(true);
    };

    const cerrarModal = () => {
        setModal(false);
        setForm(MODAL_VACIO);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleGuardar = () => {
        if (!form.nombre.trim()) {
            mostrarAlerta('El nombre es obligatorio', 'error');
            return;
        }
        if (!form.precio_unitario || Number(form.precio_unitario) <= 0) {
            mostrarAlerta('Ingresa un precio válido', 'error');
            return;
        }

        if (modoEdicion) {
            setMateriales(prev =>
                prev.map(m => m.id_material === form.id_material ? { ...form } : m)
            );
            mostrarAlerta('Material actualizado correctamente');
        } else {
            const nuevoId = Math.max(...materiales.map(m => m.id_material)) + 1;
            setMateriales(prev => [...prev, { ...form, id_material: nuevoId }]);
            mostrarAlerta('Material registrado correctamente');
        }
        cerrarModal();
    };

    const toggleEstado = (id) => {
        setMateriales(prev =>
            prev.map(m => m.id_material === id ? { ...m, estado: !m.estado } : m)
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="contenido">

                <div className="cuadro-blanco materiales">

                    {/* ── Header ── */}
                    <div className="materiales-header">
                        <h2>🧵 Materiales</h2>
                        <button className="btn-registrar" onClick={abrirAgregar}>
                            + Registrar material
                        </button>
                    </div>

                    {/* ── Alerta ── */}
                    {alerta && (
                        <div className={`alerta ${alerta.tipo}`} style={{ marginBottom: '16px' }}>
                            {alerta.tipo === 'success' ? '✅' : '⚠️'} {alerta.msg}
                        </div>
                    )}

                    {/* ── Stats ── */}
                    <div className="materiales-stats">
                        <div className="material-stat-card rosa">
                            <span className="material-stat-label">Total materiales</span>
                            <span className="material-stat-value">{total}</span>
                        </div>
                        <div className="material-stat-card verde">
                            <span className="material-stat-label">Activos</span>
                            <span className="material-stat-value">{activos}</span>
                        </div>
                        <div className="material-stat-card amarillo">
                            <span className="material-stat-label">Stock bajo</span>
                            <span className="material-stat-value">{stockBajo}</span>
                            <span className="material-stat-sub">Por debajo del mínimo</span>
                        </div>
                        <div className="material-stat-card rojo">
                            <span className="material-stat-label">Sin stock</span>
                            <span className="material-stat-value">{sinStock}</span>
                        </div>
                    </div>

                    {/* ── Controles ── */}
                    <div className="materiales-controles">
                        <input
                            type="text"
                            className="materiales-buscar"
                            placeholder="🔍 Buscar material..."
                            value={buscar}
                            onChange={e => setBuscar(e.target.value)}
                        />
                        <select
                            className="materiales-filtro-tipo"
                            value={tipoFiltro}
                            onChange={e => setTipoFiltro(e.target.value)}
                        >
                            {TIPOS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* ── Contador ── */}
                    <div className="resultado-contador">
                        Mostrando <strong>{materialesFiltrados.length}</strong> de {total} materiales
                    </div>

                    {/* ── Tabla ── */}
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Unidad</th>
                                    <th>Precio unitario</th>
                                    <th>Stock actual</th>
                                    <th>Stock mínimo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialesFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={9}>
                                            <div className="tabla-vacia-mensaje">
                                                <div className="icono-vacio">🧵</div>
                                                <p>No se encontraron materiales</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    materialesFiltrados.map(m => (
                                        <tr key={m.id_material}>
                                            {/* Imagen */}
                                            <td>
                                                {m.ruta_imagen
                                                    ? <img src={m.ruta_imagen} alt={m.nombre} className="material-img" />
                                                    : <div className="material-sin-img">Sin imagen</div>
                                                }
                                            </td>

                                            {/* Nombre */}
                                            <td style={{ fontWeight: 600, color: '#5a3d54' }}>{m.nombre}</td>

                                            {/* Tipo */}
                                            <td>
                                                <span className={`badge-tipo-material ${TIPO_COLORS[m.tipo] || ''}`}>
                                                    {m.tipo}
                                                </span>
                                            </td>

                                            {/* Unidad */}
                                            <td className="celda-gris">{m.unidad}</td>

                                            {/* Precio */}
                                            <td className="material-precio">{formatPrice(m.precio_unitario)}</td>

                                            {/* Stock actual */}
                                            <td>
                                                <span className={getStockClass(m)}>{m.stock_actual} {m.unidad}s</span>
                                                {m.stock_actual <= m.stock_minimo && m.stock_actual > 0 && (
                                                    <span className="stock-minimo-alerta">⚠ Por debajo del mínimo</span>
                                                )}
                                                {m.stock_actual === 0 && (
                                                    <span className="stock-minimo-alerta">🚫 Agotado</span>
                                                )}
                                            </td>

                                            {/* Stock mínimo */}
                                            <td className="celda-gris">{m.stock_minimo} {m.unidad}s</td>

                                            {/* Estado */}
                                            <td>
                                                <span className={`badge-tipo-material ${m.estado ? 'badge-material-activo' : 'badge-material-inactivo'}`}>
                                                    {m.estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>

                                            {/* Acciones */}
                                            <td>
                                                <button
                                                    className="btn-material-editar"
                                                    onClick={() => abrirEditar(m)}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    className={`btn-material-toggle ${m.estado ? 'activo' : 'inactivo'}`}
                                                    onClick={() => toggleEstado(m.id_material)}
                                                >
                                                    {m.estado ? '🔴 Desactivar' : '🟢 Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Modal agregar / editar ── */}
                {modal && (
                    <div className="material-modal-overlay" onClick={cerrarModal}>
                        <div className="material-modal" onClick={e => e.stopPropagation()}>

                            <h3>{modoEdicion ? '✏️ Editar material' : '+ Registrar material'}</h3>

                            <div className="material-modal-grid">

                                {/* Nombre */}
                                <div className="campo campo-full">
                                    <label>Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleFormChange}
                                        placeholder="Ej: Tela Ovejero"
                                    />
                                </div>

                                {/* Tipo */}
                                <div className="campo">
                                    <label>Tipo *</label>
                                    <select name="tipo" value={form.tipo} onChange={handleFormChange}>
                                        <option value="Tela">Tela</option>
                                        <option value="Bordado">Bordado</option>
                                        <option value="Diseño">Diseño</option>
                                        <option value="Relleno">Relleno</option>
                                        <option value="Accesorio">Accesorio</option>
                                    </select>
                                </div>

                                {/* Unidad */}
                                <div className="campo">
                                    <label>Unidad *</label>
                                    <select name="unidad" value={form.unidad} onChange={handleFormChange}>
                                        <option value="metro">Metro</option>
                                        <option value="unidad">Unidad</option>
                                    </select>
                                </div>

                                {/* Precio unitario */}
                                <div className="campo">
                                    <label>Precio unitario *</label>
                                    <input
                                        type="number"
                                        name="precio_unitario"
                                        value={form.precio_unitario}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                {/* Stock actual */}
                                <div className="campo">
                                    <label>Stock actual</label>
                                    <input
                                        type="number"
                                        name="stock_actual"
                                        value={form.stock_actual}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                {/* Stock mínimo */}
                                <div className="campo">
                                    <label>Stock mínimo</label>
                                    <input
                                        type="number"
                                        name="stock_minimo"
                                        value={form.stock_minimo}
                                        onChange={handleFormChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                {/* Estado */}
                                <div className="campo campo-full" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        name="estado"
                                        id="estado-material"
                                        checked={form.estado}
                                        onChange={handleFormChange}
                                        style={{ accentColor: '#c45a77', width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="estado-material" style={{ marginTop: 0, cursor: 'pointer' }}>
                                        Material activo (visible para pedidos personalizados)
                                    </label>
                                </div>

                            </div>

                            {/* Botones */}
                            <div className="material-modal-botones">
                                <button className="botones btn-cancelar" onClick={cerrarModal}
                                    style={{ padding: '10px 22px', borderRadius: '20px', border: '2px solid #e0c5d5', background: '#f5edf2', color: '#5a3d54', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                                <button className="btn-registrar" onClick={handleGuardar}
                                    style={{ padding: '10px 22px' }}>
                                    {modoEdicion ? '💾 Guardar cambios' : '✅ Registrar'}
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Materiales;