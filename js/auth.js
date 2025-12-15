document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. LÓGICA DE LOGIN (Para auth.html)
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita recargas
            
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');

            // Verificamos que los inputs existan para evitar errores
            if (emailInput && passInput) {
                const email = emailInput.value;
                const password = passInput.value;

                if (email.length > 0 && password.length > 0) {
                    // --- GUARDAR SESIÓN ---
                    localStorage.setItem('sesionActiva', 'true');
                    localStorage.setItem('usuario', email); // Guardamos quién entró

                    // (Opcional) Buscar si existe en nuestra "Base de Datos" falsa para sacar su nombre
                    const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
                    const userFound = usersDB.find(u => u.email === email);
                    if (userFound) {
                        localStorage.setItem('userSession', JSON.stringify(userFound));
                    }

                    alert("¡Bienvenido! Iniciando sesión...");
                    window.location.href = "dashboard-rescatista.html"; // O a index.html
                } else {
                    alert("Por favor ingresa correo y contraseña.");
                }
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DE REGISTRO (Para register.html)
    // ==========================================
    // IMPORTANTE: Tu <form> en register.html debe tener id="registerForm"
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Asegúrate que estos IDs coincidan con tu HTML de registro
            const nameInput = document.getElementById('fullname') || document.getElementById('nombre'); 
            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');
            const roleInput = document.getElementById('role') || { value: 'rescatista' }; // Por defecto

            if (emailInput && passInput) {
                const newUser = {
                    nombre: nameInput ? nameInput.value : "Usuario",
                    email: emailInput.value,
                    password: passInput.value,
                    rol: roleInput.value || 'adoptante',
                    fechaRegistro: new Date().toLocaleDateString()
                };

                // Guardamos al usuario en una lista "falsa" en el navegador
                const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
                usersDB.push(newUser);
                localStorage.setItem('usersDB', JSON.stringify(usersDB));

                alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
                window.location.href = "auth.html"; // Te manda al login limpiamente
            } else {
                alert("Por favor completa los campos obligatorios.");
            }
        });
    }
});

// Función global para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userSession');
    window.location.href = "index.html";
}
