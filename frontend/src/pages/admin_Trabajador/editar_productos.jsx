import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/css/styles.css";
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext.jsx";

const API_URL = 'http://localhost:3000'; 

export default function EditarProducto() {
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); // Obtiene el ID de la URL
    const location = useLocation();
    const productoDesdeState = location.state?.producto; // Producto pasado desde la tabla

    const [formData, setFormData] = useState({
        nom_producto: '',
        precio_unitario: '',
        stock_actual: '',
        stock_minimo: '',
        color: '',
        talla: '',
        tamaño: '',
        descripcion: '',
        id_categoria: '',
        id_clasificacion: '',
        ruta_imagen: ''
    });

    const [imagenNueva, setImagenNueva] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    // Cargar datos del producto
    useEffect(() => {
        const cargarProducto = async () => {
            // Si viene desde el state (más rápido)
            if (productoDesdeState) {
                console.log("Cargando producto desde state:", productoDesdeState);
                setFormData({
                    nom_producto: productoDesdeState.nom_producto || '',
                    precio_unitario: productoDesdeState.precio_unitario || '',
                    stock_actual: productoDesdeState.stock_actual || '',
                    stock_minimo: productoDesdeState.stock_minimo || '',
                    color: productoDesdeState.color || '',
                    talla: productoDesdeState.talla || '',
                    tamaño: productoDesdeState.tamaño || '',
                    descripcion: productoDesdeState.descripcion || '',
                    id_categoria: productoDesdeState.id_categoria || '',
                    id_clasificacion: productoDesdeState.id_clasificacion || '',
                    ruta_imagen: productoDesdeState.ruta_imagen || ''
                });
                if (productoDesdeState.ruta_imagen) {
                    setImagenPreview(`http://localhost:3003${productoDesdeState.ruta_imagen}`);
                }
                setCargandoDatos(false);
                return;
            }

            // Si no viene desde state, cargar desde API
            if (id) {
                try {
                    console.log(" Cargando producto desde API, ID:", id);
                    const response = await axios.get(`${API_URL}/${id}`);
                    const producto = response.data;
                    
                    setFormData({
                        nom_producto: producto.nom_producto || '',
                        precio_unitario: producto.precio_unitario || '',
                        stock_actual: producto.stock_actual || '',
                        stock_minimo: producto.stock_minimo || '',
                        color: producto.color || '',
                        talla: producto.talla || '',
                        tamaño: producto.tamaño || '',
                        descripcion: producto.descripcion || '',
                        id_categoria: producto.id_categoria || '',
                        id_clasificacion: producto.id_clasificacion || '',
                        ruta_imagen: producto.ruta_imagen || ''
                    });

                    if (producto.ruta_imagen) {
                        setImagenPreview(`http://localhost:3003${producto.ruta_imagen}`);
                    }
                } catch (error) {
                    console.error("Error al cargar producto:", error);
                    setMensaje({ 
                        text: "Error al cargar el producto. Verifica que el ID sea correcto.", 
                        type: 'error' 
                    });
                }
            }
            setCargandoDatos(false);
        };

        cargarProducto();
    }, [id, productoDesdeState]);

    // Cargar categorías y clasificaciones
    useEffect(() => {
        const fetchExternalData = async () => {
            try {
                const [catRes, clasRes] = await Promise.all([
                    axios.get(CATEGORIAS_URL),
                    axios.get(CLASIFICACIONES_URL),
                ]);
                setCategorias(catRes.data);
                setClasificaciones(clasRes.data);
            } catch (error) {
                console.error("Error al cargar datos externos:", error);
            }
        };
        fetchExternalData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagenNueva(file);
        
        // Preview de la nueva imagen
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("=".repeat(60));
        console.log(" INICIANDO ACTUALIZACIÓN DE PRODUCTO");
        console.log("=".repeat(60));
        console.log(" ID Producto:", id || productoDesdeState?.id_producto);
        console.log(" Datos:", formData);
        console.log("=".repeat(60));

        setCargando(true);
        setMensaje({ text: '', type: '' });

        // Validaciones
        if (!formData.nom_producto || !formData.precio_unitario || !formData.id_categoria || !formData.id_clasificacion) {
            setMensaje({ 
                text: "Faltan campos obligatorios: Nombre, Precio, Categoría y Clasificación.", 
                type: 'error' 
            });
            setCargando(false);
            return;
        }

        const data = new FormData();
        
        // Agregar todos los campos
        Object.keys(formData).forEach(key => {
            if (formData[key] !== '' && formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        // Agregar nueva imagen si existe
        if (imagenNueva) {
            data.append('imagen_producto', imagenNueva);
        }

        // Agregar ID de usuario para auditoría
        data.append('id_usuario', userId || 'Adm-01');

        try {
            const productoId = id || productoDesdeState?.id_producto;
            console.log(" Enviando actualización a:", `${API_URL}/${productoId}`);

            const response = await axios.put(`${API_URL}/${productoId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(" Producto actualizado:", response.data);

            setMensaje({ 
                text: response.data.message || "Producto actualizado con éxito.", 
                type: 'success' 
            });

            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/productos');
            }, 2000);

        } catch (error) {
            console.error(" Error al actualizar:", error);
            const errorMessage = error.response?.data?.details || 
                                error.response?.data?.error || 
                                "Error al actualizar el producto.";
            setMensaje({ text: ` ${errorMessage}`, type: 'error' });
        } finally {
            setCargando(false);
        }
    };

    const handleCancel = () => {
        navigate('/productos');
    };

    if (cargandoDatos) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="contenido">
                    <HeaderPanel title="Editar Producto" />
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>Cargando datos del producto...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
        
            <main className="contenido">
                <HeaderPanel title={`Editar Producto ${id ? `#${id}` : ''}`} />

                {mensaje.text && (
                    <div className={`alerta ${mensaje.type}`} style={{
                        padding: '15px',
                        marginBottom: '20px',
                        borderRadius: '5px',
                        backgroundColor: mensaje.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: mensaje.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${mensaje.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {mensaje.text}
                    </div>
                )}

                <section className="cuadro-blanco form-producto">
                    <form className="formulario" onSubmit={handleSubmit}>
                        
                        <h2>Información del Producto</h2>
                        
                        <div className="campo">
                            <label htmlFor="nom_producto">Nombre del Producto *</label>
                            <input 
                                type="text" 
                                id="nom_producto" 
                                name="nom_producto" 
                                placeholder="Nombre completo del producto" 
                                required 
                                value={formData.nom_producto} 
                                onChange={handleChange} 
                                disabled={cargando} 
                            />
                        </div>
                        
                        <div className="campo">
                            <label htmlFor="precio_unitario">Precio Unitario (Venta) *</label>
                            <input 
                                type="number" 
                                id="precio_unitario" 
                                name="precio_unitario" 
                                placeholder="Precio al que se venderá" 
                                required 
                                min="0.01" 
                                step="0.01" 
                                value={formData.precio_unitario} 
                                onChange={handleChange} 
                                disabled={cargando} 
                            />
                        </div>
                        
                        <div className="campo-grupo">
                            <div className="campo">
                                <label htmlFor="stock_actual">Stock Actual</label>
                                <input 
                                    type="number" 
                                    id="stock_actual" 
                                    name="stock_actual" 
                                    placeholder="Cantidad en inventario" 
                                    min="0" 
                                    value={formData.stock_actual} 
                                    onChange={handleChange} 
                                    disabled={cargando} 
                                />
                                <small style={{ color: '#666', fontSize: '12px' }}>
                                    Para modificar stock, usa el sistema de movimientos
                                </small>
                            </div>
                            <div className="campo">
                                <label htmlFor="stock_minimo">Stock Mínimo (Alerta)</label>
                                <input 
                                    type="number" 
                                    id="stock_minimo" 
                                    name="stock_minimo" 
                                    placeholder="Mínimo para alerta" 
                                    min="0" 
                                    value={formData.stock_minimo} 
                                    onChange={handleChange} 
                                    disabled={cargando} 
                                />
                            </div>
                        </div>

                        <h2>Clasificación y Atributos</h2>
                        
                        <div className="campo-grupo">
                            <div className="campo">
                                <label htmlFor="id_categoria">Categoría *</label>
                                <select 
                                    id="id_categoria" 
                                    name="id_categoria" 
                                    required 
                                    value={formData.id_categoria} 
                                    onChange={handleChange} 
                                    disabled={cargando}
                                >
                                    <option value="">Seleccione Categoría</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>
                                            {cat.nombre_c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="campo">
                                <label htmlFor="id_clasificacion">Clasificación *</label>
                                <select 
                                    id="id_clasificacion" 
                                    name="id_clasificacion" 
                                    required
                                    value={formData.id_clasificacion} 
                                    onChange={handleChange} 
                                    disabled={cargando}
                                >
                                    <option value="">Seleccione Clasificación</option>
                                    {clasificaciones.map(clas => (
                                        <option key={clas.id_clasificacion} value={clas.id_clasificacion}>
                                            {clas.nombre_clas}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="campo">
                            <label htmlFor="imagen_producto">Cambiar Imagen del Producto</label>
                            
                            {imagenPreview && (
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ fontSize: '14px', color: '#666' }}>Imagen actual:</p>
                                    <img 
                                        src={imagenPreview} 
                                        alt="Preview" 
                                        style={{ 
                                            width: '150px', 
                                            height: '150px', 
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '2px solid #ddd'
                                        }} 
                                    />
                                </div>
                            )}
                            
                            <input 
                                type="file" 
                                id="imagen_producto" 
                                name="imagen_producto" 
                                onChange={handleImageChange} 
                                accept="image/*" 
                                disabled={cargando} 
                            />
                            <small style={{ color: '#666', fontSize: '12px' }}>
                                Deja vacío para mantener la imagen actual
                            </small>
                        </div>

                        <div className="campo-grupo">
                            <div className="campo">
                                <label htmlFor="color">Color</label>
                                <input 
                                    type="text" 
                                    id="color" 
                                    name="color" 
                                    value={formData.color} 
                                    onChange={handleChange} 
                                    disabled={cargando} 
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="talla">Talla</label>
                                <input 
                                    type="text" 
                                    id="talla" 
                                    name="talla" 
                                    value={formData.talla} 
                                    onChange={handleChange} 
                                    disabled={cargando} 
                                />
                            </div>
                            <div className="campo">
                                <label htmlFor="tamaño">Tamaño</label>
                                <input 
                                    type="text" 
                                    id="tamaño" 
                                    name="tamaño" 
                                    value={formData.tamaño} 
                                    onChange={handleChange} 
                                    disabled={cargando} 
                                />
                            </div>
                        </div>
                        
                        <div className="campo">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea 
                                id="descripcion" 
                                name="descripcion" 
                                placeholder="Detalles completos del producto..." 
                                rows="3" 
                                value={formData.descripcion} 
                                onChange={handleChange} 
                                disabled={cargando}
                            ></textarea>
                        </div>

                        <div className="botones">
                            <button 
                                type="submit" 
                                className="btn-guardar" 
                                disabled={cargando}
                            >
                                <i className="fa-solid fa-floppy-disk"></i> 
                                {cargando ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            
                            <button 
                                type="button" 
                                className="btn-cancelar"
                                onClick={handleCancel}
                                disabled={cargando}
                            >
                                <i className="fa-solid fa-xmark"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}