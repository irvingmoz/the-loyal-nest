localStorage.clear();
document.addEventListener("DOMContentLoaded", function() {
    checkSession(); // Revisa si ya hay sesión iniciada

    // --- LÓGICA DEL REGISTRO (Coincide con tu HTML) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        
        // 1. Detectar cambio de Rol para mostrar "Estatus Legal"
        const roleSelect = document.getElementById('role');
        if (roleSelect) {
            roleSelect.addEventListener('change', toggleCamposPorRol);
        }

        // 2. Manejar el envío del formulario
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarUsuario();
        });
    }

    // --- LÓGICA DEL LOGIN (Para auth.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// Encriptación simple (Base64)
function encriptar(texto) { return btoa(texto); }

// Mostrar/Ocultar campos extra de rescatista
function toggleCamposPorRol() {
    const rol = document.getElementById('role').value;
    const divRescatista = document.getElementById('camposRescatista');
    
    if (divRescatista) {
        if (rol === 'rescatista') {
            divRescatista.style.display = 'block';
        } else {
            divRescatista.style.display = 'none';
        }
    }
}

// --- FUNCIÓN PRINCIPAL: REGISTRAR ---
function registrarUsuario() {
    // CAPTURA DE DATOS (Usando los IDs exactos de tu HTML)
    const nombre = document.getElementById('nombre').value;
    const apPaterno = document.getElementById('apPaterno').value;
    const apMaterno = document.getElementById('apMaterno').value;
    const edad = document.getElementById('edad').value;
    const curp = document.getElementById('curp').value.toUpperCase(); // Convertir a mayúsculas
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('registerEmail').value;
    const passRaw = document.getElementById('registerPassword').value;
    const rol = document.getElementById('role').value; // 'adoptante' o 'rescatista'
    
    // Campo opcional solo para rescatistas
    let estatusLegal = "";
    if (rol === 'rescatista') {
        estatusLegal = document.getElementById('estatusLegal').value;
    }

    // --- VALIDACIONES ---
    if(passRaw.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if(curp.length !== 18) {
        alert("La CURP debe tener exactamente 18 caracteres.");
        return;
    }

    if(parseInt(edad) < 18) {
        alert("Debes ser mayor de edad para registrarte.");
        return;
    }

    // Crear objeto de usuario
    const nuevoUsuario = { 
        nombre, apPaterno, apMaterno, edad, 
        curp, direccion, correo, 
        pass: encriptar(passRaw), 
        rol, estatusLegal 
    };

    // GUARDAR DATOS
    localStorage.setItem('userDB', JSON.stringify(nuevoUsuario)); // Base de datos simulada
    localStorage.setItem('userSession', JSON.stringify(nuevoUsuario)); // Sesión activa

    alert("¡Cuenta creada con éxito! Bienvenido, " + nombre);
    redirigirPorRol(rol);
}

// --- FUNCIÓN: INICIAR SESIÓN ---
function iniciarSesion() {
    // Asume que en auth.html los inputs se llaman 'email' y 'password'
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');

    if(!emailInput || !passInput) return; // Seguridad por si no existen

    const correo = emailInput.value;
    const passRaw = passInput.value;
    const passEnc = encriptar(passRaw); 

    const usuarioGuardado = JSON.parse(localStorage.getItem('userDB'));

    if (usuarioGuardado && usuarioGuardado.correo === correo && usuarioGuardado.pass === passEnc) {
        localStorage.setItem('userSession', JSON.stringify(usuarioGuardado));
        redirigirPorRol(usuarioGuardado.rol);
    } else {
        alert("Credenciales incorrectas o usuario no registrado.");
    }
}

// --- DIRECCIONAMIENTO ---
function redirigirPorRol(rol) {
    if (rol === 'rescatista') {
        // Asegúrate que este archivo exista en tu carpeta
        window.location.href = 'dashboard-rescatista.html'; 
    } else if (rol === 'admin') {
        window.location.href = 'dashboard-admin.html';
    } else {
        window.location.href = 'dashboard-adoptante.html';
    }
}

// --- VERIFICAR SESIÓN ---
function checkSession() {
    const sesion = JSON.parse(localStorage.getItem('userSession'));
    const rutaActual = window.location.pathname;

    // Si ya hay sesión y entras a registro/login, te manda a tu panel
    if (sesion && (rutaActual.includes('auth.html') || rutaActual.includes('register.html'))) {
        redirigirPorRol(sesion.rol);
    }
}

// --- CERRAR SESIÓN ---
function cerrarSesion() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html'; // O a auth.html
}
