document.addEventListener("DOMContentLoaded", function() {

    // =======================================================
    // 0. FUNCIONES DE VALIDACIÓN AUXILIARES
    // =======================================================
    
    // Función "A prueba de balas" para la CURP
    function esCurpValida(curp) {
        if (!curp) return true; // Si está vacío (y es opcional), pasa.

        // 1. Longitud exacta
        if (curp.length !== 18) return false;

        // 2. Anti-Trampas (Caracteres repetidos como 00000 o AAAAA)
        if (/^(\w)\1+$/.test(curp)) return false;

        // 3. Estructura Manual (Los primeros 4 deben ser LETRAS)
        const primeros4 = curp.substring(0, 4);
        const digitosFecha = curp.substring(4, 10);

        // Si los primeros 4 NO son letras (A-Z) -> Falso
        if (!/^[A-Z]{4}$/.test(primeros4)) return false;

        // Si los siguientes 6 NO son números -> Falso
        if (!/^\d{6}$/.test(digitosFecha)) return false;

        return true;
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

                // Redirección según rol
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
        
        // --- SOLO LETRAS EN NOMBRES Y APELLIDOS ---
        const camposTexto = ['nombre', 'apPaterno', 'apMaterno'];
        camposTexto.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 30);
                });
            }
        });

        // --- LIMPIEZA DE CURP (Mayúsculas y sin símbolos) ---
        const inputCurp = document.getElementById('curp');
        if (inputCurp) {
            inputCurp.addEventListener('input', function(e) {
                let valor = e.target.value.toUpperCase();
                valor = valor.replace(/[^A-Z0-9]/g, '');
                if (valor.length > 18) valor = valor.slice(0, 18);
                e.target.value = valor;
            });
        }

        // --- MOSTRAR CAMPOS EXTRA SI ES RESCATISTA ---
        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');
        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                divRescatista.style.display = (this.value === 'rescatista') ? 'block' : 'none';
            });
        }

        // --- ENVÍO DEL FORMULARIO ---
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailRaw = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const rol = document.getElementById('role').value;
            const curpRaw = document.getElementById('curp').value.trim();

            // Validación de Correo
            const emailLimpio = emailRaw.trim().toLowerCase();
            const dominiosPermitidos = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'live.com', 'icloud.com'];
            const partesEmail = emailLimpio.split('@');

            if (partesEmail.length !== 2 || !dominiosPermitidos.includes(partesEmail[1])) {
                alert("🔒 Por seguridad, solo aceptamos correos de: Gmail, Outlook, Hotmail, Yahoo o iCloud.");
                return;
            }

            // Validación de CURP Estricta
            if (curpRaw.length > 0) { 
                if (!esCurpValida(curpRaw)) {
                    alert("⚠️ ERROR EN CURP:\n\n- No se permiten puros números/ceros.\n- Debe empezar con 4 letras.\n- Debe tener 18 caracteres.");
                    return; 
                }
            }

            if (password.length < 8) {
                alert("⚠️ La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            // Verificar duplicados
            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            if (usersDB.find(u => u.email === emailLimpio)) {
                alert("Este correo ya está registrado.");
                return;
            }

            // Construir dirección
            let direccionCompleta = "";
            const calle = document.getElementById('dirCalle');
            if (calle) {
                direccionCompleta = `${calle.value} ${document.getElementById('dirNumExt').value}, ${document.getElementById('dirColonia').value}, ${document.getElementById('dirAlcaldia').value}`;
            }

            // Guardar Usuario
            const newUser = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apPaterno').value,
                apellidoMat: document.getElementById('apMaterno') ? document.getElementById('apMaterno').value : '',
                email: emailLimpio,
                password: password,
                rol: rol,
                curp: curpRaw,
                edad: document.getElementById('edad').value,
                direccion: direccionCompleta,
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
    // 3. MENÚ INTELIGENTE (NAVBAR)
    // =======================================================
    const sesionActiva = localStorage.getItem('sesionActiva');
    const userSession = JSON.parse(localStorage.getItem('userSession')); 
    const rutaActual = window.location.pathname;

    if (sesionActiva === 'true' && userSession) {
        // Ocultar botones de login
        document.querySelectorAll('a, button').forEach(btn => {
            const txt = (btn.innerText || '').toLowerCase();
            if (txt.includes('iniciar ses') || txt.includes('registrarse')) btn.style.display = 'none';
        });

        // Insertar botones de usuario
        const navContainer = document.getElementById('nav-auth-buttons') || document.querySelector('.nav-list');
        if (navContainer && !document.getElementById('btn-panel-auto')) {
            const btnPanel = document.createElement('a');
            btnPanel.id = 'btn-panel-auto';
            btnPanel.innerText = `👤 ${userSession.nombre.split(' ')[0]}`;
            btnPanel.className = "btn-outline";
            btnPanel.style.cssText = "margin-right:10px; border-color:#e67e22; color:#e67e22; text-decoration:none;";
            
            if (userSession.rol === 'rescatista') btnPanel.href = "dashboard-rescatista.html";
            else if (userSession.rol === 'administrador') btnPanel.href = "dashboard-admin.html";
            else btnPanel.href = "dashboard-adoptante.html"; 

            const btnLogout = document.createElement('a'); 
            btnLogout.innerText = "Salir";
            btnLogout.className = "btn-outline"; 
            btnLogout.href = "#"; 
            btnLogout.style.cssText = "color:red; border-color:red; text-decoration:none;";
            btnLogout.onclick = cerrarSesion;

            if (navContainer.tagName === 'UL') {
                const li = document.createElement('li'); li.appendChild(btnPanel); navContainer.appendChild(li);
                const li2 = document.createElement('li'); li2.appendChild(btnLogout); navContainer.appendChild(li2);
            } else {
                navContainer.appendChild(btnPanel);
                navContainer.appendChild(btnLogout);
            }
        }
    } else {
        // Protección de rutas privadas
        if (rutaActual.includes('dashboard')) {
            window.location.href = "auth.html";
        }
    }
});

function cerrarSesion() {
    if(confirm("¿Seguro que deseas cerrar sesión?")) {
        localStorage.clear(); // Limpieza total para evitar conflictos
        window.location.href = "index.html";
    }
}
