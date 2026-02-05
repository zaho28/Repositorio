import React, { useState, useContext } from "react";
import Sidebarmov from "../../components/Sidebarmov";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css"; 
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext.jsx"; 
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:3001/api/productos"; 

export default function FormularioSalidaProducto() {
    
    const navigate = useNavigate();
    const { userId, userName } = useContext(AuthContext); 

    const [formData, setFormData] = useState({
        // Datos del producto
        id_producto: '',
        cantidad: '',
        
        // Datos del cliente
        nombre_cliente: '',
        telefono_cliente: '',
        documento_cliente: '',
        correo_cliente: '',
        
        // Datos de la venta
        metodo_pago: 'efectivo',
        precio_venta: '',
        descuento: '0',
        
        // Observaciones adicionales
        observaciones: '',
        
        // Usuario que registra (admin)
        id_usuario: userId || 'Adm-01',
    });

    const [productoEncontrado, setProductoEncontrado] = useState(null);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [cargando, setCargando] = useState(false);
    const [mostrarResumen, setMostrarResumen] = useState(false);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'id_producto') {
            setProductoEncontrado(null);
            setMensaje({ text: '', type: '' });
            setMostrarResumen(false);
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
                    
                    // Auto-llenar el precio de venta con el precio del producto
                    setFormData(prev => ({
                        ...prev,
                        precio_venta: response.data.product.precio_unitario || ''
                    }));
                    
                    setMensaje({ 
                        text: ` Producto encontrado: ${response.data.product.nom_producto} | Stock: ${response.data.product.stock_actual}`, 
                        type: 'success' 
                    });
                    
                    document.getElementById('cantidad').focus(); 
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
    
    // Calcular totales
    const calcularSubtotal = () => {
        if (!formData.cantidad || !formData.precio_venta) return 0;
        return parseFloat(formData.cantidad) * parseFloat(formData.precio_venta);
    };

    const calcularDescuento = () => {
        const descuento = parseFloat(formData.descuento) || 0;
        return (calcularSubtotal() * descuento) / 100;
    };

    const calcularTotal = () => {
        return calcularSubtotal() - calcularDescuento();
    };

    // Vista previa antes de confirmar
    const handlePreview = (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!productoEncontrado) {
            setMensaje({ text: 'Primero valide el producto con el ID y ENTER.', type: 'error' });
            return;
        }

        if (!formData.cantidad || parseInt(formData.cantidad) <= 0) {
            setMensaje({ text: 'La cantidad debe ser un número positivo.', type: 'error' });
            return;
        }

        if (parseInt(formData.cantidad) > productoEncontrado.stock_actual) {
            setMensaje({ 
                text: `Stock insuficiente. Disponible: ${productoEncontrado.stock_actual}`, 
                type: 'error' 
            });
            return;
        }

        if (!formData.nombre_cliente.trim()) {
            setMensaje({ text: 'El nombre del cliente es obligatorio.', type: 'error' });
            return;
        }

        if (!formData.telefono_cliente.trim()) {
            setMensaje({ text: 'El teléfono del cliente es obligatorio.', type: 'error' });
            return;
        }

        setMostrarResumen(true);
        setMensaje({ text: '', type: '' });
    };
    
    // CONFIRMAR Y ENVIAR VENTA
    const handleConfirmarVenta = async () => {
        setCargando(true);
        setMensaje({ text: '', type: '' });

        // Construir observaciones detalladas
        const observacionesCompletas = `
VENTA MANUAL PRESENCIAL
CLIENTE:
   Nombre: ${formData.nombre_cliente}
   Teléfono: ${formData.telefono_cliente}
   ${formData.documento_cliente ? `Documento: ${formData.documento_cliente}` : ''}
   ${formData.correo_cliente ? `Correo: ${formData.correo_cliente}` : ''}

 DETALLES DE VENTA:
   Cantidad: ${formData.cantidad} unidad(es)
   Precio Unitario: $${parseFloat(formData.precio_venta).toLocaleString('es-CO')}
   Subtotal: $${calcularSubtotal().toLocaleString('es-CO')}
   ${formData.descuento > 0 ? `Descuento (${formData.descuento}%): -$${calcularDescuento().toLocaleString('es-CO')}` : ''}
   Total: $${calcularTotal().toLocaleString('es-CO')}
   Método de Pago: ${formData.metodo_pago.toUpperCase()}

Registrado por: ${userName || userId || 'Administrador'}
${formData.observaciones ? `\n Notas: ${formData.observaciones}` : ''}
        `.trim();

        const dataToSend = {
            id_producto: formData.id_producto,
            cantidad: parseInt(formData.cantidad),
            id_usuario: userId || 'Adm-01',
            observaciones: observacionesCompletas
        };
        
        try {
            const response = await axios.post(`${API_URL}/salida`, dataToSend, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            setMensaje({ 
                text: `¡Venta registrada exitosamente! Nuevo stock: ${response.data.nuevo_stock}`, 
                type: 'success' 
            });
            
            // Mostrar resumen final por 3 segundos antes de redirigir
            setTimeout(() => {
                navigate('/productos');
            }, 3000);

        } catch (error) {
            const details = error.response?.data?.details || error.message;
            console.error("Error al registrar venta:", error);
            setMensaje({ text: `Error: ${details}`, type: 'error' });
            setMostrarResumen(false);
        } finally {
            setCargando(false);
        }
    };
    
    const handleReset = () => {
        setFormData({
            id_producto: '',
            cantidad: '',
            nombre_cliente: '',
            telefono_cliente: '',
            documento_cliente: '',
            correo_cliente: '',
            metodo_pago: 'efectivo',
            precio_venta: '',
            descuento: '0',
            observaciones: '',
            id_usuario: userId || 'Adm-01',
        });
        setProductoEncontrado(null);
        setMensaje({ text: '', type: '' });
        setMostrarResumen(false);
    };

    const handleEditarVenta = () => {
        setMostrarResumen(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebarmov />
            <main className="contenido">
                <HeaderPanel title="Venta Manual/Presencial"/>

                {mensaje.text && (
                    <div className={`alerta ${mensaje.type}`}>
                        {mensaje.text}
                    </div>
                )}

                <section className="cuadro-blanco form-producto">
                    
                    {!mostrarResumen ? (
                        <form className="formulario" onSubmit={handlePreview}>
                            
                            {/* ========== SECCIÓN: INFORMACIÓN DEL PRODUCTO ========== */}
                            <div style={{
                                backgroundColor: '#f0f4f8',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                borderLeft: '4px solid #3498db'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#3498db' }}>
                                    Información del Producto
                                </h3>

                                <div className="campo">
                                    <label htmlFor="id_producto">
                                        ID del Producto <span style={{ color: 'red' }}>*</span>
                                        <small style={{ color: '#666', marginLeft: '10px' }}>
                                            (Presiona Enter para buscar)
                                        </small>
                                    </label>
                                    <input 
                                        type="number" 
                                        id="id_producto" 
                                        name="id_producto" 
                                        placeholder="Ingrese el ID y presione ENTER" 
                                        required 
                                        value={formData.id_producto}
                                        onChange={handleChange}
                                        onKeyDown={handleCheckProducto} 
                                        disabled={cargando}
                                        style={{ 
                                            borderColor: productoEncontrado ? '#2ecc71' : (formData.id_producto ? '#f39c12' : '#ccc'),
                                            borderWidth: '2px'
                                        }}
                                    />
                                </div>

                                {productoEncontrado && (
                                    <div className="campo-grupo" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                                        <div className="campo">
                                            <label>Nombre del Producto</label>
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={productoEncontrado.nom_producto}
                                                className="valido"
                                                style={{ backgroundColor: '#e8f5e9', fontWeight: 'bold' }}
                                            />
                                        </div>
                                        <div className="campo">
                                            <label>Stock Disponible</label>
                                            <input 
                                                type="number" 
                                                readOnly 
                                                value={productoEncontrado.stock_actual}
                                                style={{ 
                                                    fontWeight: 'bold', 
                                                    fontSize: '18px',
                                                    color: '#2ecc71',
                                                    backgroundColor: '#e8f5e9',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </div>
                                        <div className="campo">
                                            <label>Precio Sugerido</label>
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={`$${parseFloat(productoEncontrado.precio_unitario || 0).toLocaleString('es-CO')}`}
                                                style={{ 
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#e8f5e9',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="campo-grupo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                    <div className="campo">
                                        <label htmlFor="cantidad">
                                            Cantidad <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            id="cantidad" 
                                            name="cantidad" 
                                            placeholder="Ej: 2" 
                                            required 
                                            min="1"
                                            max={productoEncontrado ? productoEncontrado.stock_actual : undefined}
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>

                                    <div className="campo">
                                        <label htmlFor="precio_venta">
                                            Precio de Venta <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            id="precio_venta" 
                                            name="precio_venta" 
                                            placeholder="Precio" 
                                            required 
                                            min="0"
                                            step="0.01"
                                            value={formData.precio_venta}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>

                                    <div className="campo">
                                        <label htmlFor="descuento">
                                            Descuento (%)
                                        </label>
                                        <input 
                                            type="number" 
                                            id="descuento" 
                                            name="descuento" 
                                            placeholder="0" 
                                            min="0"
                                            max="100"
                                            value={formData.descuento}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ========== SECCIÓN: INFORMACIÓN DEL CLIENTE ========== */}
                            <div style={{
                                backgroundColor: '#fff8e1',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                borderLeft: '4px solid #f39c12'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#f39c12' }}>
                                    Información del Cliente
                                </h3>

                                <div className="campo-grupo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="campo">
                                        <label htmlFor="nombre_cliente">
                                            Nombre Completo <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="nombre_cliente" 
                                            name="nombre_cliente" 
                                            placeholder="Ej: Juan Pérez" 
                                            required 
                                            value={formData.nombre_cliente}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                        />
                                    </div>

                                    <div className="campo">
                                        <label htmlFor="telefono_cliente">
                                            Teléfono <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            id="telefono_cliente" 
                                            name="telefono_cliente" 
                                            placeholder="Ej: 3001234567" 
                                            required
                                            maxLength="10"
                                            value={formData.telefono_cliente}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                        />
                                    </div>
                                </div>

                                <div className="campo-grupo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="campo">
                                        <label htmlFor="documento_cliente">
                                            Documento (Opcional)
                                        </label>
                                        <input 
                                            type="text" 
                                            id="documento_cliente" 
                                            name="documento_cliente" 
                                            placeholder="CC, CE, TI" 
                                            value={formData.documento_cliente}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                        />
                                    </div>

                                    <div className="campo">
                                        <label htmlFor="correo_cliente">
                                            Correo Electrónico (Opcional)
                                        </label>
                                        <input 
                                            type="email" 
                                            id="correo_cliente" 
                                            name="correo_cliente" 
                                            placeholder="ejemplo@correo.com" 
                                            value={formData.correo_cliente}
                                            onChange={handleChange}
                                            disabled={!productoEncontrado || cargando}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ========== SECCIÓN: DETALLES DE PAGO ========== */}
                            <div style={{
                                backgroundColor: '#e8f5e9',
                                padding: '15px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                borderLeft: '4px solid #2ecc71'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#2ecc71' }}>
                                    Detalles de Pago
                                </h3>

                                <div className="campo">
                                    <label htmlFor="metodo_pago">
                                        Método de Pago <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        id="metodo_pago"
                                        name="metodo_pago"
                                        value={formData.metodo_pago}
                                        onChange={handleChange}
                                        disabled={!productoEncontrado || cargando}
                                        style={{ 
                                            padding: '10px',
                                            fontSize: '15px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <option value="efectivo"> Efectivo</option>
                                        <option value="tarjeta"> Tarjeta</option>
                                        <option value="transferencia"> Transferencia</option>
                                        <option value="nequi"> Nequi</option>
                                        <option value="daviplata"> DaviPlata</option>
                                    </select>
                                </div>

                                {/* Vista previa de totales */}
                                {productoEncontrado && formData.cantidad && formData.precio_venta && (
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        marginTop: '15px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '500' }}>Subtotal:</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                ${calcularSubtotal().toLocaleString('es-CO')}
                                            </span>
                                        </div>
                                        {formData.descuento > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e74c3c' }}>
                                                <span>Descuento ({formData.descuento}%):</span>
                                                <span>-${calcularDescuento().toLocaleString('es-CO')}</span>
                                            </div>
                                        )}
                                        <hr style={{ margin: '10px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</span>
                                            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2ecc71' }}>
                                                ${calcularTotal().toLocaleString('es-CO')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ========== OBSERVACIONES ADICIONALES ========== */}
                            <div className="campo">
                                <label htmlFor="observaciones">
                                    Observaciones Adicionales
                                </label>
                                <textarea 
                                    id="observaciones" 
                                    name="observaciones" 
                                    rows="3"
                                    placeholder="Detalles adicionales de la venta, acuerdos, garantías, etc."
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    disabled={!productoEncontrado || cargando}
                                    style={{ resize: 'vertical' }}
                                ></textarea>
                            </div>

                            {/* ========== BOTONES ========== */}
                            <div className="botones">
                                <button 
                                    type="submit" 
                                    className="btn-guardar" 
                                    disabled={!productoEncontrado || cargando}
                                    style={{
                                        opacity: (!productoEncontrado || cargando) ? 0.5 : 1
                                    }}
                                >
                                    <i className="fa-solid fa-eye"></i> Vista Previa
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-cancelar" 
                                    onClick={handleReset} 
                                    disabled={cargando}
                                >
                                    <i className="fa-solid fa-rotate-left"></i> Limpiar Formulario
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* ========== RESUMEN DE VENTA ========== */
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            <div style={{
                                backgroundColor: '#fff',
                                padding: '30px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <h2 style={{ 
                                    textAlign: 'center', 
                                    color: '#2c3e50',
                                    marginBottom: '25px',
                                    borderBottom: '3px solid #3498db',
                                    paddingBottom: '15px'
                                }}>
                                     Confirmación de Venta
                                </h2>

                                {/* Producto */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#3498db', marginBottom: '10px' }}> Producto</h3>
                                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                        <p><strong>Nombre:</strong> {productoEncontrado.nom_producto}</p>
                                        <p><strong>Cantidad:</strong> {formData.cantidad} unidad(es)</p>
                                        <p><strong>Precio Unitario:</strong> ${parseFloat(formData.precio_venta).toLocaleString('es-CO')}</p>
                                    </div>
                                </div>

                                {/* Cliente */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#f39c12', marginBottom: '10px' }}> Cliente</h3>
                                    <div style={{ backgroundColor: '#fff8e1', padding: '15px', borderRadius: '8px' }}>
                                        <p><strong>Nombre:</strong> {formData.nombre_cliente}</p>
                                        <p><strong>Teléfono:</strong> {formData.telefono_cliente}</p>
                                        {formData.documento_cliente && <p><strong>Documento:</strong> {formData.documento_cliente}</p>}
                                        {formData.correo_cliente && <p><strong>Correo:</strong> {formData.correo_cliente}</p>}
                                    </div>
                                </div>

                                {/* Totales */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#2ecc71', marginBottom: '10px' }}> Totales</h3>
                                    <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>Subtotal:</span>
                                            <span style={{ fontWeight: 'bold' }}>${calcularSubtotal().toLocaleString('es-CO')}</span>
                                        </div>
                                        {formData.descuento > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e74c3c' }}>
                                                <span>Descuento ({formData.descuento}%):</span>
                                                <span>-${calcularDescuento().toLocaleString('es-CO')}</span>
                                            </div>
                                        )}
                                        <hr style={{ margin: '10px 0', borderColor: '#2ecc71' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>TOTAL:</span>
                                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
                                                ${calcularTotal().toLocaleString('es-CO')}
                                            </span>
                                        </div>
                                        <p style={{ marginTop: '10px', fontSize: '14px' }}>
                                            <strong>Método de Pago:</strong> {formData.metodo_pago.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                {formData.observaciones && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{ color: '#95a5a6', marginBottom: '10px' }}>Observaciones</h3>
                                        <div style={{ backgroundColor: '#ecf0f1', padding: '15px', borderRadius: '8px' }}>
                                            <p>{formData.observaciones}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="botones">
                                    <button 
                                        onClick={handleConfirmarVenta}
                                        className="btn-guardar"
                                        disabled={cargando}
                                        style={{
                                            opacity: cargando ? 0.5 : 1,
                                            fontSize: '16px',
                                            padding: '15px 30px'
                                        }}
                                    >
                                        {cargando ? (
                                            <>Procesando...</>
                                        ) : (
                                            <>Confirmar Venta</>
                                        )}
                                    </button>
                                    <button 
                                        onClick={handleEditarVenta}
                                        className="btn-cancelar"
                                        disabled={cargando}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}