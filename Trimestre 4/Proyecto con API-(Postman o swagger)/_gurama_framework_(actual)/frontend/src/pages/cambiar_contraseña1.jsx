import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const API_URL = 'http://localhost:3001/api/usuarios';

const CambiarContrasenaForm = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        contrasenaActual: '',
        nuevaContrasena: '',
        confirmarContrasena: ''
    });
    
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarActual, setMostrarActual] = useState(false);
    const [mostrarNueva, setMostrarNueva] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar mensajes al escribir
        setError('');
        setMensaje('');
    };

    const validarFormulario = () => {
        if (!formData.contrasenaActual || !formData.nuevaContrasena || !formData.confirmarContrasena) {
            setError('Por favor completa todos los campos.');
            return false;
        }

        if (formData.nuevaContrasena.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        if (formData.nuevaContrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden.');
            return false;
        }

        if (formData.contrasenaActual === formData.nuevaContrasena) {
            setError('La nueva contraseña debe ser diferente a la actual.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!validarFormulario()) {
            return;
        }

        if (!user || !user.id_usuario) {
            setError('No hay sesión activa. Por favor inicia sesión.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/Cambiar-contrasena`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: user.id_usuario,
                    contrasenaActual: formData.contrasenaActual,
                    nuevaContrasena: formData.nuevaContrasena
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('¡Contraseña actualizada exitosamente!');
                setFormData({
                    contrasenaActual: '',
                    nuevaContrasena: '',
                    confirmarContrasena: ''
                });
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate('/perfil');
                }, 2000);
            } else {
                setError(data.message || 'Error al cambiar la contraseña.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <form className="form-cambiar" onSubmit={handleSubmit}>
                <div className="subtitulo">
                    <h2>Cambiar Contraseña</h2>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                    <div style={{ 
                        color: '#fff', 
                        backgroundColor: '#dc3545', 
                        padding: '12px', 
                        borderRadius: '8px',
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
                {mensaje && (
                    <div style={{ 
                        color: '#fff', 
                        backgroundColor: '#f595caff', 
                        padding: '12px', 
                        borderRadius: '8px',
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                        {mensaje}
                    </div>
                )}

                {/* Contraseña Actual */}
                <label htmlFor="contrasenaActual">Contraseña Actual</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={mostrarActual ? "text" : "password"}
                        id="contrasenaActual" 
                        name="contrasenaActual"
                        value={formData.contrasenaActual}
                        onChange={handleChange}
                        placeholder="Ingrese su contraseña actual" 
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setMostrarActual(!mostrarActual)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {mostrarActual ? '' : ''}
                    </button>
                </div>

                {/* Nueva Contraseña */}
                <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={mostrarNueva ? "text" : "password"}
                        id="nuevaContrasena" 
                        name="nuevaContrasena"
                        value={formData.nuevaContrasena}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres" 
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setMostrarNueva(!mostrarNueva)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {mostrarNueva ? '' : ''}
                    </button>
                </div>

                {/* Confirmar Contraseña */}
                <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={mostrarConfirmar ? "text" : "password"}
                        id="confirmarContrasena" 
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        placeholder="Repita su nueva contraseña" 
                        required
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {mostrarConfirmar ? '' : ''}
                    </button>
                </div>

                {/* Indicador de fortaleza de contraseña */}
                {formData.nuevaContrasena && (
                    <div style={{ marginTop: '10px', fontSize: '13px' }}>
                        <div style={{ color: formData.nuevaContrasena.length >= 8 ? '#28a745' : '#ffc107' }}>
                            {formData.nuevaContrasena.length < 6 && ' Muy débil'}
                            {formData.nuevaContrasena.length >= 6 && formData.nuevaContrasena.length < 8 && 'Débil'}
                            {formData.nuevaContrasena.length >= 8 && formData.nuevaContrasena.length < 12 && 'Aceptable'}
                            {formData.nuevaContrasena.length >= 12 && ' Fuerte'}
                        </div>
                    </div>
                )}

                {/* Botón Guardar */}
                <button 
                    type="submit" 
                    className="btn-guardarc"
                    disabled={loading}
                    style={{
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>

                {/* Botón Cancelar */}
                <button 
                    type="button" 
                    className="btn-guardarc" 
                    onClick={() => navigate('/perfil')}
                    disabled={loading}
                    style={{ 
                        backgroundColor: '#6c757d', 
                        marginTop: '10px',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    Cancelar
                </button>
            </form>
        </main>
    );
};

export default CambiarContrasenaForm;