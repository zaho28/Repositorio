import React, { useState, useContext } from "react";
import Sidebarmov from "../../components/Sidebarmov";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/css/styles.css"; 
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext.jsx"; 
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000'; 

export default function FormularioEntradaProducto() {
    
    const navigate = useNavigate();
    // FIX: Se importó correctamente useContext para usar AuthContext
    const { userId, userName, userRole } = useContext(AuthContext); 

    const [formData, setFormData] = useState({
        id_producto: '',
        cantidad_m: '',
        observaciones: '',
        // Usamos el userId del contexto si existe, sino un fallback para desarrollo
        id_usuario: userId || 'Adm-01', 
    });

    const [productoEncontrado, setProductoEncontrado] = useState(null);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [cargando, setCargando] = useState(false);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el producto cambia, limpiamos el producto encontrado
        if (name === 'id_producto') {
            setProductoEncontrado(null);
            setMensaje({ text: '', type: '' });
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // BUSCAR PRODUCTO AL PRESIONAR ENTER
    const handleCheckProducto = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const id = formData.id_producto;
            if (!id || cargando) return;
            
            setCargando(true);
            setMensaje({ text: '', type: '' });
            setProductoEncontrado(null);

            try {
                const response = await axios.get(`${API_URL}/check/${id}`);
                
                if (response.data.found) {
                    setProductoEncontrado(response.data.product);
                    setMensaje({ 
                        text: `Producto encontrado: ${response.data.product.nom_producto} | Stock Actual: ${response.data.product.stock_actual}`, 
                        type: 'success' 
                    });
                    // Enfocamos el campo de cantidad automáticamente para mejor UX
                    document.getElementById('cantidad_m').focus(); 
                }
            } catch (error) {
                const errorMsg = error.response && error.response.status === 404 
                    ? 'Producto no encontrado o inactivo.' 
                    : 'Error al buscar el producto. Intente nuevamente.';
                
                setMensaje({ text: errorMsg, type: 'error' });
                console.error("Error al buscar el producto:", error);
            } finally {
                setCargando(false);
            }
        }
    };
    
    // 2. ENVIAR FORMULARIO (SUMAR STOCK)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!productoEncontrado) {
            setMensaje({ text: 'Primero valide el producto con el ID y ENTER.', type: 'error' });
            return;
        }
        if (!formData.cantidad_m || parseInt(formData.cantidad_m) <= 0) {
            setMensaje({ text: 'La cantidad a ingresar debe ser un número positivo.', type: 'error' });
            return;
        }

        setCargando(true);
        setMensaje({ text: '', type: '' });

        // FormData sin archivos, solo datos JSON
        const dataToSend = {
            id_usuario: userId || 'Adm-01',
            cantidad_m: formData.cantidad_m,
            observaciones: formData.observaciones,
            es_nuevo_producto: 'false', // Indicamos al backend que es solo una entrada de stock
            id_producto_existente: formData.id_producto,
        };
        
        try {
            const response = await axios.post(`${API_URL}/inventario`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            setMensaje({ text: `¡Stock actualizado! Nuevo ID: ${response.data.id_producto}. Redirigiendo...`, type: 'success' });
            
            // 3. REDIRECCIÓN AUTOMÁTICA
            setTimeout(() => {
                handleReset();
                navigate('/productos'); // Redirige a la lista de productos
            }, 1500);

        } catch (error) {
            const details = error.response?.data?.details || error.message;
            console.error("Error al enviar el formulario:", error);
            setMensaje({ text: `Error al actualizar el stock: ${details}`, type: 'error' });
        } finally {
            setCargando(false);
        }
    };
    
    const handleReset = () => {
        setFormData(prev => ({
            ...prev,
            id_producto: '',
            cantidad_m: '',
            observaciones: '',
        }));
        setProductoEncontrado(null);
        setMensaje({ text: '', type: '' });
    };

    return (
        <div className="dashboard-layout">
            <Sidebarmov />
            <main className="contenido">
                <HeaderPanel title="Entrada de Stock"/>

                {mensaje.text && (
                    <div className={`alerta ${mensaje.type}`}>
                        {mensaje.text}
                    </div>
                )}

                <section className="cuadro-blanco form-producto">
                    <form className="formulario" onSubmit={handleSubmit}>
                        
                        {/* ID PRODUCTO */}
                        <div className="campo">
                            <label htmlFor="id_producto">ID Producto (Presiona Enter para validar)</label>
                            <input 
                                type="number" 
                                id="id_producto" 
                                name="id_producto" 
                                placeholder="Escribe ID y presiona ENTER" 
                                required 
                                value={formData.id_producto}
                                onChange={handleChange}
                                onKeyDown={handleCheckProducto} 
                                disabled={cargando}
                                // Estilo para resaltar si el campo está listo o no
                                style={{ borderColor: productoEncontrado ? '#2ecc71' : (formData.id_producto ? '#f39c12' : '#ccc') }}
                            />
                        </div>

                        {/* DATOS DE SOLO LECTURA */}
                        <div className="campo-grupo" style={{ display: 'flex', gap: '10px' }}>
                            <div className="campo" style={{ flex: 2 }}>
                                <label>Producto</label>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={productoEncontrado ? productoEncontrado.nom_producto : ''}
                                    className={productoEncontrado ? 'valido' : ''}
                                    placeholder="Nombre del producto"
                                />
                            </div>
                        </div>
                        <div className="campo-grupo" style={{ display: 'flex', gap: '10px' }}>
                            <div className="campo" style={{ flex: 1 }}>
                                <label>Stock Actual</label>
                                <input 
                                    type="number" 
                                    readOnly 
                                    value={productoEncontrado ? productoEncontrado.stock_actual : ''}
                                    style={{ fontWeight: 'bold', color: '#2ecc71' }}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* CANTIDAD A SUMAR */}
                        <div className="campo">
                            <label htmlFor="cantidad_m">Cantidad a ingresar (+)</label>
                            <input 
                                type="number" 
                                id="cantidad_m" 
                                name="cantidad_m" 
                                placeholder="Ej: 50" 
                                required 
                                min="1"
                                value={formData.cantidad_m}
                                onChange={handleChange}
                                disabled={!productoEncontrado || cargando}
                                style={{ border: productoEncontrado ? '2px solid #3498db' : '2px solid #ccc' }}
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="observaciones">Observaciones</label>
                            <textarea 
                                id="observaciones" 
                                name="observaciones" 
                                rows="2"
                                value={formData.observaciones}
                                onChange={handleChange}
                                disabled={!productoEncontrado || cargando}
                            ></textarea>
                        </div>

                        <div className="botones">
                            <button type="submit" className="btn-guardar" disabled={!productoEncontrado || cargando}>
                                <i className="fa-solid fa-plus"></i> {cargando ? 'Procesando...' : 'Sumar al Stock'}
                            </button>
                            <button type="button" className="btn-cancelar" onClick={() => navigate('/productos')} disabled={cargando}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}