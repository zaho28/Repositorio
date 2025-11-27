import { createContext, useState, useEffect } from "react";
import usersData from "../data/users.json";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [users, setUsers] = useState([]);
    const [auth, setAuth] = useState({
        token: localStorage.getItem("auth_token") || null,
        role: localStorage.getItem("user_role") || null,
        user: null
    });

    // Cargar BD simulada
    useEffect(() => {
        setUsers(usersData);
    }, []);

    // Simular un token estilo JWT
    const generateToken = (user) => {
        const payload = {
            userId: user.id,
            userRole: user.rol,
            iat: Date.now()
        };
        const encoded = btoa(JSON.stringify(payload));
        return `header.${encoded}.signature`;
    };

    // Login normal o inicio del flujo admin
    const login = (email, password) => {
        const user = users.find(u => u.correo === email);

        if (!user) return { success: false, message: "Correo no encontrado" };

        if (user.contrasena_hash !== password)
            return { success: false, message: "Contraseña incorrecta" };

        // ADMIN: requiere código
        if (user.rol === "admin") {
            sessionStorage.setItem("admin_id", user.id);
            sessionStorage.setItem("admin_code", user.codigo);
            sessionStorage.setItem("admin_name", user.nombre);
            return { needs_code: true };
        }

        // Cliente: login completo
        const token = generateToken(user);

        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_role", user.rol);

        setAuth({ token, role: user.rol, user });

        return { success: true, user };
    };

    // Validación del código admin
    const verifyAdminCode = (codeEntered) => {
        const id = sessionStorage.getItem("admin_id");
        const code = sessionStorage.getItem("admin_code");

        if (!id || !code) return { success: false };

        if (String(codeEntered) !== String(code))
            return { success: false, message: "Código incorrecto" };

        const adminUser = users.find(u => String(u.id) === id);

        const token = generateToken(adminUser);

        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_role", adminUser.rol);

        sessionStorage.clear();

        setAuth({ token, role: adminUser.rol, user: adminUser });

        return { success: true };
    };

    return (
        <AuthContext.Provider value={{ auth, login, verifyAdminCode }}>
            {children}
        </AuthContext.Provider>
    );
}