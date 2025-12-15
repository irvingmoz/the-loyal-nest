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
    // 1. Recolección de Datos
    const nombre = document.getElementById('nombre').value.trim();
    const apPaterno = document.getElementById('apPaterno').value.trim();
    const apMaterno = document.getElementById('apMaterno').value.trim();
    const edad = document.getElementById('edad').value;
    const curp = document.getElementById('curp').value.trim().toUpperCase();
    
    // Dirección Desglosada
    const calle = document.getElementById('dirCalle').value.trim();
    const numExt = document.getElementById('dirNumExt').value.trim();
    const numInt = document.getElementById('dirNumInt').value.trim(); // Opcional
    const colonia = document.getElementById('dirColonia').value.trim();
    const cp = document.getElementById('dirCP').value.trim();
    const alcaldia = document.getElementById('dirAlcaldia').value;

    const correo = document.getElementById('registerEmail').value.trim();
    const passRaw = document.getElementById('registerPassword').value;
    const rol = document.getElementById('role').value;
    
    let estatusLegal = "";
    if (rol === 'rescatista') {
        estatusLegal = document.getElementById('estatusLegal').value.trim();
    }

    // 2. Validaciones Estrictas
    const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexSoloLetras.test(nombre)) return alert("Error: Nombre inválido (no uses números).");
    if (!regexSoloLetras.test(apPaterno) || !regexSoloLetras.test(apMaterno)) return alert("Error: Apellidos inválidos.");
    
    if (edad < 18 || edad > 99) return alert("Error: Debes ser mayor de 18 años.");
    
    const regexCURP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;
    if (!regexCURP.test(curp)) return alert("Error: CURP inválido (debe tener 18 caracteres y formato oficial).");

    // Validar Dirección
    if (calle.length < 3) return alert("Error: Escribe el nombre de la calle.");
    if (numExt.length < 1) return alert("Error: Falta el número exterior.");
    if (colonia.length < 3) return alert("Error: Falta la colonia.");
    
    const regexCP = /^\d{5}$/;
    if (!regexCP.test(cp)) return alert("Error: El Código Postal debe ser de 5 números exactos.");
    
    if (alcaldia === "") return alert("Error: Selecciona tu Alcaldía.");

    // Validar Password
    const regexPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexPass.test(passRaw)) return alert("Error: La contraseña debe tener al menos 8 caracteres, una Mayúscula, un Número y un Símbolo.");

    if (rol === 'rescatista' && estatusLegal.length < 5) return alert("Error: Falta el estatus legal o nombre del refugio.");

    // 3. Validar Duplicados (Bloqueo de correo repetido)
    const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
    if (usuariosExistentes.find(u => u.correo === correo)) {
        return alert("❌ Error: Este correo ya está registrado. Por favor inicia sesión.");
    }

    // 4. Construcción de Dirección Final
    let stringNumero = `#${numExt}`;
    if (numInt.length > 0) {
        stringNumero += ` Int. ${numInt}`;
    }
    const direccionCompleta = `${calle} ${stringNumero}, Col. ${colonia}, CP ${cp}, ${alcaldia}`;

    // 5. Guardado
    const pass = encriptar(passRaw);
    
    const nuevoUsuario = { 
        nombre, apPaterno, apMaterno, edad, curp, 
        direccion: direccionCompleta, 
        correo, pass, rol, estatusLegal 
    };

    usuariosExistentes.push(nuevoUsuario);
    localStorage.setItem('usersDB', JSON.stringify(usuariosExistentes));
    localStorage.setItem('userSession', JSON.stringify(nuevoUsuario));

    alert("¡Registro Exitoso! Bienvenido/a " + nombre);
    redirigirPorRol(rol);
}

function iniciarSesion() {
    const correo = document.getElementById('email').value;
    const passRaw = document.getElementById('password').value;
    const passEnc = encriptar(passRaw);

    const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
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
    if (email) alert(`Hemos enviado un enlace de recuperación a ${email}.`);
}

function guardarPerfilEditado() {
    const sesionActual = JSON.parse(localStorage.getItem('userSession'));
    if (!sesionActual) return;

    if(document.getElementById('editNombre')) sesionActual.nombre = document.getElementById('editNombre').value;
    if(document.getElementById('editDireccion')) sesionActual.direccion = document.getElementById('editDireccion').value;
    if(document.getElementById('editEstatus')) sesionActual.estatusLegal = document.getElementById('editEstatus').value;

    localStorage.setItem('userSession', JSON.stringify(sesionActual));

    // Actualizar también en la base de datos general
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
    if (confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción borrará tus datos.")) {
        const sesionActual = JSON.parse(localStorage.getItem('userSession'));
        
        const usuariosExistentes = JSON.parse(localStorage.getItem('usersDB')) || [];
        const nuevosUsuarios = usuariosExistentes.filter(u => u.correo !== sesionActual.correo);
        localStorage.setItem('usersDB', JSON.stringify(nuevosUsuarios));

        localStorage.removeItem('userSession');
        // Opcional: localStorage.removeItem('solicitudesAdopcion'); si quisieras borrar todo
        
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
