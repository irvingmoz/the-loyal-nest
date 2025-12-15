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

            // Creamos el objeto con TODOS los datos que pediste
            const newUser = {
                nombre: nombre,
                apellido: apPaterno, // Puedes concatenar materno si quieres
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
                // Si es rescatista, guardamos el estatus legal, si no, vacío
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
});

// Función global para cerrar sesión (puedes usarla en tus botones de Salir)
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userSession');
    window.location.href = "index.html";
}
