// js/auth.js - CUMPLE RF01, RF02, RF03, RF04, RF05, RNF10

document.addEventListener("DOMContentLoaded", function() {
    checkSession();
    
    // Detectar formulario de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Mostrar campos según el rol (RF02)
        const roleSelect = document.getElementById('role');
        roleSelect.addEventListener('change', toggleCamposPorRol);
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarUsuario();
        });
    }

    // Detectar formulario de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// --- RNF10: ENCRIPTACIÓN (Simulada con Base64 para prototipo) ---
function encriptar(texto) {
    return btoa(texto); // Convierte a Base64 (No es texto plano)
}

// --- RF02: REGISTRO CON CAMPOS ESPECÍFICOS ---
function toggleCamposPorRol() {
    const rol = document.getElementById('role').value;
    const divRescatista = document.getElementById('camposRescatista');
    // Si es rescatista, mostramos el campo "Estatus Legal", si no, se oculta.
    if (rol === 'rescatista') {
        divRescatista.style.display = 'block';
    } else {
        divRescatista.style.display = 'none';
    }
}

function registrarUsuario() {
    // Datos Comunes (RF02)
    const nombre = document.getElementById('nombre').value;
    const apPaterno = document.getElementById('apPaterno').value;
    const apMaterno = document.getElementById('apMaterno').value;
    const edad = document.getElementById('edad').value;
    const curp = document.getElementById('curp').value;
    const direccion = document.getElementById('direccion').value; // Calle, Num, Col, etc.
    const correo = document.getElementById('registerEmail').value;
    const passRaw = document.getElementById('registerPassword').value;
    const rol = document.getElementById('role').value;

    // Datos Específicos (RF02)
    let estatusLegal = "";
    if (rol === 'rescatista') {
        estatusLegal = document.getElementById('estatusLegal').value;
    }

    // Validación básica
    if(passRaw.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    // RNF10: Guardar contraseña ENCRIPTADA
    const pass = encriptar(passRaw);

    const nuevoUsuario = { 
        nombre, apPaterno, apMaterno, edad, curp, direccion, 
        correo, pass, rol, estatusLegal 
    };

    // Guardar en LocalStorage ("Base de Datos")
    // Nota: En un sistema real usaríamos una lista de usuarios, aquí sobrescribimos para el demo
    localStorage.setItem('userDB', JSON.stringify(nuevoUsuario));
    
    // Auto-login
    localStorage.setItem('userSession', JSON.stringify(nuevoUsuario));

    alert("¡Cuenta creada con éxito! Bienvenido/a " + nombre);
    redirigirPorRol(rol);
}

// --- LOGIN (Validando contraseña encriptada) ---
function iniciarSesion() {
    const correo = document.getElementById('email').value;
    const passRaw = document.getElementById('password').value;
    const passEnc = encriptar(passRaw); // Encriptamos lo que escribe para comparar

    const usuarioGuardado = JSON.parse(localStorage.getItem('userDB'));

    if (usuarioGuardado && usuarioGuardado.correo === correo && usuarioGuardado.pass === passEnc) {
        localStorage.setItem('userSession', JSON.stringify(usuarioGuardado));
        redirigirPorRol(usuarioGuardado.rol);
    } else {
        alert("Correo o contraseña incorrectos.");
    }
}

// --- RF03: RECUPERACIÓN DE CONTRASEÑA ---
function recuperarContrasena() {
    const email = prompt("Por favor, ingresa tu correo electrónico para restablecer tu contraseña:");
    if (email) {
        // Simulamos envío (Cumple RF03)
        alert(`Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`);
    }
}

// --- RF04: EDITAR PERFIL ---
function guardarPerfilEditado() {
    const sesionActual = JSON.parse(localStorage.getItem('userSession'));
    if (!sesionActual) return;

    // Obtenemos los nuevos valores del modal (ver dashboard)
    const nuevoNombre = document.getElementById('editNombre').value;
    const nuevaDireccion = document.getElementById('editDireccion').value;

    // Actualizamos el objeto
    sesionActual.nombre = nuevoNombre;
    sesionActual.direccion = nuevaDireccion;

    // Guardamos en Session y DB
    localStorage.setItem('userSession', JSON.stringify(sesionActual));
    localStorage.setItem('userDB', JSON.stringify(sesionActual)); // Actualiza el registro maestro también

    alert("Perfil actualizado correctamente.");
    location.reload(); // Recargar para ver cambios
}

// --- RF05: ELIMINAR CUENTA ---
function eliminarCuenta() {
    const confirmacion = confirm("¿Estás seguro que deseas ELIMINAR tu cuenta? Esta acción no se puede deshacer.");
    if (confirmacion) {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userDB'); // Borra el registro
        localStorage.removeItem('solicitudesAdopcion'); // Opcional: Borra sus datos
        alert("Tu cuenta ha sido eliminada.");
        window.location.href = 'index.html';
    }
}

// --- UTILIDADES ---
function cerrarSesion() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

function checkSession() {
    const sesion = JSON.parse(localStorage.getItem('userSession'));
    const navButtons = document.getElementById('nav-auth-buttons');
    if (navButtons) {
        if (sesion) {
            let dashboardLink = 'dashboard-adoptante.html';
            if (sesion.rol === 'rescatista') dashboardLink = 'dashboard-rescatista.html';
            if (sesion.rol === 'admin') dashboardLink = 'dashboard-admin.html';

            navButtons.innerHTML = `
                <span style="margin-right:10px; font-size:0.9rem;">Hola, <strong>${sesion.nombre}</strong></span>
                <a href="${dashboardLink}" class="btn-outline" style="margin-right:5px;">Mi Panel</a>
                <button onclick="cerrarSesion()" class="btn-outline" style="border-color:#e74c3c; color:#e74c3c;">Salir</button>
            `;
        } else {
            navButtons.innerHTML = `<a href="auth.html" class="btn-outline">Iniciar Sesión</a>`;
        }
    }
}

function redirigirPorRol(rol) {
    if (rol === 'adoptante') window.location.href = 'dashboard-adoptante.html';
    else if (rol === 'rescatista') window.location.href = 'dashboard-rescatista.html';
    else if (rol === 'admin') window.location.href = 'dashboard-admin.html'; // Si tuvieras este archivo
    else window.location.href = 'index.html';
}
