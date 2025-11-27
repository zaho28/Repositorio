let users = [];
const ADMIN_ROLE = 'admin';
const CLIENT_ROLE = 'cliente';

async function loadUsers() {
    try {
        const response = await fetch('../data/bd_emul.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        users = await response.json();
        console.log('Base de datos de usuarios simulada cargada con éxito.');
    } catch (error) {
        console.error('Error al cargar bd_emul.json:', error);
    }
}

function generateToken(user) {
    const payload = {
        userId: user.id,
        userRole: user.rol,
        iat: Date.now()
    };

    const encodedPayload = btoa(JSON.stringify(payload));
    return `header.${encodedPayload}.signature_simulada`; 
}

function simulateLogin(email, password) {
    // Buscar usuario por correo
    const user = users.find(u => u.correo === email);

    if (!user) {
        return { success: false, message: 'Correo no encontrado.' };
    }

    // Verificar la contraseña (simulada, SIN HASH)
    if (user.contrasena_hash === password) {
        
        // LÓGICA DE DOBLE VERIFICACIÓN PARA ADMIN
        if (user.rol === ADMIN_ROLE) {
            // Guardar temporalmente ID, nombre y código para la segunda pantalla
            // Usamos String() para asegurar que los valores sean cadenas si vienen como números
            sessionStorage.setItem('admin_user_id', String(user.id));
            sessionStorage.setItem('admin_verification_code', String(user.codigo)); 
            sessionStorage.setItem('admin_name', user.nombre); 
            
            // Retorna un estado especial para redirigir
            return { needs_code: true, message: 'Administrador: Continuar con código de verificación.' };
        } 
        
        // LÓGICA PARA CLIENTE (Inicio de sesión exitoso y finalizado)
        const token = generateToken(user);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', user.rol);
        
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Contraseña incorrecta.' };
    }
}


// Conectar la lógica al botón y los campos del formulario
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    // LÓGICA DE LA PÁGINA DE LOGIN INICIAL (iniciar_sesion.html) 
    const loginForm = document.querySelector('main form'); // Formulario del cliente
    const emailInput = document.getElementById('correo'); 
    const passwordInput = document.getElementById('contraseña'); 
    const loginButton = loginForm ? loginForm.querySelector('button') : null;

    if (loginForm && emailInput && passwordInput && loginButton) {
        loginButton.removeAttribute('onclick');
        loginForm.addEventListener('submit', (e) => e.preventDefault());

        loginButton.addEventListener('click', () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (email === '' || password === '') {
                alert('Por favor, ingresa correo y contraseña.');
                return;
            }

            const result = simulateLogin(email, password);

            if (result.success) {
                // REDIRECCIÓN CLIENTE
                alert(`¡Inicio de sesión exitoso! Bienvenido ${result.user.nombre}.`);
                window.location.href = 'cliente.html';
            } else if (result.needs_code) {
                // REDIRECCIÓN ADMIN (Paso 1 -> Paso 2)
                alert(`Credenciales de administrador correctas. Redirigiendo a verificación de código.`);
                window.location.href = 'inicio_admi.html'; 
            } else {
                // Error general
                alert(`Error de inicio de sesión: ${result.message}`);
            }
        });
    }

    // LÓGICA DE LA PÁGINA DE VERIFICACIÓN DE CÓDIGO (inicio_admi.html)
    const adminCodeInput = document.getElementById('codigo'); 
    // Usamos la clase para referirnos al formulario específico del admin
    const adminFormContainer = document.querySelector('.formulario_inicio'); 

    if (adminCodeInput && adminFormContainer) {
        const adminForm = adminCodeInput.closest('form');
        const adminLoginButton = adminForm ? adminForm.querySelector('button[type="submit"]') : null;

        // Verificar si hay sesión pendiente
        const adminId = sessionStorage.getItem('admin_user_id');
        const requiredCode = sessionStorage.getItem('admin_verification_code');
        const nombre = sessionStorage.getItem('admin_name');

        if (!adminId || !requiredCode) {
            // Si se llega a esta página sin pasar por el login inicial, redirigir
            alert('Acceso no autorizado. Debe iniciar sesión como administrador primero.');
            return;
        }

        // 2Manejar el envío del formulario de código
        if (adminForm && adminLoginButton) {
             // Prevenir la redirección directa del botón
            adminLoginButton.removeAttribute('onclick'); 
            adminForm.addEventListener('submit', (e) => e.preventDefault());

            adminLoginButton.addEventListener('click', () => {
                const enteredCode = adminCodeInput.value.trim();

                if (enteredCode === '') {
                    alert('Por favor, ingresa tu código de administrador.');
                    return;
                }

                // Verificar el código
                if (enteredCode === requiredCode) {
                    // Buscar el usuario completo (ya sabemos que es admin)
                    const adminUser = users.find(u => String(u.id) === adminId);
                    
                    if (adminUser) {
                        const token = generateToken(adminUser);
                        
                        // Guardar token de forma permanente y limpiar datos temporales
                        localStorage.setItem('auth_token', token);
                        localStorage.setItem('user_role', adminUser.rol);
                        sessionStorage.clear(); // Limpiamos todos los datos temporales del admin
                        
                        alert(`¡Bienvenido Administrador ${nombre}! Acceso completo.`);
                        // REDIRECCIÓN FINAL ADMIN
                        window.location.href = 'panel_admin.html';
                    } else {
                         alert('Error: Usuario administrador no encontrado.');
                    }
                } else {
                    alert('Código de verificación incorrecto.');
                }
            });
        }
    }
});