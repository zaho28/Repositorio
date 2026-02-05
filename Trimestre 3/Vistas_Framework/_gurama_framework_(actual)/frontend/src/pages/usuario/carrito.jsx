import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/logica_carrito.jsx';
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';
import '../../components/cliente.css';

const Carrito = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeItem, getCartTotal, getTotalItems } = useCart();

    // Función para obtener la URL de la imagen
    const getImageUrl = (rutaImagen) => {
        if (!rutaImagen) return 'https://via.placeholder.com/100x100?text=Sin+Imagen';
        return `http://localhost:3001${rutaImagen}`;
    };

    const formatPrice = (price) => {
        return price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        });
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity);
    };

    const handleRemoveItem = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
            removeItem(id);
        }
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        navigate('/pasarela-pago');
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}></div>
                        <h2 style={{ marginBottom: '15px' }}>Tu carrito está vacío</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            Agrega productos desde nuestro catálogo
                        </p>
                        <Link to="/catalogo_c">
                            <button style={{
                                backgroundColor: '#c5749d',
                                color: 'white',
                                padding: '12px 30px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}>
                                Ir al Catálogo
                            </button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{ margin: 0 }}> Carrito ({getTotalItems()} productos)</h1>
                    <Link to="/catalogo_c">
                        <button style={{
                            backgroundColor: '#e0e0e0',
                            color: '#333',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}>
                            Seguir Comprando
                        </button>
                    </Link>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 350px', 
                    gap: '30px',
                    alignItems: 'start'
                }}>
                    {/* Lista de productos */}
                    <div>
                        {cartItems.map((producto) => (
                            <div key={producto.id} style={{
                                backgroundColor: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '15px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                display: 'grid',
                                gridTemplateColumns: '100px 1fr auto',
                                gap: '20px',
                                alignItems: 'center'
                            }}>
                                {/* Imagen del producto */}
                                <img 
                                    src={getImageUrl(producto.image)} 
                                    alt={producto.name}
                                    style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '2px solid #e0e0e0'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100x100?text=Sin+Imagen';
                                    }}
                                />

                                {/* Información del producto */}
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                                        {producto.name}
                                    </h3>
                                    <p style={{ 
                                        color: '#666', 
                                        fontSize: '14px',
                                        margin: '0 0 10px 0'
                                    }}>
                                        {producto.category}
                                    </p>
                                    <p style={{ 
                                        fontSize: '20px', 
                                        fontWeight: 'bold',
                                        color: '#c5749d',
                                        margin: 0
                                    }}>
                                        {formatPrice(producto.price)}
                                    </p>
                                    
                                    {/* Mostrar stock disponible */}
                                    {producto.stock_actual && (
                                        <p style={{ 
                                            fontSize: '12px', 
                                            color: '#666',
                                            marginTop: '5px'
                                        }}>
                                            Stock disponible: {producto.stock_actual}
                                        </p>
                                    )}
                                </div>

                                {/* Controles de cantidad y eliminar */}
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '15px',
                                    alignItems: 'flex-end'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '10px',
                                        backgroundColor: '#f5f5f5',
                                        padding: '8px',
                                        borderRadius: '8px'
                                    }}>
                                        <button
                                            onClick={() => handleQuantityChange(producto.id, producto.cantidad - 1)}
                                            disabled={producto.cantidad <= 1}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                backgroundColor: producto.cantidad <= 1 ? '#e0e0e0' : '#c5749d',
                                                color: 'white',
                                                fontSize: '18px',
                                                cursor: producto.cantidad <= 1 ? 'not-allowed' : 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={producto.cantidad}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value);
                                                if (!isNaN(newValue)) {
                                                    handleQuantityChange(producto.id, newValue);
                                                }
                                            }}
                                            min="1"
                                            max={producto.stock_actual || 999}
                                            style={{
                                                width: '50px',
                                                textAlign: 'center',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px',
                                                padding: '5px',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(producto.id, producto.cantidad + 1)}
                                            disabled={producto.stock_actual && producto.cantidad >= producto.stock_actual}
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                backgroundColor: (producto.stock_actual && producto.cantidad >= producto.stock_actual) 
                                                    ? '#e0e0e0' 
                                                    : '#c5749d',
                                                color: 'white',
                                                fontSize: '18px',
                                                cursor: (producto.stock_actual && producto.cantidad >= producto.stock_actual) 
                                                    ? 'not-allowed' 
                                                    : 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            +
                                            
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveItem(producto.id)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 15px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        Eliminar
                                    </button>

                                    <div style={{ 
                                        fontSize: '18px', 
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Subtotal: {formatPrice(producto.price * producto.cantidad)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen del carrito */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        position: 'sticky',
                        top: '20px'
                    }}>
                        <h2 style={{ 
                            margin: '0 0 20px 0',
                            fontSize: '24px',
                            borderBottom: '2px solid #c5749d',
                            paddingBottom: '15px'
                        }}>
                            Resumen del Pedido
                        </h2>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                                fontSize: '16px'
                            }}>
                                <span>Productos ({getTotalItems()}):</span>
                                <span>{formatPrice(getCartTotal())}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '15px',
                                paddingBottom: '15px',
                                borderBottom: '1px solid #e0e0e0',
                                fontSize: '16px'
                            }}>
                                <span>Envío:</span>
                                <span style={{ color: '#28a745', fontWeight: 'bold' }}>GRATIS</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                color: '#c5749d'
                            }}>
                                <span>Total:</span>
                                <span>{formatPrice(getCartTotal())}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            style={{
                                width: '100%',
                                backgroundColor: '#c5749d',
                                color: 'white',
                                border: 'none',
                                padding: '15px',
                                borderRadius: '8px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                marginBottom: '15px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#a85c85'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#c5749d'}
                        >
                            Ir a pagar
                        </button>

                        <p style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            textAlign: 'center',
                            margin: 0
                        }}>
                            Compra 100% segura y protegida
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Carrito;