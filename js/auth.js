document.addEventListener("DOMContentLoaded", function() {
    checkSession();
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const roleSelect = document.getElementById('role');
        if(roleSelect) {
            roleSelect.addEventListener('change', toggleCamposPorRol);
        }
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarUsuario();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

function encriptar(texto) {
    return btoa(texto); 
}

function toggleCamposPorRol() {
    const rol = document.getElementById('role').value;
    const divRescatista = document.getElementById('camposRescatista');
    if (rol === 'rescatista') {
        divRescatista.style.display = 'block';
    } else {
        divRescatista.style.display = 'none';
    }
}

function registrarUsuario() {
    const nombre = document.getElementById('nombre').value.trim();
    const apPaterno = document.getElementById('apPaterno').value.trim();
    const apMaterno = document.getElementById('apMaterno').value.trim();
    const edad = document.getElementById('edad').value;
    const curp = document.getElementById('curp').value.trim().toUpperCase();
    const direccion = document.getElementById('direccion').value.trim();
    const correo = document.getElementById('registerEmail').value.trim();
    const passRaw = document.getElementById('registerPassword').value;
    const rol = document.getElementById('role').value;

    let estatusLegal = "";
    if (rol === 'rescatista') {
        estatusLegal = document.getElementById('estatusLegal').value.trim();
    }

    // --- VALIDACIONES ---
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexSoloLetras.test(nombre)) return alert("Error: Nombre inválido.");
    if (!regexSoloLetras.test(apPaterno) || !regexSoloLetras.test(apMaterno)) return alert("Error: Apellidos inválidos.");
    if (edad < 18 || edad > 99) return alert("Error: Debes ser mayor de 18 años.");
    
    const regexCURP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
    if (!regexCURP.test(curp)) return alert("Error: CURP inválido (18 caracteres requeridos).");

    if (direccion.length < 15) return alert("Error: Dirección muy corta.");

    const regexPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexPass.test(passRaw)) return alert("Error: La contraseña debe tener Mayúscula, Número y Símbolo.");

    if (rol === 'rescatista' && estatusLegal.length < 5) return alert("Error: Falta estatus legal.");

    // --- VALIDACIÓN DE CORREO DUPLICADO (NUEVO) ---
    // 1. Traemos la lista actual de usuarios (o creamos una vacía)
    const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
    
    // 2. Buscamos si el correo ya existe
    const usuarioDuplicado = usuariosExistentes.find(u => u.correo === correo);
    
    if (usuarioDuplicado) {
        return alert("❌ Error: Este correo electrónico YA está registrado. Intenta iniciar sesión.");
    }

    // --- GUARDADO ---
    const pass = encriptar(passRaw);
    const nuevoUsuario = { nombre, apPaterno, apMaterno, edad, curp, direccion, correo, pass, rol, estatusLegal };

    // 3. Agregamos el nuevo usuario a la lista
    usuariosExistentes.push(nuevoUsuario);
    
    // 4. Guardamos la lista completa
    localStorage.setItem('usersDB', JSON.stringify(usuariosExistentes));
    
    // Auto-login
    localStorage.setItem('userSession', JSON.stringify(nuevoUsuario));

    alert("¡Registro Exitoso! Bienvenido/a.");
    redirigirPorRol(rol);
}

function iniciarSesion() {
    const correo = document.getElementById('email').value;
    const passRaw = document.getElementById('password').value;
    const passEnc = encriptar(passRaw);

    // 1. Buscamos en la LISTA de usuarios
    const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
    
    // 2. Encontramos al usuario correcto
    const usuarioEncontrado = usuariosExistentes.find(u => u.correo === correo && u.pass === passEnc);

    if (usuarioEncontrado) {
        localStorage.setItem('userSession', JSON.stringify(usuarioEncontrado));
        redirigirPorRol(usuarioEncontrado.rol);
    } else {
        alert("⚠️ Correo o contraseña incorrectos.");
    }
}

function recuperarContrasena() {
    const email = prompt("Ingresa tu correo para restablecer:");
    if (email) alert(`Hemos enviado un enlace a ${email}.`);
}

function guardarPerfilEditado() {
    // Actualiza la sesión actual
    const sesionActual = JSON.parse(localStorage.getItem('userSession'));
    if (!sesionActual) return;

    if(document.getElementById('editNombre')) sesionActual.nombre = document.getElementById('editNombre').value;
    if(document.getElementById('editDireccion')) sesionActual.direccion = document.getElementById('editDireccion').value;
    if(document.getElementById('editEstatus')) sesionActual.estatusLegal = document.getElementById('editEstatus').value;

    localStorage.setItem('userSession', JSON.stringify(sesionActual));

    // TAMBIÉN actualiza al usuario en la lista grande (usersDB)
    const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
    const index = usuariosExistentes.findIndex(u => u.correo === sesionActual.correo);
    if(index !== -1) {
        usuariosExistentes[index] = sesionActual;
        localStorage.setItem('usersDB', JSON.stringify(usuariosExistentes));
    }

    alert("Perfil actualizado correctamente.");
    location.reload();
}

function eliminarCuenta() {
    if (confirm("¿Seguro que deseas eliminar tu cuenta?")) {
        const sesionActual = JSON.parse(localStorage.getItem('userSession'));
        
        // Borrar de la lista grande
        const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
        const nuevosUsuarios = usuariosExistentes.filter(u => u.correo !== sesionActual.correo);
        localStorage.setItem('usersDB', JSON.stringify(nuevosUsuarios));

        // Borrar sesión
        localStorage.removeItem('userSession');
        localStorage.removeItem('solicitudesAdopcion');
        
        alert("Cuenta eliminada.");
        window.location.href = 'index.html';
    }
}

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
                <a href="${dashboardLink}" class="btn-outline" style="margin-right:5px; text-decoration:none; color:#333;">Mi Panel</a>
                <button onclick="cerrarSesion()" class="btn-outline" style="border-color:#e74c3c; color:#e74c3c;">Salir</button>
            `;
        } else {
            navButtons.innerHTML = `<a href="auth.html" class="btn-outline" style="text-decoration:none; color:#333;">Iniciar Sesión</a>`;
        }
    }
}

function redirigirPorRol(rol) {
    if (rol === 'adoptante') window.location.href = 'dashboard-adoptante.html';
    else if (rol === 'rescatista') window.location.href = 'dashboard-rescatista.html';
    else if (rol === 'admin') window.location.href = 'dashboard-admin.html';
    else window.location.href = 'index.html';
}
