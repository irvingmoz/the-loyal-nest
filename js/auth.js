// js/auth.js - GESTIÓN DE USUARIOS Y SESIÓN + INTERFAZ DE REGISTRO

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar sesión al cargar
    actualizarNavbar();

    // 2. Manejar Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registrarUsuario();
        });
    }

    // 3. Manejar Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// --- FUNCIONES DE INTERFAZ (LO QUE TE FALTABA) ---

// Esta función se activa al dar clic en las tarjetas de "Quiero Adoptar" o "Soy Rescatista"
function selectUserType(tipo) {
    // 1. Ocultar la pantalla de selección y mostrar el formulario
    const stepSelection = document.getElementById('stepSelection');
    const stepForm = document.getElementById('stepForm');
    
    if (stepSelection && stepForm) {
        stepSelection.style.display = 'none';
        stepForm.style.display = 'block';
    }

    // 2. Guardar el tipo en el campo oculto
    const tipoInput = document.getElementById('tipo');
    if (tipoInput) tipoInput.value = tipo;

    // 3. Personalizar el formulario según lo que eligieron
    const formTitle = document.getElementById('formTitle');
    const refugioField = document.getElementById('refugioField');
    const nombreRefugioInput = document.getElementById('nombreRefugio');

    if (tipo === 'rescatista') {
        if (formTitle) formTitle.innerText = 'Registro de Refugio';
        if (refugioField) refugioField.style.display = 'block'; // Muestra campo extra
        if (nombreRefugioInput) nombreRefugioInput.required = true;
    } else {
        if (formTitle) formTitle.innerText = 'Registro de Adoptante';
        if (refugioField) refugioField.style.display = 'none'; // Oculta campo extra
        if (nombreRefugioInput) nombreRefugioInput.required = false;
    }
}

// Función para el botón "Volver"
function goBack() {
    document.getElementById('stepForm').style.display = 'none';
    document.getElementById('stepSelection').style.display = 'block';
    document.getElementById('registerForm').reset();
}

// --- LÓGICA DE BASE DE DATOS (LOCALSTORAGE) ---

function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;
    
    // Si es rescatista, agregamos el nombre del refugio al nombre de usuario
    let nombreFinal = nombre;
    if (tipo === 'rescatista') {
        const nombreRefugio = document.getElementById('nombreRefugio').value;
        nombreFinal = `${nombre} (${nombreRefugio})`;
    }

    // 1. Validar si ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    if (usuarios.find(u => u.email === email)) {
        alert('Este correo ya está registrado.');
        return;
    }

    // 2. Crear usuario
    const nuevoUsuario = { 
        id: Date.now(), 
        nombre: nombreFinal, 
        email: email, 
        password: password, 
        tipo: tipo 
    };

    // 3. Guardar
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
    
    // 4. Iniciar sesión auto
    localStorage.setItem('usuario_activo', JSON.stringify(nuevoUsuario));
    
    alert('¡Cuenta creada con éxito! Bienvenido.');
    window.location.href = 'index.html';
}

function iniciarSesion() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

    if (usuarioEncontrado) {
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));
        window.location.href = 'index.html';
    } else {
        alert('Correo o contraseña incorrectos.');
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuario_activo');
    window.location.href = 'index.html';
}

function actualizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario_activo'));
    
    const navAuth = document.querySelector('.nav-auth');
    const navUser = document.getElementById('userMenu');
    const userNameSpan = document.getElementById('userName');

    if (usuario) {
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) {
            navUser.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = usuario.nombre;
        }
    } else {
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
    }
}
