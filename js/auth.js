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

    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!regexSoloLetras.test(nombre)) {
        return alert("Error: El nombre no puede contener números ni símbolos.");
    }
    if (!regexSoloLetras.test(apPaterno) || !regexSoloLetras.test(apMaterno)) {
        return alert("Error: Los apellidos no pueden contener números.");
    }

    if (edad < 18 || edad > 99) {
        return alert("Error: Debes ser mayor de 18 años para registrarte.");
    }

    const regexCURP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
    if (!regexCURP.test(curp)) {
        return alert("Error: El CURP ingresado no es válido. Debe tener 18 caracteres y el formato oficial.");
    }

    if (direccion.length < 10) {
        return alert("Error: La dirección es muy corta. Por favor detalla calle y colonia.");
    }

    const regexPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexPass.test(passRaw)) {
        return alert("Error: La contraseña es insegura.\nDebe tener:\n- Mínimo 8 caracteres\n- Una mayúscula\n- Un número\n- Un símbolo (@, #, $, etc.)");
    }

    if (rol === 'rescatista' && estatusLegal.length < 5) {
        return alert("Error: Debes especificar el estatus legal del refugio.");
    }

    const pass = encriptar(passRaw);

    const nuevoUsuario = { 
        nombre, apPaterno, apMaterno, edad, curp, direccion, 
        correo, pass, rol, estatusLegal 
    };

    localStorage.setItem('userDB', JSON.stringify(nuevoUsuario));
    localStorage.setItem('userSession', JSON.stringify(nuevoUsuario));

    alert("¡Registro Exitoso! Bienvenido, " + nombre);
    redirigirPorRol(rol);
}

function iniciarSesion() {
    const correo = document.getElementById('email').value;
    const passRaw = document.getElementById('password').value;
    const passEnc = encriptar(passRaw);

    const usuarioGuardado = JSON.parse(localStorage.getItem('userDB'));

    if (usuarioGuardado && usuarioGuardado.correo === correo && usuarioGuardado.pass === passEnc) {
        localStorage.setItem('userSession', JSON.stringify(usuarioGuardado));
        redirigirPorRol(usuarioGuardado.rol);
    } else {
        alert("Correo o contraseña incorrectos.");
    }
}

function recuperarContrasena() {
    const email = prompt("Ingresa tu correo para restablecer:");
    if (email && email.includes('@')) {
        alert(`Hemos enviado un enlace de recuperación a ${email}.`);
    } else if (email) {
        alert("Por favor ingresa un correo válido.");
    }
}

function guardarPerfilEditado() {
    const sesionActual = JSON.parse(localStorage.getItem('userSession'));
    if (!sesionActual) return;

    if(document.getElementById('editNombre')) {
        sesionActual.nombre = document.getElementById('editNombre').value;
    }
    if(document.getElementById('editDireccion')) {
        sesionActual.direccion = document.getElementById('editDireccion').value;
    }
    if(document.getElementById('editEstatus')) {
        sesionActual.estatusLegal = document.getElementById('editEstatus').value;
    }

    localStorage.setItem('userSession', JSON.stringify(sesionActual));
    localStorage.setItem('userDB', JSON.stringify(sesionActual));

    alert("Perfil actualizado correctamente.");
    location.reload();
}

function eliminarCuenta() {
    if (confirm("¿Estás seguro que deseas ELIMINAR tu cuenta? Esta acción es irreversible.")) {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userDB');
        localStorage.removeItem('solicitudesAdopcion');
        alert("Tu cuenta ha sido eliminada.");
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
