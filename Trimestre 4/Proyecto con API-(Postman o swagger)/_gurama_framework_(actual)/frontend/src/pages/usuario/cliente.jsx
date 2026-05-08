import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

//estilos
import "../../components/cliente.css";
//imagenes
import img_cliente from "../../assets/2.png";
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx'; 

const API_URL = "http://localhost:3001/api/productos";

const Cliente = () => {
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [mostrarVentana, setMostrarVentana] = useState(false);
    const [productosNuevos, setProductosNuevos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Cargar productos nuevos
    useEffect(() => {
        const fetchProductosNuevos = async () => {
            try {
                setCargando(true);
                const response = await axios.get(API_URL);
                const productos = response.data;
                
                // Filtrar solo productos con clasificación "nuevo" o "nuevos"
                const nuevos = productos.filter(p => 
                    p.nombre_clas && 
                    (p.nombre_clas.toLowerCase() === 'nuevo' || 
                     p.nombre_clas.toLowerCase() === 'nuevos')
                ).slice(0, 4); // Mostrar máximo 4 productos
                
                setProductosNuevos(nuevos);
            } catch (error) {
                console.error("Error al cargar productos nuevos:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchProductosNuevos();
    }, []);

    // Mostrar ventana emergente al cargar
    useEffect(() => {
        setMostrarVentana(true);
    }, []);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/catalogo_c?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    
    const handleCerrarVentana = () => {
        setMostrarVentana(false);
    };
    
    // Redirigir al catálogo con filtro de ofertas
    const handleVerOfertas = () => {
        setMostrarVentana(false);
        navigate('/catalogo_c?clasificacion=En Oferta');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Función para obtener la URL de la imagen
    const getImageUrl = (rutaImagen) => {
        if (!rutaImagen) return 'https://via.placeholder.com/200x200?text=Sin+Imagen';
        return `http://localhost:3001${rutaImagen}`;
    };

    return (
        <>
        <Header />
        
        <main>
            <section className="buscador">
                <input 
                    type="text" 
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>🔍︎</button> 
            </section>
            
            <div className="hero">
                <div className="hero-texto">
                    <div className="titulo_principal">
                        <h1>Gurama</h1>
                        <h2>Confecciones y pedidos</h2>
                    </div>

                    <div className="subtitulo">
                        <h2>
                            <span className="subtitulo-parte1">¡Crea momentos especiales con nuestros </span>
                            <span className="subtitulo-parte2">amigurumis y sábanas personalizadas!</span>
                        </h2>
                    </div>
                </div>

                <div className="hero-imagen">
                    <img src={img_cliente} alt="imagen" />
                </div>
            </div>

            {/* VENTANA EMERGENTE DE OFERTAS */}
            {mostrarVentana && (
                <div id="ventana" className="ventana" style={{ display: "flex" }}>
                    <div className="ventana-contenido">
                        <span className="cerrar" onClick={handleCerrarVentana}> 
                            &times;
                        </span>
                        <section className="hero">
                        <div className="hero-texto">
                            <h2>¡Descubre nuestras mejores ofertas!</h2>
                            <p>Dale un toque tierno y único a tu mundo con nuestros amigurumis hechos a mano.</p>
                            <p>O decora tu cama con nuestras sabanas y cubrelechos</p>
                            <p>Hasta 30% de descuento en modelos seleccionados.</p>
                            <p>Hechos con amor, perfectos para regalar o coleccionar.</p>
                        </div>
                        <div className="hero-imagen">
                            <img src={img_cliente} alt="imagen" />
                        </div>
                        </section>
                        
                        <button 
                            onClick={handleVerOfertas} 
                            className="boton-ver"
                            style={{ marginTop: '20px' }}
                        >
                            Ver ofertas
                        </button>
                    </div>
                </div>
            )}

            <section className="promocion">
                <p>Sorprende a tus seres queridos con regalos únicos y hechos con amor</p>
                <Link to="/catalogo_c" className="boton-principal">Explora nuestro catálogo</Link>
            </section>

            {/* SECCIÓN DE PRODUCTOS NUEVOS */}
            {productosNuevos.length > 0 && (
                <section className="productos-nuevos" style={{
                    padding: '40px 20px',
                    backgroundColor: '#f9f9f9',
                    marginTop: '20px'
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '32px',
                            color: '#c5749de5',
                            marginBottom: '30px'
                        }}>
                            ¡Nuevos Productos! 
                        </h2>

                        {cargando ? (
                            <p style={{ textAlign: 'center' }}>Cargando productos...</p>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '20px',
                                marginBottom: '30px'
                            }}>
                                {productosNuevos.map((producto) => (
                                    <Link 
                                        key={producto.id_producto} 
                                        to={`/producto/${producto.id_producto}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            backgroundColor: 'white',
                                            borderRadius: '10px',
                                            padding: '15px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                        }}>
                                            {/* Badge de Nuevo */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                backgroundColor: '#33f321ff',
                                                color: 'white',
                                                zIndex: 1,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                Nuevo
                                            </div>

                                            <img 
                                                src={getImageUrl(producto.ruta_imagen)} 
                                                alt={producto.nom_producto}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    marginBottom: '10px'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen';
                                                }}
                                            />
                                            
                                            <h3 style={{
                                                fontSize: '18px',
                                                color: '#333',
                                                marginBottom: '5px'
                                            }}>
                                                {producto.nom_producto}
                                            </h3>
                                            
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#666',
                                                marginBottom: '10px'
                                            }}>
                                                {producto.nombre_c}
                                            </p>
                                            
                                            <p style={{
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                color: '#c5749de5'
                                            }}>
                                                ${parseFloat(producto.precio_unitario).toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </main>
        
        <Footer />
        </>
    );
};

export default Cliente;