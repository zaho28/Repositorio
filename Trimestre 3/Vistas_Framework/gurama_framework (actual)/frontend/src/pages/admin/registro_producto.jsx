import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom"; 
import Sidebarmov from "../../components/Sidebarmov"; 
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css"; 
import axios from 'axios'; 

const API_URL = "http://localhost:3001/api/productos"; 
const CATEGORIAS_URL = "http://localhost:3001/api/categorias"; 
const CLASIFICACIONES_URL = "http://localhost:3001/api/clasificaciones"; 

export default function FormularioProductoNuevo() {
    
    const [formData, setFormData] = useState({
        nom_producto: '',
        precio_unitario: '',
        stock_actual: '', // Stock inicial, que se convierte en cantidad_m
        stock_minimo: 0,
        color: '',
        talla: '',
        tamaño: '',
        descripcion: '',
        id_categoria: '',
        id_clasificacion: '',
        observaciones: 'Stock inicial registrado al crear producto.', // Observación por defecto
        id_usuario: 1, // ID del usuario que registra 
    });

    const [imagen, setImagen] = useState(null); // Para el archivo de imagen
    const [categorias, setCategorias] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);

    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [cargando, setCargando] = useState(false);

    // Carga de Categorías y Clasificaciones
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
                setMensaje({ text: 'Error al cargar categorías/clasificaciones.', type: 'error' });
            }
        };
        fetchExternalData();
    }, []);

    // Manejar cambios en los campos de texto y número
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejar cambio de imagen
    const handleImageChange = (e) => {
        setImagen(e.target.files[0]);
    };
    
    // Función de limpieza de estados
    const handleReset = () => {
        setFormData({
            nom_producto: '', precio_unitario: '', stock_actual: '', stock_minimo: 0,
            color: '', talla: '', tamaño: '', descripcion: '', 
            id_categoria: '', id_clasificacion: '',
            observaciones: 'Stock inicial registrado al crear producto.',
            id_usuario: 1, 
        });
        setImagen(null);
        setMensaje({ text: '', type: '' });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setCargando(true);
        setMensaje({ text: '', type: '' });

        // Validaciones
        if (!formData.nom_producto || !formData.precio_unitario || !formData.id_categoria || !formData.stock_actual) {
            setMensaje({ text: "Faltan campos obligatorios (Nombre, Precio, Categoría, Stock Inicial).", type: 'error' });
            setCargando(false); 
            return;
        }

        // Crear FormData
        const data = new FormData();
        
        // Mapear los campos del formulario a los nombres esperados por el backend
        Object.keys(formData).forEach(key => {
            // Renombrar 'stock_actual' a 'cantidad_m' para que el backend lo use como stock inicial
            if (key === 'stock_actual') {
                data.append('cantidad_m', formData[key]);
            } else {
                data.append(key, formData[key]);
            }
        });
        
        // La clave mágica que activa la lógica de producto nuevo en el backend
        data.append('es_nuevo_producto', 'true');

        // Adjuntar Imagen
        if (imagen) {
            data.append('imagen_producto', imagen);
        }

        try {
            // Enviamos los datos a la ruta de inventario/registro
            const response = await axios.post(`${API_URL}/inventario`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setMensaje({ 
                text: response.data.message || `Producto registrado. ID: ${response.data.id_producto}`, 
                type: 'success' 
            });
            handleReset(); 

        } catch (error) {
            console.error("Error al registrar producto:", error.response || error);
            const errorMessage = error.response?.data?.details || error.response?.data?.error || "Error al registrar el producto.";
            setMensaje({ text: errorMessage, type: 'error' });
        } finally {
            setCargando(false);
        }
    };
    
    return (
        <div className="dashboard-layout">
            <Sidebarmov />
        
            <main className="contenido">
                <HeaderPanel title=" Registrar Nuevo Producto en Catálogo"/>

                {mensaje.text && (
                    <div className={`alerta ${mensaje.type}`}>
                        {mensaje.text}
                    </div>
                )}

                <section className="cuadro-blanco form-producto">
                    <form className="formulario" onSubmit={handleSubmit}>
                        
                        <h2>Información General y Stock Inicial</h2>
                        
                        {/* Nombre del Producto */}
                        <div className="campo">
                            <label htmlFor="nom_producto">Nombre del Producto *</label>
                            <input type="text" id="nom_producto" name="nom_producto" placeholder="Nombre completo del producto" required value={formData.nom_producto} onChange={handleChange} disabled={cargando} />
                        </div>
                        
                        {/* Precio Unitario */}
                        <div className="campo">
                            <label htmlFor="precio_unitario">Precio Unitario (Venta) *</label>
                            <input type="number" id="precio_unitario" name="precio_unitario" placeholder="Precio al que se venderá" required min="0.01" step="any" value={formData.precio_unitario} onChange={handleChange} disabled={cargando} />
                        </div>
                        
                        {/* Stock Inicial y Stock Mínimo */}
                        <div className="campo-grupo">
                            <div className="campo">
                                <label htmlFor="stock_actual">Stock Inicial (Entrada) *</label>
                                <input type="number" id="stock_actual" name="stock_actual" placeholder="Cantidad inicial en inventario" required min="1" value={formData.stock_actual} onChange={handleChange} disabled={cargando} />
                            </div>
                            <div className="campo">
                                <label htmlFor="stock_minimo">Stock Mínimo (Alerta)</label>
                                <input type="number" id="stock_minimo" name="stock_minimo" placeholder="Mínimo para alerta" min="0" value={formData.stock_minimo} onChange={handleChange} disabled={cargando} />
                            </div>
                        </div>

                        <h2>Clasificación y Atributos</h2>
                        
                        {/* Categoría y Clasificación */}
                        <div className="campo-grupo">
                            <div className="campo">
                                <label htmlFor="id_categoria">Categoría </label>
                                <select id="id_categoria" name="id_categoria" required value={formData.id_categoria} onChange={handleChange} disabled={cargando}>
                                    <option value="">Seleccione Categoría </option>
                                    {categorias.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="campo">
                                <label htmlFor="id_clasificacion">Clasificación</label>
                                <select id="id_clasificacion" name="id_clasificacion" value={formData.id_clasificacion} onChange={handleChange} disabled={cargando}>
                                    <option value="">Seleccione Clasificación</option>
                                    {clasificaciones.map(clas => (
                                    <option key={clas.id_clasificacion} value={clas.id_clasificacion}>{clas.nombre_clas}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Imagen del Producto */}
                        <div className="campo">
                            <label htmlFor="imagen_producto">Imagen del Producto (Opcional)</label>
                            <input type="file" id="imagen_producto" name="imagen_producto" onChange={handleImageChange} accept="image/*" disabled={cargando} />
                        </div>

                        {/* Atributos opcionales */}
                        <div className="campo-grupo">
                            <div className="campo">
                                <label htmlFor="color">Color</label>
                                <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} disabled={cargando} />
                            </div>
                            <div className="campo">
                                <label htmlFor="talla">Talla</label>
                                <input type="text" id="talla" name="talla" value={formData.talla} onChange={handleChange} disabled={cargando} />
                            </div>
                            <div className="campo">
                                <label htmlFor="tamaño">Tamaño</label>
                                <input type="text" id="tamaño" name="tamaño" value={formData.tamaño} onChange={handleChange} disabled={cargando} />
                            </div>
                        </div>
                        
                        {/* Descripción y Observaciones */}
                        <div className="campo">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea id="descripcion" name="descripcion" placeholder="Detalles completos del producto..." rows="3" value={formData.descripcion} onChange={handleChange} disabled={cargando}></textarea>
                        </div>
                        
                        <div className="campo">
                            <label htmlFor="observaciones">Observaciones de Registro</label>
                            <textarea 
                                id="observaciones" 
                                name="observaciones" 
                                placeholder="Notas sobre el proveedor, factura de compra, etc." 
                                rows="2"
                                value={formData.observaciones}
                                onChange={handleChange}
                                disabled={cargando}
                            ></textarea>
                        </div>

                        {/* Botones de acción */}
                        <div className="botones">
                            <button type="submit" className="btn-guardar" disabled={cargando}>
                                <i className="fa-solid fa-plus"></i> {cargando ? 'Registrando...' : 'Registrar Nuevo Producto'}
                            </button>
                            
                            <Link to="/productos">
                            <button type="button" className="btn-cancelar">
                                <i className="fa-solid fa-xmark"></i> Cancelar
                            </button>
                            </Link>

                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}