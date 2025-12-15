document.addEventListener("DOMContentLoaded", function() {

    // =======================================================
    // 1. LÓGICA DE LOGIN (Para auth.html)
    // =======================================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // En el Login tus IDs son 'email' y 'password'
            const emailVal = document.getElementById('email').value;
            const passVal = document.getElementById('password').value;

            // Simulamos buscar al usuario en la base de datos local
            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            const userFound = usersDB.find(u => u.email === emailVal && u.password === passVal);

            if (userFound) {
                // Login Exitoso
                localStorage.setItem('sesionActiva', 'true');
                localStorage.setItem('usuario', userFound.email);
                localStorage.setItem('userSession', JSON.stringify(userFound)); // Guardamos todos sus datos
                
                alert(`¡Bienvenido de nuevo, ${userFound.nombre}!`);

                // Redireccionar según el rol
                if (userFound.rol === 'rescatista') {
                    window.location.href = "dashboard-rescatista.html";
                } else {
                    window.location.href = "index.html"; // O dashboard-adoptante.html
                }
            } else {
                alert("Correo o contraseña incorrectos, o el usuario no existe.");
            }
        });
    }

    // =======================================================
    // 2. LÓGICA DE REGISTRO (Para register.html)
    // =======================================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        
        // A) Lógica visual: Mostrar campos de refugio si elige "Rescatista"
        const roleSelect = document.getElementById('role');
        const divRescatista = document.getElementById('camposRescatista');

        if(roleSelect && divRescatista) {
            roleSelect.addEventListener('change', function() {
                if (this.value === 'rescatista') {
                    divRescatista.style.display = 'block';
                } else {
                    divRescatista.style.display = 'none';
                }
            });
        }

        // B) Lógica de Guardado
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtenemos los valores usando los IDs correctos de tu HTML
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const nombre = document.getElementById('nombre').value;
            const apPaterno = document.getElementById('apPaterno').value;
            const rol = document.getElementById('role').value;

            // Validar que no exista ya ese correo
            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            const existe = usersDB.find(u => u.email === email);

            if (existe) {
                alert("Este correo ya está registrado. Por favor inicia sesión.");
                return;
            }

            // Creamos el objeto con TODOS los datos
            const newUser = {
                nombre: nombre,
                apellido: apPaterno,
                email: email,
                password: password,
                rol: rol,
                edad: document.getElementById('edad').value,
                curp: document.getElementById('curp').value,
                direccion: {
                    calle: document.getElementById('dirCalle').value,
                    numExt: document.getElementById('dirNumExt').value,
                    colonia: document.getElementById('dirColonia').value,
                    alcaldia: document.getElementById('dirAlcaldia').value,
                    cp: document.getElementById('dirCP').value
                },
                estatusLegal: rol === 'rescatista' ? document.getElementById('estatusLegal').value : "",
                fechaRegistro: new Date().toLocaleDateString()
            };

            // Guardar en localStorage
            usersDB.push(newUser);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));

            alert("¡Cuenta creada con éxito! Ahora serás redirigido al inicio de sesión.");
            window.location.href = "auth.html";
        });
    }

    // =======================================================
    // 3. VALIDACIÓN INTELIGENTE DE DIRECCIÓN (CDMX) - NUEVO
    // =======================================================
    const inputCP = document.getElementById('dirCP');
    const selectAlcaldia = document.getElementById('dirAlcaldia');

    if (inputCP && selectAlcaldia) {
        
        // A) Cuando escriben el CP, detectamos la zona
        inputCP.addEventListener('input', function() {
            const cp = this.value;
            
            // Solo actuamos si ya escribieron 5 números
            if (cp.length === 5) {
                const primerosDos = cp.substring(0, 2);
                let alcaldiaDetectada = "";

                // Mapeo básico de CDMX
                if (primerosDos === "09") alcaldiaDetectada = "Iztapalapa";
                else if (primerosDos === "08") alcaldiaDetectada = "Iztacalco";
                else if (primerosDos === "04") alcaldiaDetectada = "Coyoacán";
                else if (primerosDos === "13") alcaldiaDetectada = "Tláhuac";
                
                // Si detectamos una alcaldía conocida, la seleccionamos
                if (alcaldiaDetectada) {
                    selectAlcaldia.value = alcaldiaDetectada;
                    // Efecto visual (borde naranja un segundo)
                    selectAlcaldia.style.borderColor = "#e67e22"; 
                    setTimeout(() => selectAlcaldia.style.borderColor = "#ddd", 1000);
                }
            }
        });

        // B) Candado: Evitar que cambien la alcaldía si no coincide con el CP
        selectAlcaldia.addEventListener('change', function() {
            const cp = inputCP.value;
            const alcaldiaSeleccionada = this.value;

            if (cp.length === 5) {
                const primerosDos = cp.substring(0, 2);
                
                // Validación Iztapalapa
                if (primerosDos === "09" && alcaldiaSeleccionada !== "Iztapalapa") {
                    alert("El Código Postal " + cp + " pertenece a Iztapalapa. No puedes seleccionar otra alcaldía.");
                    this.value = "Iztapalapa"; // Lo regresamos a la correcta
                }
                // Validación Iztacalco
                else if (primerosDos === "08" && alcaldiaSeleccionada !== "Iztacalco") {
                    alert("El Código Postal " + cp + " pertenece a Iztacalco.");
                    this.value = "Iztacalco";
                }
                // Validación Coyoacán
                else if (primerosDos === "04" && alcaldiaSeleccionada !== "Coyoacán") {
                    alert("El Código Postal " + cp + " pertenece a Coyoacán.");
                    this.value = "Coyoacán";
                }
                 // Validación Tláhuac
                 else if (primerosDos === "13" && alcaldiaSeleccionada !== "Tláhuac") {
                    alert("El Código Postal " + cp + " pertenece a Tláhuac.");
                    this.value = "Tláhuac";
                }
            }
        });
    }

}); // Fin del DOMContentLoaded

// Función global para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userSession');
    window.location.href = "index.html";
}
