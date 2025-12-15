document.addEventListener("DOMContentLoaded", function() {

    // =======================================================
    // 1. LÓGICA DE LOGIN (Para auth.html)
    // =======================================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailVal = document.getElementById('email').value;
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
                    window.location.href = "index.html"; 
                }
            } else {
                alert("Datos incorrectos o usuario no registrado.");
            }
        });
    }

    // =======================================================
    // 2. LÓGICA DE REGISTRO (Para register.html)
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

            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const rol = document.getElementById('role').value;

            const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
            if (usersDB.find(u => u.email === email)) {
                alert("Este correo ya existe.");
                return;
            }

            const newUser = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apPaterno').value,
                email: email,
                password: password,
                rol: rol,
                edad: document.getElementById('edad').value,
                curp: document.getElementById('curp').value,
                direccion: {
                    calle: document.getElementById('dirCalle').value,
                    colonia: document.getElementById('dirColonia').value,
                    alcaldia: document.getElementById('dirAlcaldia').value,
                    cp: document.getElementById('dirCP').value
                },
                estatusLegal: rol === 'rescatista' ? document.getElementById('estatusLegal').value : "",
                fechaRegistro: new Date().toLocaleDateString()
            };

            usersDB.push(newUser);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));

            alert("¡Cuenta creada! Inicia sesión ahora.");
            window.location.href = "auth.html";
        });
    }

    // =======================================================
    // 3. CONTROL DEL MENÚ (OCULTAR BOTONES SI HAY SESIÓN) - NUEVO
    // =======================================================
    // Esto revisa si ya entraste para limpiar el menú
    const sesionActiva = localStorage.getItem('sesionActiva');
    const rutaActual = window.location.pathname;

    if (sesionActiva === 'true') {
        // A) Si ya hay sesión, buscamos el botón de "Iniciar Sesión" y lo ocultamos
        const botonesMenu = document.querySelectorAll('a, button'); // Buscamos en todos los enlaces y botones
        
        botonesMenu.forEach(btn => {
            // Si el texto del botón dice "Iniciar Sesión" o "Registrarse"... ¡ADIÓS!
            if (btn.innerText.includes('Iniciar Sesión') || btn.innerText.includes('Registrarse')) {
                btn.style.display = 'none';
            }
        });

        // B) Opcional: Agregar botón de "Cerrar Sesión" al menú si no existe
        const nav = document.querySelector('.nav');
        if (nav && !document.getElementById('btn-logout-auto')) {
            const btnLogout = document.createElement('button');
            btnLogout.id = 'btn-logout-auto';
            btnLogout.innerText = "Cerrar Sesión";
            btnLogout.className = "btn-outline"; // Usamos tu clase de estilo
            btnLogout.style.marginLeft = "10px";
            btnLogout.style.color = "red";
            btnLogout.style.borderColor = "red";
            btnLogout.onclick = cerrarSesion;
            nav.appendChild(btnLogout);
        }

    } else {
        // C) PROTECCIÓN: Si NO hay sesión y estás en páginas privadas, ¡FUERA!
        if (rutaActual.includes('shelters-map') || rutaActual.includes('education') || rutaActual.includes('dashboard')) {
            // Evitamos el bucle infinito si ya estamos en auth
            if (!rutaActual.includes('auth.html')) {
                alert("Debes iniciar sesión para ver esta sección.");
                window.location.href = "auth.html";
            }
        }
    }

});

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userSession');
    window.location.href = "index.html";
}
