// js/auth.js - SOPORTE PARA 3 PERFILES

document.addEventListener('DOMContentLoaded', () => {
    actualizarNavbar();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registrarUsuario();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// --- INTERFAZ ---

function selectUserType(tipo) {
    document.getElementById('stepSelection').style.display = 'none';
    document.getElementById('stepForm').style.display = 'block';
    document.getElementById('tipo').value = tipo;

    const title = document.getElementById('formTitle');
    const refugioField = document.getElementById('refugioField');
    const adminField = document.getElementById('adminField');
    const nombreRefugio = document.getElementById('nombreRefugio');
    const razonAdmin = document.getElementById('razonAdmin');

    // Resetear visibilidad
    refugioField.style.display = 'none';
    adminField.style.display = 'none';
    nombreRefugio.required = false;
    razonAdmin.required = false;

    if (tipo === 'rescatista') {
        title.innerText = 'Registro de Refugio';
        refugioField.style.display = 'block';
        nombreRefugio.required = true;
    } 
    else if (tipo === 'administrador') {
        title.innerText = 'Solicitud de Administrador';
        adminField.style.display = 'block';
        razonAdmin.required = true;
    } 
    else {
        title.innerText = 'Registro de Adoptante';
    }
}

function goBack() {
    document.getElementById('stepForm').style.display = 'none';
    document.getElementById('stepSelection').style.display = 'block';
    document.getElementById('registerForm').reset();
}

// --- LÓGICA ---

function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;
    
    let datosExtra = "";

    // Guardar datos específicos por perfil
    if (tipo === 'rescatista') {
        datosExtra = "Refugio: " + document.getElementById('nombreRefugio').value;
    } else if (tipo === 'administrador') {
        datosExtra = "Razón: " + document.getElementById('razonAdmin').value;
    }

    // Validar duplicados
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    if (usuarios.find(u => u.email === email)) {
        alert('Este correo ya está registrado.');
        return;
    }

    // Crear usuario
    const nuevoUsuario = { 
        id: Date.now(), 
        nombre: nombre, 
        email: email, 
        password: password, 
        tipo: tipo,
        info: datosExtra // Guardamos la info extra aquí
    };

    // Guardar en DB
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
    
    // Auto-Login
    localStorage.setItem('usuario_activo', JSON.stringify(nuevoUsuario));
    
    alert(`¡Bienvenido ${nombre}! Tu cuenta de ${tipo} ha sido creada.`);
    window.location.href = 'index.html';
}

function iniciarSesion() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        localStorage.setItem('usuario_activo', JSON.stringify(usuario));
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
