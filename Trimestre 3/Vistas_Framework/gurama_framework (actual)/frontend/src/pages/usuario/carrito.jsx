// src/pages/usuario/carrito.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
//estilos
import "../../components/cliente.css";
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx'; 
// 💡 AJUSTE DE RUTA: Importar el hook useCart desde la carpeta 'context'
import { useCart } from '../../context/logica_carrito.jsx'; 


// --- MOCK DATA DEL CATÁLOGO DISPONIBLE (Se mantiene local) ---\
const availableProducts = [
    { id: 1, nombre: 'Sábana Cama Sencilla Paw Patrol', descripcion: 'Color: Azul', precio: 85000, imagen: "https://placehold.co/100x100/1D4ED8/FFFFFF?text=SABANA" },
    { id: 2, nombre: 'Funda Decorativa Floral', descripcion: 'Color: Rosa pastel', precio: 45000, imagen: "https://placehold.co/100x100/EC4899/FFFFFF?text=FUNDA" },
    // Agrega más productos mock si son necesarios aquí para la sección de Catálogo de prueba
];

const formatPrice = (price) => price.toLocaleString('es-CO');

// --- COMPONENTE PRINCIPAL DEL CARRITO ---
const Carrito = () => {
    // 💡 USAR EL CONTEXTO
    const { 
        cartItems: productosEnCarrito, 
        addToCart, // Usaremos esta función para el catálogo de prueba
        updateQuantity: handleQuantityChange, 
        removeItem: handleRemoveItem 
    } = useCart();

    const [searchTerm, setSearchTerm] = useState(''); 

    // Función para añadir productos del catálogo de PRUEBA (compatible con el contexto)
    const handleAddToCartFromMock = (product) => {
        // Mapea el mock data local a la estructura que espera el Contexto
        const formattedProduct = {
            id: product.id,
            name: product.nombre, 
            price: product.precio,
            image: product.imagen, 
        };
        addToCart(formattedProduct);
    };

    // Cálculo del Resumen de Compra
    const resumenCompra = useMemo(() => {
        const subtotalNumber = productosEnCarrito.reduce(
            (acc, producto) => acc + (Number(producto.price) * Number(producto.cantidad)),
            0
        );
        const totalNumber = subtotalNumber; // Asumiendo que no hay impuestos/envío por ahora

        return {
            subtotal: formatPrice(subtotalNumber),
            total: formatPrice(totalNumber),
            subtotalNumber: subtotalNumber,
        };
    }, [productosEnCarrito]);

    // Productos del catálogo filtrados
    const filteredCatalog = availableProducts.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-container min-h-screen flex flex-col bg-gray-50 font-sans">
            <Header />

            <main className="contenido-carrito flex-grow max-w-7xl mx-auto w-full p-4 lg:p-8">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b pb-3">Carrito de Compras </h1>
                                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                    
                    {/* Lista de Productos en el Carrito */}
                    <section className="lista-productos lg:col-span-2 space-y-4">
                        <h2 className="text-2xl font-semibold text-red-600 mb-4">Tu Carrito ({productosEnCarrito.length})</h2>
                        <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
                            {productosEnCarrito.length === 0 ? (
                                <p className="text-center text-gray-500 italic py-6 border border-dashed rounded-lg">
                                    El carrito está vacío. ¡Añade productos!
                                    <p>
                                        <Link to="/catalogo_c" className="boton-principal">Explora nuestro catálogo</Link>
                                    </p>
                                </p>
                                
                            ) : (
                                productosEnCarrito.map(producto => (
                                    <div className="producto-carito p-4 border border-gray-100 rounded-xl flex items-center space-x-6 hover:bg-gray-50 transition" key={producto.id}>
                                        <img src={producto.image} alt={producto.name} className="w-20 h-20 object-cover rounded-lg shadow-md" />
                                        
                                        <div className="detalle flex-1 min-w-0">
                                            <h2 className="text-lg font-bold text-gray-900 truncate">{producto.name}</h2>
                                            <p className="text-sm text-gray-600">{producto.category || 'Producto'}</p>
                                            <span className="precio text-xl font-extrabold text-red-600 mt-1 block">${formatPrice(producto.price)}</span>
                                        </div>
                                        
                                        <div className="acciones flex items-center space-x-3">
                                            <input
                                                type="number"
                                                value={producto.cantidad}
                                                onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                                                min="1"
                                                className="w-16 p-2 text-center border border-gray-300 rounded-lg"
                                            />
                                            <button 
                                                onClick={() => handleRemoveItem(producto.id)}
                                                className="eliminar bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                    
                    {/* Resumen de Compra */}
                    <section className="resumen lg:sticky lg:top-24 h-fit">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-200">
                            <h3>Resumen de compra</h3>
                            <div className="space-y-3 text-lg pt-2 border-t mt-2">
                                <p className="flex justify-between">
                                    Subtotal: <span className="font-medium text-gray-700">${resumenCompra.subtotal}</span>
                                </p>
                                <hr className="my-4 border-gray-300" />
                                <p className="total flex justify-between text-2xl font-extrabold text-red-700">
                                    Total: <span>${resumenCompra.total}</span>
                                </p>
                            </div>
                            <Link to="/pasarela_pago" className="mt-6 block">
                                <button disabled={resumenCompra.subtotalNumber === 0}
                                    className={`finalizar w-full py-3 rounded-xl font-bold text-lg transition shadow-lg ${
                                        resumenCompra.subtotalNumber > 0
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    Ir a pagar
                                </button>
                            </Link>
                        </div>
                    </section>
                </div>

            </main>

            <Footer /> 
        </div>
    );
};

export default Carrito;