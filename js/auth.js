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
// =======================================================
            // 🛡️ BLOQUE ANTI-RANDOM (Nombres y Apellidos)
            // =======================================================
            
            // 1. Capturamos los datos ahora mismo
            const nombreTxt = document.getElementById('nombre').value.trim();
            const apPatTxt = document.getElementById('apPaterno').value.trim();
            const apMatTxt = document.getElementById('apMaterno').value.trim();

            // 2. Función interna para detectar "teclazos"
            function esTextoHumano(texto, campo) {
                // A. Longitud mínima (evita "a", "z")
                if (texto.length < 2) return `El ${campo} es muy corto.`;

                // B. Debe tener vocales (evita "sdfgh", "klmn", "brrr")
                const tieneVocales = /[aeiouáéíóúü]/i;
                if (!tieneVocales.test(texto)) return `El ${campo} no parece real (le faltan vocales).`;

                // C. No letras repetidas 3 veces seguidas (evita "aaa", "jjjj")
                const repetidas = /(.)\1{2,}/; 
                if (repetidas.test(texto)) return `El ${campo} tiene letras repetidas inválidas (ej. 'aaa').`;

                // D. No exceso de consonantes seguidas (evita "asdfg")
                const excesoConsonantes = /[bcdfghjklmnñpqrstvwxyz]{4,}/i;
                if (excesoConsonantes.test(texto)) return `El ${campo} parece un error de teclado (muchas consonantes).`;
                // E. Anti-Flojera (Bloquea si TODA la palabra es la misma letra repetida)
                // Bloquea: "aa", "bb", "zz", "aaaa"
                // Permite: "Aaron" (porque tiene 'r'), "Isaac" (porque tiene 's')
                if (/^(\w)\1+$/.test(texto)) {
                    return `El ${campo} no es válido (no pongas la misma letra repetida).`;
                }

                return null; // Pasó todas las pruebas
            }

            // 3. Ejecutamos la validación
            const errNom = esTextoHumano(nombreTxt, "Nombre");
            if (errNom) { alert("⚠️ " + errNom); return; }

            const errPat = esTextoHumano(apPatTxt, "Apellido Paterno");
            if (errPat) { alert("⚠️ " + errPat); return; }

            const errMat = esTextoHumano(apMatTxt, "Apellido Materno");
            if (errMat) { alert("⚠️ " + errMat); return; }
            
            // =======================================================
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

// --- BLOQUE DE VALIDACIÓN ANTI-RANDOM (NUEVO) ---
        
        const calleCheck = document.getElementById('dirCalle').value.trim();
        const coloniaCheck = document.getElementById('dirColonia').value.trim();

        // 1. Filtro: Debe tener vocales (a,e,i,o,u)
        // Nadie vive en "bcdfgh"
        const tieneVocales = /[aeiouáéíóú]/i; 
        
        if (!tieneVocales.test(calleCheck)) {
            alert("📍 La calle parece falsa: No tiene vocales.");
            return;
        }
        if (!tieneVocales.test(coloniaCheck)) {
            alert("📍 La colonia parece falsa: No tiene vocales.");
            return;
        }

        // 2. Filtro: Exceso de consonantes seguidas
        // Bloquea cosas como "asdfgh" o "qwrtyp" (5 consonantes juntas)
        const excesoConsonantes = /[bcdfghjklmnñpqrstvwxyz]{5,}/i;

        if (excesoConsonantes.test(calleCheck)) {
            alert("📍 La calle no se ve real (demasiadas consonantes seguidas).");
            return;
        }

        // 3. Filtro: Longitud mínima lógica
        if (calleCheck.length < 5) {
            alert("📍 El nombre de la calle es muy corto.");
            return;
        }

        // 4. Filtro: Letras repetidas (Anti "aaaaa")
        const letrasRepetidas = /(.)\1{3,}/;
        if (letrasRepetidas.test(calleCheck)) {
            alert("📍 No escribas letras repetidas (ej. aaaa).");
            return;
        }

        // --- FIN DEL BLOQUE ---
            
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
