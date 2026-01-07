document.addEventListener("DOMContentLoaded", function() {

    // =======================================================
    // 0. FUNCIONES DE VALIDACIÓN AUXILIARES
    // =======================================================
    
    // Función mejorada para validar CURP (Formato + Anti-Trampas)
    function esCurpValida(curp) {
        if (!curp) return true; // Si es opcional y está vacío, es válido

        // 1. Longitud exacta
        if (curp.length !== 18) return false;

        // 2. Filtro Anti-Trampas: Evita caracteres repetidos (ej: AAAAA...)
        if (/^(\w)\1+$/.test(curp)) {
            return false;
        }

        // 3. Regex Oficial
        const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
        return curp.match(re);
    }

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
                } else if (userFound.rol === 'administrador') {
                    window.location.href = "dashboard-admin.html";
                } else {
                    window.location.href = "dashboard-adoptante.html"; 
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
        
        // --- 🔴 SOLO LETRAS EN NOMBRES Y APELLIDOS ---
        const camposTexto = ['nombre', 'apPaterno', 'apMaterno'];
        
        camposTexto.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function(e) {
                    // Reemplaza todo lo que NO sea letra o espacio
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 30);
                });
            }
        });

        // --- LIMPIEZA VISUAL DE CURP ---
        const inputCurp = document.getElementById('curp');
        if (inputCurp) {
            inputCurp.addEventListener('input', function(e) {
                let valor = e.target.value.toUpperCase();
                valor = valor.replace(/[^A-Z0-9]/g, ''); // Solo letras y números
                if (valor.length > 18) {
                    valor = valor.slice(0, 18);
                }
                e.target.value = valor;
            });
        }

        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');

        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                divRescatista.style.display = (this.value === 'rescatista') ? 'block' : 'none';
            });
        }

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailRaw = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const rol = document.getElementById('role').value;
            const curpRaw = document.getElementById('curp').value.trim();

            // VALIDACIÓN DE CORREO
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

            // VALIDACIÓN CURP ESTRICTA
            if (curpRaw.length > 0) { 
                if (!esCurpValida(curpRaw)) {
                    alert("⚠️ CURP inválida.\n\nVerifica que:\n1. Tenga 18 caracteres.\n2. No sean caracteres repetidos.\n3. Cumpla con el formato oficial (4 letras iniciales, fecha, etc).");
                    return; 
                }
            }

            if (password.length < 8) {
                alert("⚠️ La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            if (usersDB.find(u => u.email === emailLimpio)) {
                alert("Este correo ya está registrado.");
                return;
            }

            // Obteniendo dirección de forma segura
            let direccionCompleta = "";
            const calle = document.getElementById('dirCalle');
            if (calle) {
                direccionCompleta = `${calle.value} ${document.getElementById('dirNumExt').value}, ${document.getElementById('dirColonia').value}, ${document.getElementById('dirAlcaldia').value}`;
            } else if (document.getElementById('direccion')) {
                direccionCompleta = document.getElementById('direccion').value;
            }

            const newUser = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apPaterno').value,
                apellidoMat: document.getElementById('apMaterno') ? document.getElementById('apMaterno').value : '',
                email: emailLimpio,
                password: password,
                rol: rol,
                curp: curpRaw, // Guardamos la CURP validada
                edad: document.getElementById('edad').value,
                direccion: direccionCompleta, // Dirección unificada
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
        // Ocultar botones de Login/Registro
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
        // Buscar el contenedor de botones o usar el nav como fallback
        const navContainer = document.getElementById('nav-auth-buttons') || document.querySelector('.nav-list') || nav;

        if (navContainer && !document.getElementById('btn-panel-auto')) {
            // Crear Botón "Mi Panel"
            const btnPanel = document.createElement('a');
            btnPanel.id = 'btn-panel-auto';
            btnPanel.innerText = `👤 ${userSession.nombre.split(' ')[0]}`; // Solo primer nombre
            btnPanel.className = "btn-outline";
            btnPanel.style.marginRight = "10px";
            btnPanel.style.borderColor = "#e67e22";
            btnPanel.style.color = "#e67e22";
            btnPanel.style.textDecoration = "none";
            
            if (userSession.rol === 'rescatista') {
                btnPanel.href = "dashboard-rescatista.html";
            } else if (userSession.rol === 'administrador') {
                btnPanel.href = "dashboard-admin.html";
            } else {
                btnPanel.href = "dashboard-adoptante.html"; 
            }

            // Crear Botón "Salir"
            const btnLogout = document.createElement('a'); 
            btnLogout.id = 'btn-logout-auto';
            btnLogout.innerText = "Salir";
            btnLogout.className = "btn-outline"; 
            btnLogout.href = "#"; 
            btnLogout.style.color = "red";
            btnLogout.style.borderColor = "red";
            btnLogout.style.textDecoration = "none";
            btnLogout.addEventListener('click', function(e) {
                e.preventDefault(); 
                cerrarSesion();
            });

            // Insertar botones en el DOM
            // Si es una lista (ul), creamos li. Si es div, metemos directo.
            if (navContainer.tagName === 'UL') {
                const liPanel = document.createElement('li');
                liPanel.appendChild(btnPanel);
                navContainer.appendChild(liPanel);

                const liLogout = document.createElement('li');
                liLogout.appendChild(btnLogout);
                navContainer.appendChild(liLogout);
            } else {
                navContainer.appendChild(btnPanel);
                navContainer.appendChild(btnLogout);
            }
        }

    } else {
        // Protección de rutas privadas
        if (rutaActual.includes('dashboard')) {
            alert("Debes iniciar sesión para ver esta sección.");
            window.location.href = "auth.html";
        }
    }
});

// Función global para cerrar sesión
function cerrarSesion() {
    if(confirm("¿Seguro que deseas cerrar sesión?")) {
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('usuario');
        localStorage.removeItem('userSession');
        window.location.href = "index.html";
    }
}
