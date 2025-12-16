document.addEventListener("DOMContentLoaded", function() {

    // =======================================================
    // 1. LÓGICA DE LOGIN
    // =======================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Convertimos a minúsculas para evitar problemas de mayúsculas/minúsculas
            const emailVal = document.getElementById('email').value.trim().toLowerCase();
            const passVal = document.getElementById('password').value;

            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            const userFound = usersDB.find(u => u.email === emailVal && u.password === passVal);

            if (userFound) {
                localStorage.setItem('sesionActiva', 'true');
                localStorage.setItem('usuario', userFound.email);
                localStorage.setItem('userSession', JSON.stringify(userFound)); 
                
                alert(`¡Bienvenido, ${userFound.nombre}!`);

                // Redireccionar según rol
                if (userFound.rol === 'rescatista') {
                    window.location.href = "dashboard-rescatista.html";
                } else {
                    window.location.href = "search-pets.html"; 
                }
            } else {
                alert("Datos incorrectos o usuario no registrado.");
            }
        });
    }

    // =======================================================
    // 2. LÓGICA DE REGISTRO (CON VALIDACIÓN DE CORREO)
    // =======================================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');

        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                divRescatista.style.display = (this.value === 'rescatista') ? 'block' : 'none';
            });
        }

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtenemos valores crudos
            const emailRaw = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const rol = document.getElementById('role').value;

            // --- 🔴 NUEVA VALIDACIÓN: SOLO CORREOS REALES ---
            
            // 1. Limpiamos el correo (minúsculas y sin espacios)
            const emailLimpio = emailRaw.trim().toLowerCase();

            // 2. Lista de dominios permitidos (Whitelist)
            const dominiosPermitidos = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'live.com', 'icloud.com'];

            // 3. Separamos el correo en dos partes: [nombre] @ [dominio]
            const partesEmail = emailLimpio.split('@');

            // Verificamos que tenga arroba y estructura básica
            if (partesEmail.length !== 2 || partesEmail[0] === "" || partesEmail[1] === "") {
                alert("⚠️ El formato del correo electrónico no es válido.");
                return;
            }

            const dominioUsuario = partesEmail[1]; // Ejemplo: "gmail.com"

            // 4. Preguntamos si el dominio está en nuestra lista
            if (!dominiosPermitidos.includes(dominioUsuario)) {
                alert("🔒 Por seguridad, solo aceptamos registros con correos de: \n- Gmail\n- Outlook\n- Hotmail\n- Yahoo\n- iCloud");
                return; // Detiene el código aquí si el correo no es válido
            }
            // --- FIN DE LA VALIDACIÓN DE CORREO ---


            // Validación básica de contraseña
            if (password.length < 8) {
                alert("⚠️ La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            
            // Verificamos si ya existe (usando el email limpio)
            if (usersDB.find(u => u.email === emailLimpio)) {
                alert("Este correo ya está registrado.");
                return;
            }

            const newUser = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apPaterno').value,
                email: emailLimpio, // Guardamos el email ya validado y en minúsculas
                password: password,
                rol: rol,
                edad: document.getElementById('edad').value,
                direccion: {
                    calle: document.getElementById('dirCalle').value,
                    colonia: document.getElementById('dirColonia').value,
                    alcaldia: document.getElementById('dirAlcaldia').value
                },
                estatusLegal: rol === 'rescatista' ? document.getElementById('estatusLegal').value : "",
                fechaRegistro: new Date().toLocaleDateString()
            };

            usersDB.push(newUser);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));

            alert("¡Cuenta verificada y creada! Inicia sesión ahora.");
            window.location.href = "auth.html";
        });
    }

    // =======================================================
    // 3. CONTROL DEL MENÚ INTELIGENTE
    // =======================================================
    const sesionActiva = localStorage.getItem('sesionActiva');
    const userSession = JSON.parse(localStorage.getItem('userSession')); 
    const rutaActual = window.location.pathname;

    if (sesionActiva === 'true' && userSession) {
        
        // A) Ocultar botones de Login/Registro
        const botonesMenu = document.querySelectorAll('a, button, .btn-outline'); 
        botonesMenu.forEach(btn => {
            const texto = (btn.innerText || btn.textContent).toLowerCase();
            if (texto.includes('iniciar sesion') || 
                texto.includes('iniciar sesión') || 
                texto.includes('registrarse')) {
                btn.style.display = 'none';
            }
        });

        // B) AGREGAR BOTÓN "MI PANEL" Y "CERRAR SESIÓN"
        const nav = document.querySelector('.nav');
        const navContainer = document.getElementById('nav-auth-buttons') || nav;

        if (navContainer && !document.getElementById('btn-panel-auto')) {
            
            // 1. Crear botón MI PANEL
            const btnPanel = document.createElement('a');
            btnPanel.id = 'btn-panel-auto';
            btnPanel.innerText = "👤 Mi Panel";
            btnPanel.className = "btn-outline";
            btnPanel.style.marginRight = "10px";
            btnPanel.style.borderColor = "#e67e22";
            btnPanel.style.color = "#e67e22";
            
            if (userSession.rol === 'rescatista') {
                btnPanel.href = "dashboard-rescatista.html";
            } else {
                btnPanel.href = "dashboard-adoptante.html"; 
            }

            // 2. Crear botón CERRAR SESIÓN
            const btnLogout = document.createElement('a'); 
            btnLogout.id = 'btn-logout-auto';
            btnLogout.innerText = "Salir";
            btnLogout.className = "btn-outline"; 
            btnLogout.href = "#"; 
            btnLogout.style.color = "red";
            btnLogout.style.borderColor = "red";
            btnLogout.addEventListener('click', function(e) {
                e.preventDefault(); 
                cerrarSesion();
            });

            navContainer.appendChild(btnPanel);
            navContainer.appendChild(btnLogout);
        }

    } else {
        // C) PROTECCIÓN DE PÁGINAS PRIVADAS
        if (rutaActual.includes('shelters-map') || rutaActual.includes('education') || rutaActual.includes('dashboard')) {
            if (!rutaActual.includes('auth.html')) {
                alert("Debes iniciar sesión para ver esta sección.");
                window.location.href = "auth.html";
            }
        }
    }
});

function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userSession');
    window.location.href = "index.html";
}
