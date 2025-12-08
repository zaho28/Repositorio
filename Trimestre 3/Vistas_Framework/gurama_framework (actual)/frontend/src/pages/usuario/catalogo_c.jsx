import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

//estilos
import "../../components/cliente.css";
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx';

const API_URL = "http://localhost:3001/api/productos";

const Catalogo_c = () => {
    const [searchParams] = useSearchParams();
    const initialSearchTerm = searchParams.get('search') || '';
    
    // Estados
    const [products, setProducts] = useState([]);
    const [cat_seleccionada, setcat_seleccionada] = useState('Todo');
    const [clas_seleccionada, setClas_seleccionada] = useState('Todas'); // Nuevo estado
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categorias, setCategorias] = useState(['Todo']);
    const [clasificaciones, setClasificaciones] = useState(['Todas']); // Nuevo estado
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setCargando(true);
                const response = await axios.get(API_URL);
                const productosAPI = response.data;
                
                setProducts(productosAPI);
                
                // Extraer categorías únicas
                const categoriasUnicas = ['Todo', ...new Set(productosAPI.map(p => p.nombre_c))];
                setCategorias(categoriasUnicas);
                
                // Extraer clasificaciones únicas (excluyendo "Sin clasificar")
                const clasificacionesUnicas = ['Todas', ...new Set(
                    productosAPI
                        .filter(p => p.nombre_clas && p.nombre_clas.toLowerCase() !== 'sin clasificar')
                        .map(p => p.nombre_clas)
                )];
                setClasificaciones(clasificacionesUnicas);
                
                setError(null);
            } catch (err) {
                console.error("Error al cargar productos:", err);
                setError("No se pudieron cargar los productos");
            } finally {
                setCargando(false);
            }
        };

        fetchProductos();
    }, []);

    // Función para manejar el cambio en la barra de búsqueda
    const handleSearch = (event) => {
        setSearchTerm(event.target.value); 
    };

    // Función para manejar el cambio de filtro de categoría
    const handleCategoryFilter = (category) => {
        setcat_seleccionada(category);
    };

    // Función para manejar el cambio de filtro de clasificación
    const handleClasificacionFilter = (clasificacion) => {
        setClas_seleccionada(clasificacion);
    };

    // Función para determinar si el stock es bajo
    const isStockBajo = (producto) => {
        return producto.stock_actual <= producto.stock_minimo;
    };

    // useEffect para aplicar los filtros (Categoría, Clasificación Y Búsqueda)
    useEffect(() => {
        const productos_filtrados = products.filter((product) => {
            // Condición de Categoría
            const conincide_cate = 
                cat_seleccionada === 'Todo' || 
                product.nombre_c === cat_seleccionada;

            // Condición de Clasificación
            let coincide_clas = true;
            if (clas_seleccionada !== 'Todas') {
                // Si tiene stock bajo, se considera "Últimas Unidades"
                if (clas_seleccionada === 'Últimas Unidades') {
                    coincide_clas = isStockBajo(product);
                } else {
                    coincide_clas = product.nombre_clas === clas_seleccionada;
                }
            }

            // Condición de Búsqueda por Nombre
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const busqueda_coincide = 
                product.nom_producto.toLowerCase().includes(lowerCaseSearchTerm) ||
                (product.descripcion && product.descripcion.toLowerCase().includes(lowerCaseSearchTerm));

            return conincide_cate && coincide_clas && busqueda_coincide;
        });

        setFilteredProducts(productos_filtrados);
        
    }, [cat_seleccionada, clas_seleccionada, searchTerm, products]);

    // Función para obtener la URL de la imagen
    const getImageUrl = (rutaImagen) => {
        if (!rutaImagen) return null;
        return `http://localhost:3001${rutaImagen}`;
    };

    // Función para obtener el badge del producto (oculta "Sin clasificar")
    const getBadgeInfo = (producto) => {
        // Stock bajo 
        if (isStockBajo(producto) && producto.stock_actual > 0) {
            return {
                texto: 'Últimas Unidades',
                color: '#f88787ff',
                mostrar: true
            };
        }

        // Clasificación de la BD (solo si NO es "Sin clasificar")
        if (producto.nombre_clas) {
            const clasificacion = producto.nombre_clas.toLowerCase();

            // NO mostrar badge si es "Sin clasificar"
            if (clasificacion === 'sin clasificar') {
                return { mostrar: false };
            }

            if (clasificacion === 'nuevo' || clasificacion === 'nuevos') {
                return { texto: 'Nuevo', color: '#33f321ff', mostrar: true };
            }
            if (clasificacion === 'en oferta' || clasificacion === 'oferta') {
                return { texto: 'En Oferta', color: '#ec9614ff', mostrar: true };
            }
            if (clasificacion.includes('vendido') || clasificacion === 'mas vendidos') {
                return { texto: 'Más Vendido', color: '#0b87ecff', mostrar: true };
            }
            if (clasificacion === 'ultimas unidades') {
                return { texto: 'Últimas Unidades', color: '#eb54bdff', mostrar: true };
            }
            
            // Clasificación personalizada (cualquier otra)
            return { texto: producto.nombre_clas, color: '#bbbbbbff', mostrar: true };
        }

        // No mostrar badge
        return { mostrar: false };
    };

    if (cargando) {
        return (
            <>
                <Header />
                <main>
                    <section className="contenido-inicio">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Cargando productos...</p>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main>
                    <section className="contenido-inicio">
                        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                            <p>{error}</p>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
        <Header />

        <main>
            <section className="contenido-inicio">
                <h1>Catálogo de productos</h1>
                <p>Explora nuestros productos tejidos a mano, hechos con amor y dedicación</p>

                <section className="buscador">
                    <input 
                        type="text" 
                        placeholder="Buscar productos..." 
                        value={searchTerm}
                        onChange={handleSearch} 
                    />
                    <button></button>
                </section>
                
                {/* Filtro de Categorías */}
                <div className="filtro-categorias">
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Categoría:</label>
                    {categorias.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className={cat_seleccionada === category ? 'active' : ''}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Filtro de Clasificaciones */}
                <div className="filtro-categorias" style={{ marginTop: '10px' }}>
                    <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Clasificación:</label>
                    {clasificaciones.map((clasificacion) => (
                        <button
                            key={clasificacion}
                            onClick={() => handleClasificacionFilter(clasificacion)}
                            className={clas_seleccionada === clasificacion ? 'active' : ''}
                        >
                            {clasificacion}
                        </button>
                    ))}
                </div>

                {/* CONTENEDOR DE PRODUCTOS */}
                <div className="contenedor-productos">
                    {filteredProducts.map((product) => {
                        const badgeInfo = getBadgeInfo(product);
                        
                        return (
                            <Link to={`/producto/${product.id_producto}`} key={product.id_producto}>
                                <div className="producto">
                                    {/* Badge de Clasificación (solo si debe mostrarse) */}
                                    {badgeInfo.mostrar && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: badgeInfo.color,
                                            color: 'white',
                                            zIndex: 1,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            animation: badgeInfo.texto.includes('Últimas') ? 'pulse 2s infinite' : 'none'
                                        }}>
                                            {badgeInfo.texto}
                                        </div>
                                    )}

                                    {product.ruta_imagen ? (
                                        <img 
                                            src={getImageUrl(product.ruta_imagen)} 
                                            alt={product.nom_producto}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen';
                                            }}
                                        />
                                    ) : (
                                        <img 
                                            src="https://via.placeholder.com/200x200?text=Sin+Imagen" 
                                            alt="Sin imagen"
                                        />
                                    )}
                                    
                                    <p><strong>{product.nom_producto}</strong></p>
                                    <p style={{ 
                                        color: '#666', 
                                        fontSize: '14px',
                                        marginBottom: '8px'
                                    }}>
                                        {product.nombre_c}
                                    </p>
                                    
                                    <p className="precio">${parseFloat(product.precio_unitario).toLocaleString('es-CO')}</p>
                                    
                                    {/* Indicador de stock */}
                                    {product.stock_actual > 0 ? (
                                        isStockBajo(product) ? (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                backgroundColor: '#fff3cd',
                                                color: '#856404',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                marginTop: '8px'
                                            }}>
                                                Pocas unidades
                                            </span>
                                        ) : (
                                            <span className="disponible">Disponible</span>
                                        )
                                    ) : (
                                        <span className="agotado">Agotado</span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}

                    {/* Mensaje si no hay resultados */}
                    {filteredProducts.length === 0 && (
                        <p className="no-results">
                            No se encontraron productos para los criterios de búsqueda actuales.
                        </p>
                    )}
                </div>
            </section>
        </main>
            
        <Footer />
        </>
    );
};

export default Catalogo_c;