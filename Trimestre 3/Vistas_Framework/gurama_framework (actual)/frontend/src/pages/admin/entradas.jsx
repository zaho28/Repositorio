import React, { useState } from "react";
import Sidebarmov from "../../components/Sidebarmov";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css"; 
import axios from 'axios'; 

// URL base de tu API
const API_URL = "http://localhost:3001/api/productos"; 

export default function FormularioEntradaProducto() {
    
    // === ESTADOS PARA LA ENTRADA DE STOCK ===
    const [formData, setFormData] = useState({
        id_producto: '',
        cantidad_m: '',
        observaciones: '',
        id_usuario: 1, // Obtener del contexto de autenticación en producción
    });

    // === ESTADOS DE UI Y DATOS ===
    const [productoEncontrado, setProductoEncontrado] = useState(null);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [cargando, setCargando] = useState(false);

    // Función genérica para manejar cambios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Función para buscar y validar el producto existente (solo lectura)
    const handleCheckProducto = async (e) => {
        // Ejecuta la búsqueda solo si la tecla presionada es 'Enter'
        if (e.key === 'Enter') {
            e.preventDefault(); 
            
            const id = formData.id_producto;
            if (!id) return;
            
            setCargando(true);
            setMensaje({ text: '', type: '' });
            setProductoEncontrado(null);

            try {
                // Endpoint para verificar si el ID existe y obtener sus detalles
                const response = await axios.get(`${API_URL}/check/${id}`);
                
                if (response.data.found) {
                    setProductoEncontrado(response.data.product);
                    setMensaje({ text: `Producto encontrado: ${response.data.product.nom_producto}. Stock actual: ${response.data.product.stock_actual}`, type: 'success' });
                }
            } catch (error) {
                // Captura el error 404 (Producto no encontrado)
                if (error.response && error.response.status === 404) {
                    setMensaje({ text: 'Producto no encontrado. Use la opción "Registrar Productos" para ítems nuevos.', type: 'error' });
                } else {
                    console.error("Error al verificar producto:", error);
                    setMensaje({ text: 'Error de conexión con el servidor.', type: 'error' });
                }
            } finally {
                setCargando(false);
            }
        }
    };
    
    // Función para manejar el envío del formulario (SOLO AUMENTO DE STOCK)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validaciones
        if (!productoEncontrado) {
            setMensaje({ text: 'Debe validar el ID de un producto existente.', type: 'error' });
            return;
        }
        if (!formData.cantidad_m || parseInt(formData.cantidad_m) <= 0) {
            setMensaje({ text: 'Ingrese una cantidad válida mayor a cero.', type: 'error' });
            return;
        }

        setCargando(true);
        setMensaje({ text: '', type: '' });

        // 2. Datos a enviar al backend
        const dataToSend = {
            id_usuario: formData.id_usuario,
            cantidad_m: formData.cantidad_m,
            observaciones: formData.observaciones,
            es_nuevo_producto: 'false', // ⬅️ CLAVE: Indica al backend que solo actualice el stock.
            id_producto_existente: formData.id_producto,
        };
        
        try {
            // Se usa la misma ruta /inventario, pero con es_nuevo_producto: 'false'
            const response = await axios.post(`${API_URL}/inventario`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            setMensaje({ text: response.data.message || 'Entrada registrada con éxito.', type: 'success' });
            
            // Limpiar campos después del éxito
            handleReset();

        } catch (error) {
            console.error("Error al registrar entrada:", error.response || error);
            const errorMessage = error.response?.data?.details || error.response?.data?.error || "Error al registrar la entrada de inventario.";
            setMensaje({ text: errorMessage, type: 'error' });
        } finally {
            setCargando(false);
        }
    };
    
    // Función para limpiar todos los campos y estados
    const handleReset = () => {
        setFormData({
            id_producto: '',
            cantidad_m: '',
            observaciones: '',
            id_usuario: 1,
        });
        setProductoEncontrado(null);
        setMensaje({ text: '', type: '' });
    };

    return (
        <div className="dashboard-layout">
            <Sidebarmov />
        
            <main className="contenido">
                <HeaderPanel title="➕ Registrar Entrada de Stock Existente"/>

                {/* Mostrar mensajes de éxito o error */}
                {mensaje.text && (
                    <div className={`alerta ${mensaje.type}`}>
                        {mensaje.text}
                    </div>
                )}

                <section className="cuadro-blanco form-producto">
                    
                    <form className="formulario" onSubmit={handleSubmit}>
                        
                        {/* === 1. ID Producto (BUSCADOR) === */}
                        <div className="campo">
                            <label htmlFor="id_producto">ID del Producto a Ingresar</label>
                            <input 
                                type="number" 
                                id="id_producto" 
                                name="id_producto" 
                                placeholder="Ingrese el ID y presione ENTER para buscar" 
                                required 
                                value={formData.id_producto}
                                onChange={handleChange}
                                onKeyPress={handleCheckProducto}
                                disabled={cargando}
                            />
                            {cargando && <p className="cargando">Buscando producto...</p>}
                        </div>

                        {/* === 2. DETALLES DEL PRODUCTO (Solo lectura) === */}
                        <div className="campo">
                            <label htmlFor="nombre_producto">Nombre del Producto</label>
                            <input 
                                type="text" 
                                id="nombre_producto" 
                                name="nombre_producto" 
                                placeholder="Producto no validado o no encontrado" 
                                required 
                                readOnly 
                                value={productoEncontrado ? productoEncontrado.nom_producto : ''}
                                className={productoEncontrado ? 'valido' : 'invalido'}
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="stock_actual">Stock Actual</label>
                            <input 
                                type="number" 
                                id="stock_actual" 
                                name="stock_actual" 
                                readOnly 
                                value={productoEncontrado ? productoEncontrado.stock_actual : ''}
                                placeholder="N/A"
                                className='info'
                            />
                        </div>

                        {/* === 3. CANTIDAD Y OBSERVACIONES === */}
                        <div className="campo">
                            <label htmlFor="cantidad_m">Cantidad ingresada</label>
                            <input 
                                type="number" 
                                id="cantidad_m" 
                                name="cantidad_m" 
                                placeholder="Cantidad de unidades que entran" 
                                required 
                                min="1"
                                value={formData.cantidad_m}
                                onChange={handleChange}
                                disabled={!productoEncontrado || cargando} // Deshabilitado si no hay producto validado
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="observaciones">Observaciones (Proveedor, #Factura, motivo)</label>
                            <textarea 
                                id="observaciones" 
                                name="observaciones" 
                                placeholder="Ej: Recibido de Proveedor X con Factura #1234" 
                                rows="3"
                                value={formData.observaciones}
                                onChange={handleChange}
                                disabled={!productoEncontrado || cargando}
                            ></textarea>
                        </div>

                        {/* === 4. BOTONES DE ACCIÓN === */}
                        <div className="botones">
                            <button type="submit" className="btn-guardar" disabled={!productoEncontrado || cargando}>
                                <i className="fa-solid fa-floppy-disk"></i> {cargando ? 'Registrando...' : 'Registrar Entrada'}
                            </button>
                            <button type="button" className="btn-cancelar" onClick={handleReset} disabled={cargando}>
                                <i className="fa-solid fa-xmark"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}