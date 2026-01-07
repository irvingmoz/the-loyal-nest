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
                const txt = texto.toLowerCase();

                // A. Longitud mínima
                if (txt.length < 2) return `El ${campo} es muy corto.`;

                // B. Debe tener vocales
                const tieneVocales = /[aeiouáéíóúü]/;
                if (!tieneVocales.test(txt)) return `El ${campo} no parece real (le faltan vocales).`;

                // C. No letras repetidas seguidas (Anti "aa", "bbb")
                // Permite "ll" (Lluvia) o "rr" (Perro) o "nn" (Anna), pero no "aa", "ee", "ii"
                // Esta Regex busca vocales repetidas o más de 2 consonantes iguales
                if (/([aeiouáéíóú])\1/.test(txt)) return `El ${campo} tiene vocales repetidas (ej. 'aa').`;
                if (/([^aeiouáéíóúlrn])\1/.test(txt)) return `El ${campo} tiene caracteres repetidos inválidos.`;
                if (/(.)\1{2,}/.test(txt)) return `El ${campo} tiene demasiadas letras repetidas.`;

                // D. No exceso de consonantes
                const excesoConsonantes = /[bcdfghjklmnñpqrstvwxyz]{4,}/;
                if (excesoConsonantes.test(txt)) return `El ${campo} parece un error de teclado.`;

                // --- REGLAS NUEVAS PARA EVITAR "aq", "qx", etc. ---

                // E. Regla de la Q (Debe ir seguida de u)
                // Bloquea: "aq", "qat", "qeso"
                if (txt.includes('q') && !txt.includes('qu')) {
                    return `El ${campo} está mal escrito (la 'q' debe ir seguida de 'u').`;
                }

                // F. Regla Estricta para 2 Letras
                // Si son solo 2 letras, la segunda NO puede ser una consonante rara final.
                // Permitidos finales: Vocales, n, l, r, s, z, x, y (ej: Al, Bo, Ty, Oz, Ax)
                // Bloqueados finales: q, w, t, p, d, f, g, h, j, k, c, v, b, m
                if (txt.length === 2) {
                    const letraFinal = txt[1];
                    const finalesValidos = /[aeiouáéíóúynlrszx]/;
                    if (!finalesValidos.test(letraFinal)) {
                        return `El ${campo} de dos letras parece incompleto o inválido (ej. '${texto}').`;
                    }
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

// =======================================================
            // 🛡️ BLOQUE ANTI-RANDOM (Direcciones)
            // =======================================================
            const calleCheck = document.getElementById('dirCalle').value.trim();
            const coloniaCheck = document.getElementById('dirColonia').value.trim();

            // 1. Regla de Oro: ¿Tiene letras? (Bloquea "12345")
            const tieneLetras = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/;
            if (!tieneLetras.test(calleCheck)) {
                alert("📍 La calle debe tener nombre, no solo números."); return;
            }
            if (!tieneLetras.test(coloniaCheck)) {
                alert("📍 La colonia debe tener nombre, no solo números."); return;
            }

            // 2. Regla Anti-Flojera: ¿Es todo la misma letra? (Bloquea "aaaaa", "zzzz")
            // Esta es la que te faltaba
            if (/^(\w)\1+$/.test(calleCheck)) {
                alert("📍 La calle no es válida (no repitas la misma letra)."); return;
            }
            if (/^(\w)\1+$/.test(coloniaCheck)) {
                alert("📍 La colonia no es válida (no repitas la misma letra)."); return;
            }

            // 3. Regla Anti-Teclazo: ¿Tiene vocales? (Bloquea "sdfgh")
            const tieneVocales = /[aeiouáéíóúü]/i;
            if (!tieneVocales.test(calleCheck) || !tieneVocales.test(coloniaCheck)) {
                alert("📍 La dirección parece falsa (le faltan vocales)."); return;
            }

            // 4. Regla de Repetición Interna (Bloquea "Caaalle" o "Reeforma")
            // No permite 3 letras iguales seguidas
            const repetidas = /(.)\1{2,}/;
            if (repetidas.test(calleCheck) || repetidas.test(coloniaCheck)) {
                alert("📍 La dirección tiene demasiadas letras repetidas (ej. 'aaa')."); return;
            }
            
            // 5. Longitud Mínima
            if (calleCheck.length < 4 || coloniaCheck.length < 4) {
                alert("📍 La dirección es muy corta, sé más específico."); return;
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
