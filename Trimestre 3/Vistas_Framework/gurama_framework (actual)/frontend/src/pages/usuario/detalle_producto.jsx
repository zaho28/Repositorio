// src/pages/usuario/ProductoDetalle.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx';
import "../../components/cliente.css";  

import { useCart } from '../../context/logica_carrito.jsx';
import { products } from '../../data/productos.js'; 


const imageContext = require.context('../../assets', false, /\.png$/); 

const getImageUrl = (filename) => {
    try {
        return imageContext(`./${filename}`); 
    } catch (error) {
        console.warn(`No se encontró la imagen: ${filename}.`);
        return null;
    }
};

const ProductoDetalle = () => {
    // Usamos useParams para obtener el parámetro 'id' de la URL
    const { id } = useParams();
    
    // Estado para guardar el producto que se va a mostrar
    const [producto, setProducto] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { addToCart } = useCart();

    useEffect(() => {
        setIsLoading(true);
        
        // Convertimos el ID de la URL (string) a número para la comparación
        const productId = parseInt(id); 

        // Buscar el producto en el vector de productos.js
        const foundProduct = products.find(p => p.id === productId);

        setProducto(foundProduct);
        setIsLoading(false);

    }, [id]); // Dependencia: se ejecuta si el ID de la URL cambia

    const handleAddToCartClick = () => {
        if (producto) {
            // El objeto 'producto' ya contiene el ID, name, price, etc.
            addToCart(producto);
            alert(`"${producto.name}" añadido al carrito!`);
        }
    };
    // Si está cargando o no se encuentra el producto:
    if (isLoading) {
        return <p className="loading-message">Cargando detalles del producto...</p>;
    }

    if (!producto) {
        return (
            <div className="error-container">
                <p>Producto no encontrado.</p>
                <Link to="/catalogo_c">Volver al Catálogo</Link>
            </div>
        );
    }

    // El producto se ha cargado correctamente:
    return (
        <>
            <Header />
            
            {/* CONTENIDO PRINCIPAL */}
            <main>
                <div className="contenedor-producto">
                    <div className="imagen-producto">
                        {/* Usamos la función getImageUrl para cargar la imagen dinámicamente */}
                        <img 
                            src={getImageUrl(producto.image)} 
                            alt={producto.name}
                            id="producto-imagen"
                        />
                    </div>

                    <div className="info-producto">
                        {/* RENDERIZADO DE DATOS DINÁMICOS */}
                        <h2 id="producto-nombre">{producto.name}</h2>
                        <p id="producto-descripcion">{producto.description}</p>
                        <p className="precio" id="producto-precio">Precio: ${producto.price.toLocaleString('es-CO')}</p>
                        <p className="stock">Stock disponible: {producto.stock || 'Consultar'}</p> {/* Asumiendo que products tiene 'stock' */}
                        
                        {/* Botón para agregar al carrito */}
                        {/* Se enlaza a la ruta del carrito. La lógica de añadir el producto iría aquí */}
                        <button 
                            onClick={handleAddToCartClick} 
                            className="btn-carrito" // Usa la clase CSS existente
                        >
                            Agregar al carrito 🛒
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductoDetalle;