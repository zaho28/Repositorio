import React, { createContext, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/usuarios'; 

export const AuthContext = createContext();

// Función para determinar si un usuario es administrador
const esAdministrador = (user) => {
    return user?.id_rol_usuario === 1 || 
        user?.nombre_rol?.toLowerCase().includes('admin');
};

// Leer el usuario según el tipo de storage
const getInitialUser = () => {
    // Primero intentar sessionStorage (admins)
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
        return JSON.parse(sessionUser);
    }
    
    // Luego intentar localStorage (clientes)
    const localUser = localStorage.getItem('user');
    if (localUser) {
        return JSON.parse(localUser);
    }
    
    return null;
};

const initialState = getInitialUser();
const initialPendingUser = JSON.parse(sessionStorage.getItem('pendingUser')) || null;

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(initialState); 
    const [pendingUser, setPendingUser] = useState(initialPendingUser); 

    // Guardar usuario pendiente (admin esperando código)
    const savePendingUser = (user) => {
        setPendingUser(user);
        sessionStorage.setItem('pendingUser', JSON.stringify(user));
    };

    // Limpiar usuario pendiente
    const clearPendingUser = () => {
        setPendingUser(null);
        sessionStorage.removeItem('pendingUser');
    };

    // Actualizar usuario actual
    const updateCurrentUser = (newUserData) => {
        setCurrentUser(newUserData);
        
        // Guardar según el tipo de usuario
        if (esAdministrador(newUserData)) {
            // Admin: solo sessionStorage (se borra al cerrar navegador)
            sessionStorage.setItem('user', JSON.stringify(newUserData));
            localStorage.removeItem('user'); // Asegurar que no quede en localStorage
        } else {
            // Cliente: localStorage (persiste)
            localStorage.setItem('user', JSON.stringify(newUserData));
            sessionStorage.removeItem('user'); // Limpiar sessionStorage
        }
    };

    // --------------------------------------------------------
    // FUNCIÓN DE LOGIN 
    // --------------------------------------------------------
    const login = async (correo, contrasena) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { correo, contrasena });
            const data = response.data;
            const user = data.user;

            // Si el backend indica que necesita código
            if (data.needs_code) { 
                savePendingUser(user);
                return { needs_code: true, user }; 
            }
        
            // Login exitoso completo (Cliente)
            setCurrentUser(user);
            
            // Guardar en localStorage solo para clientes
            if (esAdministrador(user)) {
                // Si es admin pero no requiere código (no tiene código configurado)
                // Lo guardamos en sessionStorage
                sessionStorage.setItem('user', JSON.stringify(user));
                localStorage.removeItem('user');
            } else {
                // Cliente normal
                localStorage.setItem('user', JSON.stringify(user));
                sessionStorage.removeItem('user');
            }
            
            clearPendingUser();
            return { success: true, user }; 

        } catch (error) {
            const message = error.response?.data?.message || "Error de conexión o credenciales inválidas.";
            return { success: false, message: message };
        }
    };
    
    // --------------------------------------------------------
    // FUNCIÓN DE VERIFICACIÓN DE CÓDIGO 
    // --------------------------------------------------------
    const verifyAdminCode = async (codigo) => {
        const userToVerify = pendingUser || JSON.parse(sessionStorage.getItem('pendingUser'));
        
        if (!userToVerify) {
            return { 
                success: false, 
                message: "No hay una sesión de administrador pendiente. Vuelve a iniciar sesión." 
            };
        }
        
        try {
            const response = await axios.post(`${API_URL}/admin-code`, {
                id_usuario: userToVerify.id_usuario,
                codigo: codigo
            });
            
            console.log('✅ Respuesta del backend:', response.data);

            if (response.data.success) {
                // Login exitoso del admin
                setCurrentUser(userToVerify);
                
                // IMPORTANTE: Guardar solo en sessionStorage (se borra al cerrar navegador)
                sessionStorage.setItem('user', JSON.stringify(userToVerify));
                localStorage.removeItem('user'); // Asegurar que no quede en localStorage
                
                clearPendingUser();
                
                return { success: true, user: userToVerify };
            } else {
                return { 
                    success: false, 
                    message: response.data.message || "Código incorrecto" 
                };
            }

        } catch (error) {
            console.error('❌ Error en verifyAdminCode:', error);
            
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
        
        // Limpiar ambos storages
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    };

    const userId = currentUser ? currentUser.id_usuario : null;
    
    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            userId,
            pendingUser,
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