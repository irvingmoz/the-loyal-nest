document.addEventListener("DOMContentLoaded", function() {
    console.log("🟢 auth.js cargado correctamente");

    // =======================================================
    // 0. FUNCIONES DE VALIDACIÓN
    // =======================================================
    function esCurpValida(curp) {
        if (!curp) return true; // Si está vacío, pasa

        // 1. Longitud exacta
        if (curp.length !== 18) return false;

        // 2. Anti-Trampas (Caracteres repetidos como 00000 o AAAAA)
        if (/^(\w)\1+$/.test(curp)) return false;

        // 3. Estructura Manual: Los primeros 4 deben ser LETRAS
        const primeros4 = curp.substring(0, 4);
        const digitosFecha = curp.substring(4, 10);
        
        // Si los primeros 4 NO son letras (A-Z) -> Falso
        if (!/^[A-Z]{4}$/.test(primeros4)) return false;
        // Si los siguientes 6 NO son números -> Falso
        if (!/^\d{6}$/.test(digitosFecha)) return false;

        return true;
    }

    // =======================================================
    // 1. LÓGICA DE REGISTRO
    // =======================================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        console.log("🔹 Formulario de Registro detectado");

        // Validaciones Visuales (Inputs)
        ['nombre', 'apPaterno', 'apMaterno'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 30);
                });
            }
        });

        const inputCurp = document.getElementById('curp');
        if (inputCurp) {
            inputCurp.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
            });
        }

        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');
        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                divRescatista.style.display = (this.value === 'rescatista') ? 'block' : 'none';
            });
        }

        // --- EVENTO SUBMIT (AQUÍ OCURRE LA MAGIA) ---
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("📩 Botón presionado");

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

            // 2. Validar CURP Estricta
            if (curpRaw.length > 0) { 
                if (!esCurpValida(curpRaw)) {
                    alert("⚠️ CURP INVÁLIDA.\n\n- No se permiten puros ceros/números.\n- Debe empezar con 4 letras.\n- Debe tener 18 caracteres.");
                    return; 
                }
            }

            // 3. Validar Contraseña
            if (password.length < 8) {
                alert("La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            // --- INICIO DE VALIDACIÓN DE TEXTO ---
        
        const calle = document.getElementById('dirCalle').value.trim();
        const colonia = document.getElementById('dirColonia').value.trim();

        // 1. REGLA: Debe contener al menos una letra (Bloquea "12345")
        const tieneLetras = /[a-zA-ZáéíóúñÑ]/;
        
        if (!tieneLetras.test(calle)) {
            alert("📍 La calle no es válida: Debe contener letras, no solo números.");
            return;
        }
        if (!tieneLetras.test(colonia)) {
            alert("📍 La colonia no es válida: Debe contener letras.");
            return;
        }

        // 2. REGLA: No puede tener letras repetidas 4 veces seguidas (Bloquea "qqqq", "aaaa")
        const letrasRepetidas = /(.)\1{3,}/;

        if (letrasRepetidas.test(calle) || letrasRepetidas.test(colonia)) {
            alert("📍 La dirección parece falsa (letras repetidas excesivamente). Escribe una dirección real.");
            return;
        }

        // 3. REGLA: Longitud mínima lógica
        if (calle.length < 5) {
            alert("📍 El nombre de la calle es muy corto.");
            return;
        }

        // --- FIN DE VALIDACIÓN ---
            // 4. Guardar Usuario
            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            
            if (usersDB.find(u => u.email === emailLimpio)) {
                alert("Este correo ya existe.");
                return;
            }

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
                estatusLegal: rol === 'rescatista' ? document.getElementById('estatusLegal').value : "",
                fechaRegistro: new Date().toLocaleDateString()
            };

            usersDB.push(newUser);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));
            
            // Iniciar sesión automáticamente
            localStorage.setItem('sesionActiva', 'true');
            localStorage.setItem('userSession', JSON.stringify(newUser));

            alert(`✅ ¡Cuenta creada! Bienvenido ${newUser.nombre}.`);
            
            // 5. REDIRECCIÓN BLINDADA
            const rolLimpio = rol.trim().toLowerCase();
            console.log("🚀 Redirigiendo a rol:", rolLimpio);

            if (rolLimpio === 'adoptante') {
                window.location.href = 'dashboard-adoptante.html';
            } 
            else if (rolLimpio === 'rescatista') {
                window.location.href = 'dashboard-rescatista.html';
            } 
            else if (rolLimpio === 'administrador') {
                window.location.href = 'dashboard-admin.html';
            } 
            else {
                alert("⚠️ Error: No sé a dónde ir con el rol: " + rolLimpio);
            }
        });
    }

    // =======================================================
    // 2. LÓGICA DE LOGIN
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
                localStorage.setItem('userSession', JSON.stringify(userFound)); 
                
                if (userFound.rol === 'rescatista') window.location.href = "dashboard-rescatista.html";
                else if (userFound.rol === 'administrador') window.location.href = "dashboard-admin.html";
                else window.location.href = "dashboard-adoptante.html"; 
            } else {
                alert("Datos incorrectos.");
            }
        });
    }
});
