// js/auth.js - GESTIÓN DE USUARIOS Y SESIÓN

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si hay alguien logueado al cargar la página
    actualizarNavbar();

    // 2. Manejar Registro (Solo si estamos en register.html)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que se recargue la página
            registrarUsuario();
        });
    }

    // 3. Manejar Login (Solo si estamos en auth.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que se recargue la página
            iniciarSesion();
        });
    }
});

// --- LÓGICA DE REGISTRO ---
function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Si tienes un select de tipo de usuario, lo tomamos, si no, es 'adoptante'
    const tipoSelect = document.getElementById('tipo');
    const tipo = tipoSelect ? tipoSelect.value : 'adoptante';

    // 1. Validar si ya existe el correo
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    if (usuarios.find(u => u.email === email)) {
        alert('Este correo ya está registrado.');
        return;
    }

    // 2. Crear objeto de usuario
    const nuevoUsuario = { 
        id: Date.now(), 
        nombre: nombre, 
        email: email, 
        password: password, 
        tipo: tipo 
    };

    // 3. Guardar en la "Base de Datos" (LocalStorage)
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
    
    // 4. Iniciar sesión automáticamente
    localStorage.setItem('usuario_activo', JSON.stringify(nuevoUsuario));
    
    alert('¡Cuenta creada con éxito! Bienvenido.');
    window.location.href = 'index.html'; // Te manda al inicio ya logueado
}

// --- LÓGICA DE LOGIN ---
function iniciarSesion() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 1. Buscar en la base de datos
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

    if (usuarioEncontrado) {
        // 2. Guardar sesión
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));
        // alert('Bienvenido de nuevo');
        window.location.href = 'index.html'; // Te manda al inicio
    } else {
        alert('Correo o contraseña incorrectos. Intenta de nuevo.');
    }
}

// --- LÓGICA DE CIERRE DE SESIÓN ---
function cerrarSesion() {
    localStorage.removeItem('usuario_activo'); // Borra la sesión
    window.location.href = 'index.html'; // Recarga la página para ver el menú de visitante
}

// --- ACTUALIZAR NAVBAR (La Magia) ---
function actualizarNavbar() {
    // Revisamos si hay un usuario guardado
    const usuario = JSON.parse(localStorage.getItem('usuario_activo'));
    
    const navAuth = document.querySelector('.nav-auth'); // Botones login/registro
    const navUser = document.getElementById('userMenu'); // Menú de usuario "Hola Juan"
    const userNameSpan = document.getElementById('userName'); // Donde va el nombre

    if (usuario) {
        // SI EL USUARIO ESTÁ LOGUEADO:
        if (navAuth) navAuth.style.display = 'none'; // Ocultamos botones de registro
        if (navUser) {
            navUser.style.display = 'flex'; // Mostramos el menú de usuario
            if (userNameSpan) userNameSpan.textContent = usuario.nombre; // Ponemos su nombre
        }
    } else {
        // SI ES VISITANTE:
        if (navAuth) navAuth.style.display = 'flex'; // Mostramos botones de registro
        if (navUser) navUser.style.display = 'none'; // Ocultamos menú de usuario
    }
}
