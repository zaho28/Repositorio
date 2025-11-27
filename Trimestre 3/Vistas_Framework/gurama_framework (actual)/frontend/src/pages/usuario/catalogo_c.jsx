import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { products } from '../../data/productos.js'; 
//estilos
import "../../components/cliente.css";
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx';

const imageContext = require.context('../../assets', false, /\.png$/); 

const allCategories = ['Todo', ...new Set(products.map(product => product.category))];

const getImageUrl = (filename) => {
    try {
        return imageContext(`./${filename}`); 
    } catch (error) {
        console.warn(`No se encontró la imagen: ${filename}.`);
        return null;
    }
};

const Catalogo_c = () => {
    // BÚSQUEDA DE LA URL
    const [searchParams] = useSearchParams();
    const initialSearchTerm = searchParams.get('search') || '';
    
    // Estado para la categoría seleccionada ('Todo' por defecto)
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    
    // INICIALIZAR EL ESTADO DE BÚSQUEDA CON EL VALOR DE LA URL
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm); 
    
    // Estado para los productos que se van a renderizar
    const [filteredProducts, setFilteredProducts] = useState(products);

    // Función para manejar el cambio en la barra de búsqueda (cuando se escribe en esta página)
    const handleSearch = (event) => {
        setSearchTerm(event.target.value); 
    };

    // Función para manejar el cambio de filtro de categoría
    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    // useEffect para aplicar los filtros (Categoría Y Búsqueda)
    useEffect(() => {
        // El filtrado se aplica sobre el vector de productos original
        const finalFilteredProducts = products.filter((product) => {
            //  Condición de Categoría
            const matchesCategory = 
                selectedCategory === 'Todo' || 
                product.category === selectedCategory;

            // Condición de Búsqueda por Nombre (insensible a mayúsculas/minúsculas)
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const matchesSearch = 
                product.name.toLowerCase().includes(lowerCaseSearchTerm);

            // Un producto se muestra si cumple ambas condiciones
            return matchesCategory && matchesSearch;
        });

        setFilteredProducts(finalFilteredProducts);
        
    }, [selectedCategory, searchTerm]); // Se ejecuta al cambiar la categoría o término de búsqueda

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
                        value={searchTerm} // Muestra el término de búsqueda inicial (si viene de la URL)
                        onChange={handleSearch} 
                    />
                    <button>🔎</button>
                </section>
                
                <div className="filtro-categorias">
                    {allCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className={selectedCategory === category ? 'active' : ''}
                        >
                            {category}
                        </button>
                    ))}
                </div> 

                {/* CONTENEDOR DE PRODUCTOS (RENDERIZADO DINÁMICO) */}
                <div className="contenedor-productos">
                    {filteredProducts.map((product) => (
                        <Link to={`/producto/${product.id}`} key={product.id}>
                            <div className="producto">
                                <img 
                                    src={getImageUrl(product.image)} 
                                    alt={product.name}
                                />
                                <p>**{product.name}**</p>
                                <p>Categoría: {product.category}</p>
                            </div>
                        </Link>
                    ))}

                    {/* Mensaje si no hay resultados */}
                    {filteredProducts.length === 0 && (
                        <p className="no-results">
                            No se encontraron productos para los criterios de búsqueda y categoría actuales.
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