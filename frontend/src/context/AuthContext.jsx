import React, { createContext, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; 
const API_KEY = import.meta.env.VITE_API_KEY;

export const AuthContext = createContext();

const esAdministrador = (user) => {
    return user?.id_rol_usuario === '1' || user?.id_rol_usuario === '3'; // ← string, no número
};

const getInitialUser = () => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) return JSON.parse(sessionUser);
    const localUser = localStorage.getItem('user');
    if (localUser) return JSON.parse(localUser);
    return null;
};

const initialState = getInitialUser();
const initialusuarioPendiente = JSON.parse(sessionStorage.getItem('usuarioPendiente')) || null;

export const AuthProvider = ({ children }) => {
    const [usuarioActual, setUsuarioActual] = useState(initialState);
    const [usuarioPendiente, setUsuarioPendiente] = useState(initialusuarioPendiente);

    const saveusuarioPendiente = (user) => {
        setUsuarioPendiente(user);
        sessionStorage.setItem('usuarioPendiente', JSON.stringify(user));
    };

    const clearusuarioPendiente = () => {
        setUsuarioPendiente(null);
        sessionStorage.removeItem('usuarioPendiente');
    };

    const updateusuarioActual = (newdatosUsuario) => {
        setUsuarioActual(newdatosUsuario);
        if (esAdministrador(newdatosUsuario)) {
            sessionStorage.setItem('user', JSON.stringify(newdatosUsuario));
            localStorage.removeItem('user');
        } else {
            localStorage.setItem('user', JSON.stringify(newdatosUsuario));
            sessionStorage.removeItem('user');
        }
    };

    // --------------------------------------------------------
    // LOGIN - backend devuelve: { needs_code, user } o { success, token, user }
    // --------------------------------------------------------
    const login = async (correo, contrasena) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`,
            { correo, contrasena },
            { headers: { 'x-api-key': API_KEY } } 
            );
            const data = response.data;
            const user = data.user;

            // Admin o trabajador → necesita código
            if (data.needs_code) {
                saveusuarioPendiente(user);
                return { needs_code: true, user };
            }

            // Cliente → token directo
            localStorage.setItem('token', data.token); // guardar token
            updateusuarioActual(user);
            clearusuarioPendiente();
            return { success: true, user };

        } catch (error) {
            const message = error.response?.data?.message || "Error de conexión o credenciales inválidas.";
            return { success: false, message };
        }
    };

    // --------------------------------------------------------
    // VERIFY CODE - backend devuelve: { success, token, user }
    // --------------------------------------------------------
    const verifyAdminCode = async (codigo) => {
        const userToVerify = usuarioPendiente || JSON.parse(sessionStorage.getItem('usuarioPendiente'));

        if (!userToVerify) {
            return { success: false, message: "No hay sesión pendiente. Vuelve a iniciar sesión." };
        }

        try {
            const response = await axios.post(`${API_URL}/auth/verify-code`,
            { id_usuario: userToVerify.id_usuario, codigo },
            { headers: { 'x-api-key': API_KEY } }
            );

            const data = response.data;

            if (data.success) {
                localStorage.setItem('token', data.token); // ← guardar token
                updateusuarioActual(data.user);              // ← usar user del backend
                clearusuarioPendiente();
                return { success: true, user: data.user };
            }

            return { success: false, message: data.message || "Código incorrecto" };

        } catch (error) {
            const message = error.response?.data?.message || "Error al verificar el código";
            return { success: false, message };
        }
    };

    // --------------------------------------------------------
    // LOGOUT
    // --------------------------------------------------------
    const logout = () => {
        setUsuarioActual(null);
        clearusuarioPendiente();
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // ← limpiar token también
        sessionStorage.removeItem('user');
    };

    const userId = usuarioActual ? usuarioActual.id_usuario : null;

    return (
        <AuthContext.Provider value={{
            usuarioActual,
            userId,
            usuarioPendiente,
            login,
            logout,
            verifyAdminCode,
            isLoggedIn: !!usuarioActual,
            updateusuarioActual,
            saveusuarioPendiente,
            clearusuarioPendiente
        }}>
            {children}
        </AuthContext.Provider>
    );
};