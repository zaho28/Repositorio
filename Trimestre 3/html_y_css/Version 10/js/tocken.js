// Variable global para almacenar la "base de datos"
let users = [];

// 1. Cargar la "base de datos" JSON
async function loadUsers() {
    try {
        // La ruta es '../js/bd_emul.json' desde el HTML
        const response = await fetch('../js/bd_emul.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        users = await response.json();
        console.log('Base de datos de usuarios simulada cargada con éxito.');
    } catch (error) {
        console.error('Error al cargar bd_emul.json:', error);
    }
}

// 2. Simular la generación de un token (JWT simplificado)
function generateToken(user) {
    const payload = {
        userId: user.id,
        userRole: user.rol,
        iat: Date.now()
    };
    // Codificación Base64 (simulación)
    const encodedPayload = btoa(JSON.stringify(payload));
    return `header.${encodedPayload}.signature_simulada`; 
}

// 3. Función principal para simular el inicio de sesión
function simulateLogin(email, password) {
    // Buscar usuario por correo
    const user = users.find(u => u.correo === email);

    if (!user) {
        return { success: false, message: 'Correo no encontrado.' };
    }

    // Verificar la contraseña (simulada, SIN HASH)
    if (user.contrasena_hash === password) {
        const token = generateToken(user);
        
        // Guardar token y rol en Local Storage para simular la sesión
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', user.rol);
        
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Contraseña incorrecta.' };
    }
}

// 4. Conectar la lógica al botón y los campos del formulario
document.addEventListener('DOMContentLoaded', () => {
    // Cargar usuarios inmediatamente
    loadUsers();

    // Referencias a los elementos del HTML del login (vistas/iniciar_sesion.html)
    const loginButton = document.querySelector('form button');
    const emailInput = document.getElementById('correo'); // Usando ID 'correo'
    const passwordInput = document.getElementById('contraseña'); // Usando ID 'contraseña'
    const loginForm = document.querySelector('form');

    // Desactivar el comportamiento predeterminado del botón (onclick)
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
            alert(`¡Inicio de sesión exitoso! Bienvenido ${result.user.nombre} (${result.user.rol}).`);
            // Redirigir a la página de cliente.html o al index
            window.location.href = 'cliente.html';
        } else {
            alert(`Error de inicio de sesión: ${result.message}`);
        }
    });
});