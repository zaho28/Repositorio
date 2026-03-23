import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderUsuarios from "../../components/HeaderUsuarios";
import "../../components/css/styles.css";

const API_URL = 'http://localhost:3003/api';

export default function Usuarios() {
    const [tabActiva, setTabActiva] = useState('clientes'); // 'clientes' o 'trabajadores'
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    useEffect(() => {
        cargarUsuarios();
    }, [tabActiva]);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/usuarios`);
            
            // Filtrar según el rol
            const usuariosFiltrados = response.data.filter(usuario => {
                if (tabActiva === 'clientes') {
                    return usuario.id_rol_usuario === 'R-U-2'; // Rol cliente
                } else {
                    return usuario.id_rol_usuario === 'R-U-3'; // Rol trabajador
                }
            });

            setUsuarios(usuariosFiltrados);
            console.log('Usuarios cargados:', usuariosFiltrados);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (id_usuario, nuevoEstado) => {
        const confirmacion = window.confirm(
            `¿Estás seguro de ${nuevoEstado === 1 ? 'activar' : 'desactivar'} este usuario?`
        );

        if (!confirmacion) return;

        try {
            await axios.put(`${API_URL}/usuarios/${id_usuario}`, {
                estado: nuevoEstado
            });

            alert('Estado actualizado correctamente');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            alert('Error al actualizar el estado del usuario');
        }
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const obtenerIniciales = (nombre, apellido) => {
        const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : '';
        const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
        return inicial1 + inicial2 || '??';
    };

    const getRolClass = (rolId) => {
        const clases = {
            'R-U-1': 'rol-administrador',
            'R-U-2': 'rol-cliente',
            'R-U-3': 'rol-trabajador'
        };
        return `usuario-rol-badge ${clases[rolId] || ''}`;
    };

    const getRolNombre = (rolId) => {
        const nombres = {
            'R-U-1': 'Administrador',
            'R-U-2': 'Cliente',
            'R-U-3': 'Trabajador'
        };
        return nombres[rolId] || 'Desconocido';
    };

    // Filtrar usuarios según búsqueda y estado
    const usuariosFiltrados = usuarios.filter(usuario => {
        const nombreCompleto = `${usuario.nom_1} ${usuario.nom_2 || ''} ${usuario.ape_1} ${usuario.ape_2 || ''}`.toLowerCase();
        const email = (usuario.correo || '').toLowerCase();
        const telefono = (usuario.telefono || '').toLowerCase();
        const id = (usuario.id_usuario || '').toLowerCase();

        const coincideBusqueda = 
            nombreCompleto.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase()) ||
            telefono.includes(searchTerm.toLowerCase()) ||
            id.includes(searchTerm.toLowerCase());

        const coincideEstado = 
            filtroEstado === 'todos' ||
            (filtroEstado === 'activos' && usuario.estado === 1) ||
            (filtroEstado === 'inactivos' && usuario.estado === 0);

        return coincideBusqueda && coincideEstado;
    });

    // Estadísticas
    const stats = {
        total: usuarios.length,
        activos: usuarios.filter(u => u.estado === 1).length,
        inactivos: usuarios.filter(u => u.estado === 0).length
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderUsuarios />
                    <div className="usuarios-loading">
                        <p>Cargando usuarios...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="contenido">
                <HeaderUsuarios />

                <section className="cuadro-blanco usuarios">
                    <h2>Gestión de Usuarios</h2>

                    {/* Pestañas */}
                    <div className="usuarios-tabs-container">
                        <button
                            className={`usuario-tab ${tabActiva === 'clientes' ? 'active' : ''}`}
                            onClick={() => setTabActiva('clientes')}
                        >
                            Clientes
                            <span className="usuario-tab-badge">
                                {usuarios.filter(u => u.id_rol_usuario === 'R-U-2').length}
                            </span>
                        </button>
                        <button
                            className={`usuario-tab ${tabActiva === 'trabajadores' ? 'active' : ''}`}
                            onClick={() => setTabActiva('trabajadores')}
                        >
                            Trabajadores
                            <span className="usuario-tab-badge">
                                {usuarios.filter(u => u.id_rol_usuario === 'R-U-3').length}
                            </span>
                        </button>
                    </div>

                    {/* Header con estadísticas */}
                    <div className="usuarios-header">
                        <div className="usuarios-stats">
                            <div className="stat-card">
                                <div className="stat-label">Total</div>
                                <div className="stat-value">{stats.total}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Activos</div>
                                <div className="stat-value">{stats.activos}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Inactivos</div>
                                <div className="stat-value">{stats.inactivos}</div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="usuarios-filtros">
                        <div className="usuarios-search-box">
                            <span className="usuarios-search-icon"></span>
                            <input
                                type="text"
                                className="usuarios-search-input"
                                placeholder="Buscar por nombre, email, teléfono o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="usuarios-filter-select"
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="activos">Activos</option>
                            <option value="inactivos">Inactivos</option>
                        </select>
                    </div>

                    {/* Tabla de usuarios */}
                    <div className="usuarios-tabla-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Contacto</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">
                                            <div className="usuarios-tabla-vacia">
                                                <div className="usuarios-tabla-vacia-icono">
                                                    {searchTerm ? '' : ''}
                                                </div>
                                                <h3>
                                                    {searchTerm 
                                                        ? 'No se encontraron resultados' 
                                                        : `No hay ${tabActiva} registrados`
                                                    }
                                                </h3>
                                                <p>
                                                    {searchTerm 
                                                        ? 'Intenta con otros términos de búsqueda' 
                                                        : 'Los usuarios aparecerán aquí cuando se registren'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    usuariosFiltrados.map((usuario) => (
                                        <tr key={usuario.id_usuario}>
                                            <td>
                                                <div className="usuario-avatar-cell">
                                                    <div className="usuario-avatar">
                                                        {obtenerIniciales(usuario.nom_1, usuario.ape_1)}
                                                    </div>
                                                    <div className="usuario-info">
                                                        <div className="usuario-nombre">
                                                            {usuario.nom_1} {usuario.nom_2 || ''} {usuario.ape_1} {usuario.ape_2 || ''}
                                                        </div>
                                                        <div className="usuario-id">
                                                            ID: {usuario.id_usuario}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="usuario-contacto">
                                                    <div className="usuario-email">
                                                        {usuario.correo || 'No especificado'}
                                                    </div>
                                                    <div className="usuario-telefono">
                                                        {usuario.telefono || 'No especificado'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={getRolClass(usuario.id_rol_usuario)}>
                                                    {getRolNombre(usuario.id_rol_usuario)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`usuario-estado-badge ${usuario.estado === 1 ? 'estado-activo' : 'estado-inactivo'}`}>
                                                    {usuario.estado === 1 ? '✓ Activo' : '✕ Inactivo'}
                                                </span>
                                            </td>
                                            <td className="usuario-fecha">
                                                {formatFecha(usuario.created_at)}
                                            </td>
                                            <td>
                                                <div className="usuario-acciones">
                                                    {usuario.estado === 1 ? (
                                                        <button
                                                            onClick={() => handleCambiarEstado(usuario.id_usuario, 0)}
                                                            className="btn-usuario-accion btn-desactivar"
                                                        >
                                                            Desactivar
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCambiarEstado(usuario.id_usuario, 1)}
                                                            className="btn-usuario-accion btn-activar"
                                                        >
                                                            ✓ Activar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Contador de resultados */}
                    {usuariosFiltrados.length > 0 && (
                        <div style={{
                            marginTop: '20px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '0.9rem'
                        }}>
                            Mostrando {usuariosFiltrados.length} de {usuarios.length} {tabActiva}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}