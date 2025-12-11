// js/auth.js - GESTIÓN TOTAL (Diseño de Pasos + Seguridad)

document.addEventListener('DOMContentLoaded', () => {
    actualizarNavbar();

    // REGISTRO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga
            registrarUsuario();
        });
    }

    // LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga
            iniciarSesion();
        });
    }
});

// --- INTERFAZ: CAMBIO DE PASOS (TARJETAS -> FORMULARIO) ---
function selectUserType(tipo) {
    const stepSelection = document.getElementById('stepSelection');
    const stepForm = document.getElementById('stepForm');
    const tipoInput = document.getElementById('tipo');

    // Cambiar vista
    if (stepSelection && stepForm) {
        stepSelection.style.display = 'none';
        stepForm.style.display = 'block';
    }
    
    // Guardar tipo
    if (tipoInput) tipoInput.value = tipo;

    // Configurar campos según el tipo
    const formTitle = document.getElementById('formTitle');
    const refugioField = document.getElementById('refugioField');
    const adminField = document.getElementById('adminField');
    const nombreRefugio = document.getElementById('nombreRefugio');
    const razonAdmin = document.getElementById('razonAdmin');

    // Ocultar todo primero
    if(refugioField) refugioField.style.display = 'none';
    if(adminField) adminField.style.display = 'none';
    if(nombreRefugio) nombreRefugio.required = false;
    if(razonAdmin) razonAdmin.required = false;

    // Mostrar lo necesario
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

// --- VALIDACIÓN DE SEGURIDAD (RF01) ---
function esContrasenaSegura(password) {
    // Si quieres probar rápido usa una contraseña como: "HolaMundo123!"
    if (password.length < 12) {
        alert("⚠️ Contraseña insegura: Debe tener al menos 12 caracteres.");
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        alert("⚠️ Contraseña insegura: Falta una letra MAYÚSCULA.");
        return false;
    }
    if (!/[0-9]/.test(password)) {
        alert("⚠️ Contraseña insegura: Falta un NÚMERO.");
        return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        alert("⚠️ Contraseña insegura: Falta un SÍMBOLO (! @ # $).");
        return false;
    }
    return true;
}

// --- LÓGICA DE REGISTRO ---
function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;

    // 1. Validar Seguridad
    if (!esContrasenaSegura(password)) {
        return; // Se detiene si la contraseña es débil
    }

    // 2. Personalizar nombre si es necesario
    let nombreFinal = nombre;
    if (tipo === 'rescatista') {
        const ref = document.getElementById('nombreRefugio').value;
        nombreFinal = `${nombre} (${ref})`;
    }

    // 3. Verificar duplicados
    const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
    if (usuarios.find(u => u.email === email)) {
        alert('❌ Este correo ya está registrado.');
        return;
    }

    // 4. Guardar
    const nuevoUsuario = { id: Date.now(), nombre: nombreFinal, email, password, tipo };
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
    localStorage.setItem('usuario_activo', JSON.stringify(nuevoUsuario));
    
    alert('✅ ¡Cuenta creada exitosamente!');
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
        alert(`👋 Bienvenido de nuevo, ${usuario.nombre}`);
        window.location.replace('index.html');
    } else {
        alert('❌ Credenciales incorrectas.');
    }
}

// --- RECUPERAR CONTRASEÑA ---
function recuperarContra(e) {
    if(e) e.preventDefault();
    const correo = prompt("Ingresa tu correo para recuperar contraseña:");
    if (correo && correo.includes('@')) {
        alert("✅ Enlace de recuperación enviado (Simulado).");
    }
}

// --- SESIÓN Y MENÚ ---
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
        if(navAuth) navAuth.style.display = 'none';
        if(navUser) {
            navUser.style.display = 'flex';
            if(userNameSpan) userNameSpan.textContent = usuario.nombre;
        }
    } else {
        if(navAuth) navAuth.style.display = 'flex';
        if(navUser) navUser.style.display = 'none';
    }
}
