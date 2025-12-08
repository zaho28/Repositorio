import React, { createContext, useState } from 'react';
import axios from 'axios';
// URL del backend
const API_URL = 'http://localhost:3001/api/usuarios'; 

// Crear  Contexto
export const AuthContext = createContext();

// Leer el usuario 
const initialState = JSON.parse(localStorage.getItem('user')) || null;
// Leer el usuario pendiente (admin necesita cod)
const initialPendingUser = JSON.parse(sessionStorage.getItem('pendingUser')) || null;

// Crear el Provider
export const AuthProvider = ({ children }) => {
    
    // Estado principal del usuario logueado
    const [currentUser, setCurrentUser] = useState(initialState); 
    // Estado temporal para el administrador que necesita código
    const [pendingUser, setPendingUser] = useState(initialPendingUser); 

    // Función para guardar usuario pendiente
    const savePendingUser = (user) => {
        setPendingUser(user);
        sessionStorage.setItem('pendingUser', JSON.stringify(user));
    };

    // Función para limpiar usuario pendiente
    const clearPendingUser = () => {
        setPendingUser(null);
        sessionStorage.removeItem('pendingUser');
    };

    // --------------------------------------------------------
    // FUNCIÓN DE ACTUALIZACIÓN DEL USUARIO 
    // --------------------------------------------------------
    const updateCurrentUser = (newUserData) => {
        // Actualiza el estado de React
        setCurrentUser(newUserData);
        // Actualiza el Local Storage para persistencia
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    // --------------------------------------------------------
    // FUNCIÓN DE LOGIN 
    // --------------------------------------------------------
    const login = async (correo, contrasena) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { correo, contrasena });
            const data = response.data;
            const user = data.user;

            if (data.needs_code) { 
            // Guarda el objeto de usuario completo temporalmente
            savePendingUser(user);
                return { needs_code: true, user }; 
            }
        
        // Login exitoso y completo (Cliente o Admin sin código)
        // Ya no es necesario verificar el rol, si llegamos aquí, es un login final exitoso
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        clearPendingUser();
        return { success: true, user }; 

        } catch (error) {
            // Manejo de errores (incluyendo error 401 de credenciales incorrectas)
            const message = error.response?.data?.message || "Error de conexión o credenciales inválidas.";
            return { success: false, message: message };
        }
    };
    
    // --------------------------------------------------------
    // FUNCIÓN DE VERIFICACIÓN DE CÓDIGO 
    // --------------------------------------------------------
    const verifyAdminCode = async (codigo) => {
        // Obtenemos el usuario que está pendiente de verificación
        const userToVerify = pendingUser || JSON.parse(sessionStorage.getItem('pendingUser'));
        
        if (!userToVerify) {
            return { success: false, 
                message: "No hay una sesión de administrador pendiente. Vuelve a iniciar sesión." };
        }
        
        try {
            // Llamada al backend para verificar el código
            const response = await axios.post(`${API_URL}/admin-code`, {
                id_usuario: userToVerify.id_usuario,
                codigo: codigo
            });
            
            console.log(' Respuesta del backend:', response.data);

            // Si el backend devuelve éxito
            if (response.data.success) {
                // Finaliza el login (mueve el usuario de temporal a activo)
                setCurrentUser(userToVerify);
                localStorage.setItem('user', JSON.stringify(userToVerify));
                
                // Limpia el estado temporal
                clearPendingUser();
                
                return { success: true, user: userToVerify };
            } else {
                return { 
                    success: false, 
                    message: response.data.message || "Código incorrecto" 
                };
            }

    } catch (error) {
            console.error(' Error en verifyAdminCode:', error);
            
            let message = "Error al verificar el código";
            
            if (error.response) {
                message = error.response.data?.message || `Error ${error.response.status}`;
            } else if (error.request) {
                message = "No se recibió respuesta del servidor";
            }
            
            return { 
                success: false, 
                message: message 
            };
        }
    };

    // --------------------------------------------------------
    // FUNCIÓN PARA CERRAR SESIÓN
    // --------------------------------------------------------
    const logout = () => {
        setCurrentUser(null);
        clearPendingUser();
        localStorage.removeItem('user');
    };

    const userId = currentUser ? currentUser.id_usuario : null;
    
    // Devolver el Provider con el contexto
    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            userId,
            pendingUser, // ← IMPORTANTE: exportar pendingUser
            login, 
            logout,
            verifyAdminCode, 
            isLoggedIn: !!currentUser,
            updateCurrentUser,
            savePendingUser,
            clearPendingUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};