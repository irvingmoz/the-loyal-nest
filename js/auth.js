document.addEventListener("DOMContentLoaded", function() {

    // =======================================================
    // 1. LÓGICA DE LOGIN
    // =======================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailVal = document.getElementById('email').value.trim().toLowerCase();
            const passVal = document.getElementById('password').value;

            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            const userFound = usersDB.find(u => u.email === emailVal && u.password === passVal);

            if (userFound) {
                localStorage.setItem('sesionActiva', 'true');
                localStorage.setItem('usuario', userFound.email);
                localStorage.setItem('userSession', JSON.stringify(userFound)); 
                
                alert(`¡Bienvenido, ${userFound.nombre}!`);

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
    // 2. LÓGICA DE REGISTRO
    // =======================================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        
        // --- 🔴 NUEVO: LIMPIEZA DE CURP EN TIEMPO REAL ---
        // Esto evita que escriban símbolos raros mientras teclean
        const inputCurp = document.getElementById('curp');
        if (inputCurp) {
            inputCurp.addEventListener('input', function(e) {
                let valor = e.target.value.toUpperCase(); // Todo a mayúsculas
                
                // Esta expresión regular borra todo lo que NO sea letra (A-Z) o número (0-9)
                valor = valor.replace(/[^A-Z0-9]/g, '');
                
                // No permitir más de 18 caracteres visualmente
                if (valor.length > 18) {
                    valor = valor.slice(0, 18);
                }
                
                e.target.value = valor; // Regresamos el valor limpio al campo
            });
        }
        // --- FIN DE LIMPIEZA CURP ---

        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');

        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                divRescatista.style.display = (this.value === 'rescatista') ? 'block' : 'none';
            });
        }

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtenemos valores
            const emailRaw = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const rol = document.getElementById('role').value;
            const curpRaw = document.getElementById('curp').value; // Valor del CURP

            // VALIDACIÓN DE CORREO (Dominios permitidos)
            const emailLimpio = emailRaw.trim().toLowerCase();
            const dominiosPermitidos = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'live.com', 'icloud.com'];
            const partesEmail = emailLimpio.split('@');

            if (partesEmail.length !== 2 || partesEmail[0] === "" || partesEmail[1] === "") {
                alert("⚠️ El formato del correo electrónico no es válido.");
                return;
            }
            if (!dominiosPermitidos.includes(partesEmail[1])) {
                alert("🔒 Por seguridad, solo aceptamos correos de: Gmail, Outlook, Hotmail, Yahoo o iCloud.");
                return;
            }

            // --- 🔴 NUEVO: VALIDACIÓN EXACTA DE CURP ---
            if (curpRaw.length !== 18) {
                alert("⚠️ La CURP debe tener EXACTAMENTE 18 caracteres alfanuméricos.");
                return; // Detiene el registro si no son 18
            }
            // --- FIN VALIDACIÓN CURP ---

            // Validación contraseña
            if (password.length < 8) {
                alert("⚠️ La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            if (usersDB.find(u => u.email === emailLimpio)) {
                alert("Este correo ya está registrado.");
                return;
            }

            const newUser = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apPaterno').value,
                email: emailLimpio,
                password: password,
                rol: rol,
                curp: curpRaw, // Guardamos la CURP validada
                edad: document.getElementById('edad').value,
                direccion: {
                    calle: document.getElementById('dirCalle') ? document.getElementById('dirCalle').value : '',
                    // Nota: Asegúrate de que los IDs de dirección coincidan con tu HTML, 
                    // si usas un solo textarea con id="direccion", cambia esto a:
                    // direccionCompleta: document.getElementById('direccion').value
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
        const botonesMenu = document.querySelectorAll('a, button, .btn-outline'); 
        botonesMenu.forEach(btn => {
            const texto = (btn.innerText || btn.textContent).toLowerCase();
            if (texto.includes('iniciar sesion') || 
                texto.includes('iniciar sesión') || 
                texto.includes('registrarse')) {
                btn.style.display = 'none';
            }
        });

        const nav = document.querySelector('.nav');
        const navContainer = document.getElementById('nav-auth-buttons') || nav;

        if (navContainer && !document.getElementById('btn-panel-auto')) {
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
