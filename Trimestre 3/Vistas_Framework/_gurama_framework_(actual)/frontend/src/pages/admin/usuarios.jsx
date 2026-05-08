import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderUsuarios from "../../components/HeaderUsuarios";
import "../../components/admin.css";

const API_URL = 'http://localhost:3001/api/usuarios';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tablaActiva, setTablaActiva] = useState('admins');
    const [editandoCodigo, setEditandoCodigo] = useState(null);
    const [nuevoCodigo, setNuevoCodigo] = useState('');

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log('Usuarios cargados:', response.data);
            
            // Debug: Ver los roles de cada usuario
            response.data.forEach(u => {
                console.log(`Usuario: ${u.nom_1}, Rol ID: ${u.id_rol_usuario}, Rol Nombre: ${u.nombre_rol}`);
            });
            
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    // FILTRAR CORRECTAMENTE por id_rol_usuario
    // Administradores: id_rol_usuario === 1 O nombre_rol contiene "Admin"
    const administradores = usuarios.filter(u => {
        const esAdmin = u.id_rol_usuario === 1 || 
                       (u.nombre_rol && u.nombre_rol.toLowerCase().includes('admin'));
        return esAdmin;
    });
    
    // Clientes: todos los demás
    const clientes = usuarios.filter(u => {
        const esAdmin = u.id_rol_usuario === 1 || 
                       (u.nombre_rol && u.nombre_rol.toLowerCase().includes('admin'));
        return !esAdmin;
    });

    console.log('Administradores encontrados:', administradores.length);
    console.log('Clientes encontrados:', clientes.length);

    // Desactivar/Eliminar usuario
    const handleDesactivarUsuario = async (id_usuario, nombre, esAdmin) => {
        const tipo = esAdmin ? 'administrador' : 'cliente';
        if (!window.confirm(`¿Está seguro de desactivar al ${tipo} ${nombre}?`)) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/delete/${id_usuario}`);
            alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} desactivado correctamente`);
            cargarUsuarios();
        } catch (error) {
            console.error('Error al desactivar usuario:', error);
            alert('Error al desactivar el usuario');
        }
    };

    // Iniciar edición de código
    const handleEditarCodigo = (id_usuario) => {
        setEditandoCodigo(id_usuario);
        setNuevoCodigo('');
    };

    // Guardar nuevo código
    const handleGuardarCodigo = async (id_usuario) => {
        if (!nuevoCodigo || nuevoCodigo.length < 4) {
            alert('El código debe tener al menos 4 caracteres');
            return;
        }

        try {
            await axios.put(`${API_URL}/update/${id_usuario}`, {
                codigo: nuevoCodigo
            });

            alert('Código actualizado correctamente');
            setEditandoCodigo(null);
            setNuevoCodigo('');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al actualizar código:', error);
            alert('Error al actualizar el código');
        }
    };

    const handleCancelarEdicion = () => {
        setEditandoCodigo(null);
        setNuevoCodigo('');
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderUsuarios />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                        fontSize: '18px',
                        color: '#666'
                    }}>
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

                <section className="cuadro-blanco usuarios-section">
                    {/* PESTAÑAS */}
                    <div className="usuarios-header">
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className={tablaActiva === 'admins' ? 'btn-activo' : 'btn-inactivo'}
                                onClick={() => setTablaActiva('admins')}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '8px 8px 0 0',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    background: tablaActiva === 'admins' ? '#007bff' : '#e9ecef',
                                    color: tablaActiva === 'admins' ? 'white' : '#333',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Administradores ({administradores.length})
                            </button>

                            <button 
                                className={tablaActiva === 'clientes' ? 'btn-activo' : 'btn-inactivo'}
                                onClick={() => setTablaActiva('clientes')}
                                style={{
                                    padding: '10px 20px',
                                    border: 'none',
                                    borderRadius: '8px 8px 0 0',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    background: tablaActiva === 'clientes' ? '#007bff' : '#e9ecef',
                                    color: tablaActiva === 'clientes' ? 'white' : '#333',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Clientes ({clientes.length})
                            </button>
                        </div>

                        <Link to="/registrar_usuario" className="registrar">
                            <button className="btn-registrar" style={{
                                padding: '10px 20px',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                Registrar nuevo administrador
                            </button>
                        </Link>
                    </div>

                    {/* ========================================= */}
                    {/* TABLA DE ADMINISTRADORES */}
                    {/* ========================================= */}
                    {tablaActiva === 'admins' && (
                        <div className="tabla-usuarios">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Documento</th>
                                        <th>Código Admin</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {administradores.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                                No hay administradores registrados
                                            </td>
                                        </tr>
                                    ) : (
                                        administradores.map((admin) => (
                                            <tr key={admin.id_usuario}>
                                                <td>
                                                    <strong style={{color: '#333', fontSize: '14px'}}>
                                                        {admin.id_usuario}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <div style={{fontWeight: '500', color: '#333'}}>
                                                        {`${admin.nom_1} ${admin.nom_2 || ''} ${admin.ape_1} ${admin.ape_2 || ''}`.trim()}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.8em',
                                                        color: 'white',
                                                        background: '#dc3545',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px',
                                                        display: 'inline-block',
                                                        marginTop: '4px'
                                                    }}>
                                                        {admin.nombre_rol}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.9em', color: '#555'}}>
                                                        {admin.correo}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.9em'}}>
                                                        {admin.telefono || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.85em', color: '#666'}}>
                                                        {admin.desc_doc}
                                                    </span>
                                                </td>
                                                <td>
                                                    {editandoCodigo === admin.id_usuario ? (
                                                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                                            <input
                                                                type="text"
                                                                placeholder="Nuevo código"
                                                                value={nuevoCodigo}
                                                                onChange={(e) => setNuevoCodigo(e.target.value)}
                                                                style={{
                                                                    padding: '8px',
                                                                    border: '2px solid #007bff',
                                                                    borderRadius: '6px',
                                                                    fontSize: '0.9em'
                                                                }}
                                                            />
                                                            <small style={{color: '#666', fontSize: '0.75em'}}>
                                                                Mínimo 4 caracteres
                                                            </small>
                                                        </div>
                                                    ) : (
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '6px 12px',
                                                            background: admin.codigo_visible ? '#e7f3ff' : '#fff3cd',
                                                            borderRadius: '8px',
                                                            fontSize: '0.85em',
                                                            color: admin.codigo_visible ? '#007bff' : '#856404',
                                                            fontWeight: '600',
                                                            fontFamily: 'monospace',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            {admin.codigo_visible ? `${admin.codigo_visible}` : 'Sin código'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'stretch'}}>
                                                        {editandoCodigo === admin.id_usuario ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleGuardarCodigo(admin.id_usuario)}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        background: '#28a745',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85em',
                                                                        fontWeight: '600',
                                                                        transition: 'opacity 0.2s'
                                                                    }}
                                                                    onMouseOver={(e) => e.target.style.opacity = '0.8'}
                                                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                                                >
                                                                    Guardar Código
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelarEdicion}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        background: '#6c757d',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85em',
                                                                        fontWeight: '600',
                                                                        transition: 'opacity 0.2s'
                                                                    }}
                                                                    onMouseOver={(e) => e.target.style.opacity = '0.8'}
                                                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditarCodigo(admin.id_usuario)}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        background: '#ffc107',
                                                                        color: '#333',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85em',
                                                                        fontWeight: '600',
                                                                        transition: 'opacity 0.2s'
                                                                    }}
                                                                    onMouseOver={(e) => e.target.style.opacity = '0.8'}
                                                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                                                >
                                                                    Cambiar Código
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDesactivarUsuario(admin.id_usuario, `${admin.nom_1} ${admin.ape_1}`, true)}
                                                                    style={{
                                                                        padding: '8px 16px',
                                                                        background: '#dc3545',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85em',
                                                                        fontWeight: '600',
                                                                        transition: 'opacity 0.2s'
                                                                    }}
                                                                    onMouseOver={(e) => e.target.style.opacity = '0.8'}
                                                                    onMouseOut={(e) => e.target.style.opacity = '1'}
                                                                >
                                                                    Desactivar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ========================================= */}
                    {/* TABLA DE CLIENTES */}
                    {/* ========================================= */}
                    {tablaActiva === 'clientes' && (
                        <div className="tabla-usuarios">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Documento</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                                No hay clientes registrados todavía
                                            </td>
                                        </tr>
                                    ) : (
                                        clientes.map((cliente) => (
                                            <tr key={cliente.id_usuario}>
                                                <td>
                                                    <strong style={{color: '#333', fontSize: '14px'}}>
                                                        {cliente.id_usuario}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <div style={{fontWeight: '500', color: '#333'}}>
                                                        {`${cliente.nom_1} ${cliente.nom_2 || ''} ${cliente.ape_1} ${cliente.ape_2 || ''}`.trim()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.9em', color: '#555'}}>
                                                        {cliente.correo}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.9em'}}>
                                                        {cliente.telefono || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{fontSize: '0.85em', color: '#666'}}>
                                                        {cliente.desc_doc}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 12px',
                                                        background: '#28a745',
                                                        color: 'white',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85em',
                                                        fontWeight: '600'
                                                    }}>
                                                        {cliente.nombre_rol}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 12px',
                                                        background: '#d4edda',
                                                        color: '#155724',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85em',
                                                        fontWeight: '600'
                                                    }}>
                                                        Activo
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDesactivarUsuario(cliente.id_usuario, `${cliente.nom_1} ${cliente.ape_1}`, false)}
                                                        style={{
                                                            padding: '8px 16px',
                                                            background: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85em',
                                                            fontWeight: '600',
                                                            transition: 'opacity 0.2s',
                                                            width: '100%'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.opacity = '0.8'}
                                                        onMouseOut={(e) => e.target.style.opacity = '1'}
                                                    >
                                                        Desactivar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}