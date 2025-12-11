// js/auth.js - GESTIÓN DE USUARIOS Y SESIÓN

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar estado de sesión al cargar
    actualizarNavbar();

    // 2. Manejar Registro (Solo en register.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registrarUsuario();
        });
    }

    // 3. Manejar Login (Solo en auth.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// --- LÓGICA DE REGISTRO ---
function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Si tienes un select de tipo de usuario, úsalo, si no, por defecto 'adoptante'
    const tipoSelect = document.getElementById('tipo');
    const tipo = tipoSelect ? tipoSelect.value : 'adoptante';

    // Validar si ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    if (usuarios.find(u => u.email === email)) {
        alert('Este correo ya está registrado.');
        return;
    }

    // Crear usuario
    const nuevoUsuario = { id: Date.now(), nombre, email, password, tipo };

    // Guardar
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
    
    // Iniciar sesión
    localStorage.setItem('usuario_activo', JSON.stringify(nuevoUsuario));
    
    alert('¡Cuenta creada con éxito!');
    window.location.href = 'index.html';
}

// --- LÓGICA DE LOGIN ---
function iniciarSesion() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        localStorage.setItem('usuario_activo', JSON.stringify(usuario));
        // alert('Bienvenido de nuevo'); // Opcional
        window.location.href = 'index.html';
    } else {
        alert('Correo o contraseña incorrectos');
    }
}

// --- LÓGICA DE CIERRE DE SESIÓN ---
function cerrarSesion() {
    localStorage.removeItem('usuario_activo');
    window.location.href = 'index.html'; // Recargar página para actualizar menú
}

// --- ACTUALIZAR NAVBAR (La Magia) ---
function actualizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario_activo'));
    
    const navAuth = document.querySelector('.nav-auth'); // Botones login/registro
    const navUser = document.getElementById('userMenu'); // Menú usuario
    const userNameSpan = document.getElementById('userName');

    if (usuario) {
        // USUARIO LOGUEADO
        if (navAuth) navAuth.style.display = 'none'; // Ocultar botones
        if (navUser) {
            navUser.style.display = 'flex'; // Mostrar menú "Hola Usuario"
            if (userNameSpan) userNameSpan.textContent = usuario.nombre;
        }
    } else {
        // VISITANTE
        if (navAuth) navAuth.style.display = 'flex'; // Mostrar botones
        if (navUser) navUser.style.display = 'none'; // Ocultar menú usuario
    }
}
