// js/auth.js - CUMPLE RF01 Y RF03 (Login estricto)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar estado de la barra de navegación
    actualizarNavbar();

    // 2. Controlar el Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // ¡VITAL! Evita recarga
            registrarUsuario();
        });
    }

    // 3. Controlar el Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // ¡VITAL! Evita recarga
            iniciarSesion();
        });
    }
});

// --- INTERFAZ REGISTRO (Selección de tipo) ---
function selectUserType(tipo) {
    const stepSelection = document.getElementById('stepSelection');
    const stepForm = document.getElementById('stepForm');
    
    if (stepSelection && stepForm) {
        stepSelection.style.display = 'none';
        stepForm.style.display = 'block';
    }

    const tipoInput = document.getElementById('tipo');
    if (tipoInput) tipoInput.value = tipo;

    // Ajustar formulario según tipo
    const formTitle = document.getElementById('formTitle');
    const refugioField = document.getElementById('refugioField');
    const adminField = document.getElementById('adminField');
    const nombreRefugio = document.getElementById('nombreRefugio');
    const razonAdmin = document.getElementById('razonAdmin');

    // Limpiar
    if(refugioField) refugioField.style.display = 'none';
    if(adminField) adminField.style.display = 'none';
    if(nombreRefugio) nombreRefugio.required = false;
    if(razonAdmin) razonAdmin.required = false;

    if (tipo === 'rescatista') {
        if(formTitle) formTitle.innerText = 'Registro de Refugio';
        if(refugioField) refugioField.style.display = 'block';
        if(nombreRefugio) nombreRefugio.required = true;
    } 
    else if (tipo === 'administrador') {
        if(formTitle) formTitle.innerText = 'Solicitud de Admin';
        if(adminField) adminField.style.display = 'block';
        if(razonAdmin) razonAdmin.required = true;
    } 
    else {
        if(formTitle) formTitle.innerText = 'Registro de Adoptante';
    }
}

function goBack() {
    document.getElementById('stepForm').style.display = 'none';
    document.getElementById('stepSelection').style.display = 'block';
    document.getElementById('registerForm').reset();
}

// --- RF01: REGISTRO DE USUARIOS ---
function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;
    
    let nombreFinal = nombre;
    if (tipo === 'rescatista') {
        nombreFinal = `${nombre} (${document.getElementById('nombreRefugio').value})`;
    }

    // Validar duplicados
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    if (usuarios.find(u => u.email === email)) {
        alert('❌ Este correo ya está registrado.');
        return;
    }

    // Guardar usuario
    const nuevoUsuario = { id: Date.now(), nombre: nombreFinal, email, password, tipo };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
    
    // Auto-login
    localStorage.setItem('usuario_activo', JSON.stringify(nuevoUsuario));
    
    alert('✅ ¡Cuenta creada con éxito!');
    window.location.href = 'index.html';
}

// --- RF03: INICIO DE SESIÓN ---
function iniciarSesion() {
    console.log("Intentando iniciar sesión..."); // Para depuración
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    
    // Buscar coincidencia exacta
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        localStorage.setItem('usuario_activo', JSON.stringify(usuario));
        alert(`👋 Bienvenido de nuevo, ${usuario.nombre}`);
        
        // Redirección forzada
        window.location.replace('index.html'); 
    } else {
        alert('❌ Correo o contraseña incorrectos.\nVerifica tus datos o regístrate si no tienes cuenta.');
    }
}

// --- RECUPERACIÓN DE CONTRASEÑA ---
function recuperarContra(event) {
    if(event) event.preventDefault(); // Evita salto de página
    
    const correo = prompt("📧 Ingresa tu correo para restablecer tu contraseña:");
    
    if (correo) {
        // Validación básica de formato email
        if(correo.includes('@') && correo.includes('.')) {
            alert(`✅ Hemos enviado un enlace de recuperación a: ${correo}\n(Revisa tu bandeja de entrada)`);
        } else {
            alert("❌ Por favor ingresa un correo válido.");
        }
    }
}

// --- SESIÓN Y NAVBAR ---
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
        // Usuario logueado
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) {
            navUser.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = usuario.nombre;
        }
    } else {
        // Visitante
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
    }
}
