import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext.jsx";
import HeaderPerfil from "../../components/HeaderPerfil";
import "../../components/admin.css";

const API_URL = 'http://localhost:3001/api/usuarios';

export default function CambiarDatosAdmin() { 
    const { currentUser, updateCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom_1: '',
        nom_2: '',
        ape_1: '',
        ape_2: '',
        correo: '',
        telefono: '', // Inicializado en el estado local
        t_doc: '',
        id_usuario: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Cargar datos del usuario actual
    useEffect(() => {
        if (currentUser) {
            console.log("Objeto currentUser cargado:", currentUser); // Paso de diagnóstico
            setFormData({
                nom_1: currentUser.nom_1 || '',
                nom_2: currentUser.nom_2 || '',
                ape_1: currentUser.ape_1 || '',
                ape_2: currentUser.ape_2 || '',
                correo: currentUser.correo || '',
                telefono: currentUser.telefono || '', // Carga el valor inicial (puede ser null/undefined)
                t_doc: currentUser.t_doc || '',
                id_usuario: currentUser.id_usuario || ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setLoading(true);

        // CORRECCIÓN 1: La validación debe usar formData.telefono
        if (!formData.nom_1 || !formData.ape_1 || !formData.correo || !formData.telefono) {
            setError('Los campos marcados son obligatorios.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/update/${currentUser.id_usuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom_1: formData.nom_1,
                    nom_2: formData.nom_2 || null,
                    ape_1: formData.ape_1,
                    ape_2: formData.ape_2 || null,
                    correo: formData.correo,
                    // CORRECCIÓN 2: El envío debe usar formData.telefono
                    telefono: formData.telefono, 
                    t_doc: formData.t_doc
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('¡Datos actualizados exitosamente!');
                
                // Actualizar el contexto con los nuevos datos
                updateCurrentUser({
                    ...currentUser,
                    ...formData
                });

                setTimeout(() => {
                    navigate('/perfil_admin');
                }, 1500);
            } else {
                setError(data.error || data.message || 'Error al actualizar los datos.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <div>Cargando...</div>;
    }

    return (
        <main className="contenido">
            <HeaderPerfil />

            {/* Contenedor del formulario centrado */}
            <div className="perfil-container">
                <div className="form-card">
                    <h2 className="form-title">Cambiar datos</h2>

                    {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
                    {mensaje && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center' }}>{mensaje}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Primer Nombre */}
                        <div className="form-group">
                            <input 
                                type="text" 
                                id="nom_1" 
                                name="nom_1" 
                                value={formData.nom_1}
                                onChange={handleChange}
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="nom_1">Primer nombre *</label>
                        </div>

                        {/* Segundo Nombre */}
                        <div className="form-group">
                            <input 
                                type="text" 
                                id="nom_2" 
                                name="nom_2" 
                                value={formData.nom_2}
                                onChange={handleChange}
                                placeholder=" " 
                            />
                            <label htmlFor="nom_2">Segundo nombre</label>
                        </div>

                        {/* Primer Apellido */}
                        <div className="form-group">
                            <input 
                                type="text" 
                                id="ape_1" 
                                name="ape_1" 
                                value={formData.ape_1}
                                onChange={handleChange}
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="ape_1">Primer apellido *</label>
                        </div>

                        {/* Segundo Apellido */}
                        <div className="form-group">
                            <input 
                                type="text" 
                                id="ape_2" 
                                name="ape_2" 
                                value={formData.ape_2}
                                onChange={handleChange}
                                placeholder=" " 
                            />
                            <label htmlFor="ape_2">Segundo apellido</label>
                        </div>

                        {/* Correo electrónico */}
                        <div className="form-group">
                            <input 
                                type="email" 
                                id="correo" 
                                name="correo" 
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="correo">Correo electrónico *</label>
                        </div>

                        {/* Número telefónico */}
                        <div className="form-group">
                            <input 
                                type="tel" 
                                id="telefono" 
                                name="telefono" 
                                value={formData.telefono} // CORRECCIÓN 3: Debe ser formData para ser editable y llenarse
                                onChange={handleChange}
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="telefono">Número telefónico *</label>
                        </div>

                        {/* Grupo de Documento */}
                        <div className="document-group">
                            {/* Tipo de Documento */}
                            <div className="document-type">
                                <select 
                                    id="t_doc" 
                                    name="t_doc" 
                                    value={formData.t_doc}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="TI">Tarjeta de Identidad</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                </select>
                                <label htmlFor="t_doc">Tipo de documento</label>
                            </div>

                            {/* Número de documento (solo lectura) */}
                            <div className="document-number">
                                <input 
                                    type="text" 
                                    id="id_usuario" 
                                    name="id_usuario" 
                                    value={formData.id_usuario}
                                    placeholder=" " 
                                    readOnly
                                    style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                                />
                                <label htmlFor="id_usuario">Número de documento</label>
                            </div>
                        </div>

                        {/* Botones */}
                        <button 
                            type="submit" 
                            className="btn-guardar"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>

                        <button 
                            type="button" 
                            className="btn-guardar" 
                            style={{ backgroundColor: '#6c757d', marginTop: '10px' }}
                            onClick={() => navigate('/perfil_admin')}
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div> 
        </main>
    );
}