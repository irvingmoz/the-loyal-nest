document.addEventListener("DOMContentLoaded", function() {
    console.log("🟢 auth.js cargado correctamente");

    // =======================================================
    // 0. FUNCIONES DE VALIDACIÓN
    // =======================================================
    function esCurpValida(curp) {
        if (!curp) return true; 
        if (curp.length !== 18) return false;
        if (/^(\w)\1+$/.test(curp)) return false; // Anti-trampas
        const primeros4 = curp.substring(0, 4);
        const digitosFecha = curp.substring(4, 10);
        if (!/^[A-Z]{4}$/.test(primeros4)) return false;
        if (!/^\d{6}$/.test(digitosFecha)) return false;
        return true;
    }

    // =======================================================
    // 1. LÓGICA DE LOGIN (CON BLOQUE DE SEGURIDAD)
    // =======================================================
    const loginForm = document.getElementById('loginForm');
    
    // 🛡️ SOLO EJECUTAR ESTO SI EXISTE EL FORMULARIO DE LOGIN
    if (loginForm) {
        console.log("🔹 Formulario de Login detectado");
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

                if (userFound.rol === 'rescatista') window.location.href = "dashboard-rescatista.html";
                else if (userFound.rol === 'administrador') window.location.href = "dashboard-admin.html";
                else window.location.href = "dashboard-adoptante.html"; 
            } else {
                alert("Datos incorrectos o usuario no registrado.");
            }
        });
    }

    // =======================================================
    // 2. LÓGICA DE REGISTRO (CON BLOQUE DE SEGURIDAD)
    // =======================================================
    const registerForm = document.getElementById('registerForm');

    // 🛡️ SOLO EJECUTAR ESTO SI EXISTE EL FORMULARIO DE REGISTRO
    if (registerForm) {
        console.log("🔹 Formulario de Registro detectado");

        // --- Validaciones Visuales (Solo Letras) ---
        ['nombre', 'apPaterno', 'apMaterno'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 30);
                });
            }
        });

        // --- Limpieza CURP ---
        const inputCurp = document.getElementById('curp');
        if (inputCurp) {
            inputCurp.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
            });
        }

        // --- Mostrar campos Rescatista ---
        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');
        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                divRescatista.style.display = (this.value === 'rescatista') ? 'block' : 'none';
            });
        }

        // --- EL EVENTO PRINCIPAL DEL REGISTRO ---
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("📩 Botón de registro presionado");

            const emailRaw = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const rol = document.getElementById('role').value;
            const curpRaw = document.getElementById('curp').value.trim();

            // 1. Validar Correo
            const emailLimpio = emailRaw.trim().toLowerCase();
            const partesEmail = emailLimpio.split('@');
            if (partesEmail.length !== 2) {
                alert("Correo inválido"); return;
            }

            // 2. Validar CURP
            if (curpRaw.length > 0 && !esCurpValida(curpRaw)) {
                alert("⚠️ CURP INVÁLIDA.\nDebe tener 18 caracteres y estructura correcta (4 letras al inicio).");
                return; 
            }

            // 3. Validar Contraseña
            if (password.length < 8) {
                alert("La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            // 4. Guardar
            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            if (usersDB.find(u => u.email === emailLimpio)) {
                alert("Este correo ya existe.");
                return;
            }

            // Construir dirección de forma segura
            let dir = "";
            if(document.getElementById('dirCalle')) {
                dir = document.getElementById('dirCalle').value + ", " + document.getElementById('dirColonia').value;
            }

            const newUser = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apPaterno').value,
                email: emailLimpio,
                password: password,
                rol: rol,
                curp: curpRaw,
                direccion: dir,
                estatusLegal: rol === 'rescatista' ? document.getElementById('estatusLegal').value : ""
            };

            usersDB.push(newUser);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));
            
            console.log("✅ Usuario creado:", newUser);
            alert("¡Cuenta creada! Inicia sesión.");
            
            // Forzar redirección
            window.location.href = "auth.html";
        });
    }

    // =======================================================
    // 3. MENÚ (Navbar)
    // =======================================================
    // (Tu código de menú aquí, no suele causar fallos críticos)
});
