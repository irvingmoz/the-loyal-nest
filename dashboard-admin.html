<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administración | The Loyal Nest</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        .admin-container { max-width: 1200px; margin: 40px auto; padding: 20px; }
        .stat-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 20px; text-align: center; }
        .stat-icon { font-size: 2.5rem; display: block; margin-bottom: 10px; }
        .stat-num { font-size: 2rem; font-weight: bold; color: #e67e22; }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <a href="index.html" class="logo">🐕 Admin Panel</a>
            <button onclick="cerrarSesion()" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;">Salir</button>
        </nav>
    </header>

    <main class="admin-container">
        <h1>👋 Bienvenido, Administrador</h1>
        <p>Aquí tienes el control total del sistema.</p>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px;">
            <div class="stat-card">
                <span class="stat-icon">👥</span>
                <div class="stat-num" id="countUsers">0</div>
                <div>Usuarios Registrados</div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🐾</span>
                <div class="stat-num" id="countPets">0</div>
                <div>Mascotas en Sistema</div>
            </div>
            <div class="stat-card">
                <span class="stat-icon">📝</span>
                <div class="stat-num">0</div>
                <div>Reportes</div>
            </div>
        </div>
    </main>

    <script>
        // Verificar sesión al cargar
        const session = JSON.parse(localStorage.getItem('userSession'));
        if (!session || session.rol !== 'administrador') {
            alert("⛔ Acceso denegado.");
            window.location.href = "index.html";
        }

        // Cargar contadores
        const users = JSON.parse(localStorage.getItem('usersDB')) || [];
        const pets = JSON.parse(localStorage.getItem('petsDB')) || [];
        document.getElementById('countUsers').innerText = users.length;
        document.getElementById('countPets').innerText = pets.length;

        function cerrarSesion() {
            localStorage.clear();
            window.location.href = "index.html";
        }
    </script>
</body>
</html>
