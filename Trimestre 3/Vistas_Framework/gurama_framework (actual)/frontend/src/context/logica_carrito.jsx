// src/store/logica_carrito.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el carrito
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Proveedor del Contexto
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Lógica para añadir/incrementar un producto
    const addToCart = useCallback((product) => {
        setCartItems(prevItems => {
            // Se asegura de que el ID es un número (como en productos.js) para la comparación
            const itemId = Number(product.id); 
            const existingItemIndex = prevItems.findIndex(item => item.id === itemId);

            if (existingItemIndex > -1) {
                // Si existe, incrementa la cantidad
                return prevItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            } else {
                // Si no existe, añádelo con cantidad 1
                const nuevoProducto = {
                    id: itemId, 
                    name: product.name,
                    price: Number(product.price),
                    image: product.image, 
                    category: product.category || 'N/A',
                    cantidad: 1, 
                };
                return [...prevItems, nuevoProducto];
            }
        });
    }, []);
    
    // Función para cambiar la cantidad (para usar en carrito.jsx)
    const updateQuantity = useCallback((id, newQuantity) => {
        const cantidad = Number(newQuantity);
        if (cantidad < 1) return; 

        setCartItems(prevItems => prevItems.map(item => 
            item.id === id ? { ...item, cantidad } : item
        ));
    }, []);

    // Función para eliminar (para usar en carrito.jsx)
    const removeItem = useCallback((id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const contextValue = {
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};