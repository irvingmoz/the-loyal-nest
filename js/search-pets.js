<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscar mascotas | The Loyal Nest</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="header">
    <nav class="nav">
        <a href="index.html" class="logo">🐕 The Loyal Nest</a>
        <ul class="nav-links">
            <li><a href="education.html">Recursos</a></li>
            <li id="nav-login"><a href="auth.html">Iniciar Sesión</a></li>
            <li id="nav-user" class="nav-user" style="display:none; gap:8px; align-items:center;">
                <span class="nav-user-name">Mi Cuenta</span>
                <button class="btn-outline" onclick="cerrarSesion()">Salir</button>
            </li>
        </ul>
    </nav>
</header>

<main class="container" style="margin-top:110px; max-width:1200px;">
    
    <section class="hero hero--muted">
        <div class="hero__content">
            <p class="muted">Buscar mascotas</p>
            <h1>Adopta con confianza y enamórate del catálogo</h1>
            <p class="muted">Explora perros y gatos listos para un hogar. Filtra por especie, raza o tamaño y envía tu solicitud sin salir de esta página.</p>
            
            <div class="hero__actions">
                <a href="#catalogPanel" class="btn-primary" style="text-decoration: none; display: inline-block; text-align: center;">
                    Ver catálogo
                </a>
                <a href="#adminPanel" class="btn-outline" style="text-decoration: none; display: inline-block; text-align: center;">
                    Panel administrador
                </a>
            </div>
        </div>

        <div class="hero__media">
            <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                 alt="Perro listo para adopción" 
                 class="hero__image"
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; min-height: 300px;">
        </div>
    </section>

    <section class="panel" id="catalogPanel">
        <header class="panel__header panel__header--stacked">
            <div>
                <p class="muted">Catálogo</p>
                <h2>Mira a todos los candidatos</h2>
            </div>
            <div class="pill-group" id="speciesFilters">
                <button class="pill pill--active" data-species="">Todos</button>
                <button class="pill" data-species="perro">Perros</button>
                <button class="pill" data-species="gato">Gatos</button>
            </div>
        </header>

        <div class="filters-grid">
            <label class="filter">
                <span>Raza</span>
                <select id="filterBreed"></select>
            </label>
            <label class="filter">
                <span>Tamaño</span>
                <select id="filterSize">
                    <option value="">Cualquiera</option>
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                </select>
            </label>
            <label class="filter filter--wide">
                <span>Busca por nombre o personalidad</span>
                <input type="search" id="filterSearch" placeholder="Ej. juguetón, tranquilo, Bruno">
            </label>
        </div>

        <div id="searchResults" class="cards-grid cards-grid--pets"></div>
    </section>

    <section class="panel" id="adminPanel">
        <header class="panel__header panel__header--stacked">
            <div>
                <p class="muted">Panel administrador</p>
                <h2>Solicitudes de adopción</h2>
                <p class="muted">Aquí puedes revisar las solicitudes capturadas en esta página y decidir si aprobar o rechazar.</p>
            </div>
        </header>
        <div id="requestEmpty" class="muted" style="margin:16px 0;">No hay solicitudes todavía.</div>
        <div class="table" id="requestsTable" style="display:none;">
            <div class="table__header">
                <span>Persona</span>
                <span>Mascota</span>
                <span>Mensaje</span>
                <span>Estado</span>
                <span>Acciones</span>
            </div>
            <div class="table__body" id="requestsBody"></div>
        </div>
    </section>

    <section class="drawer" id="adoptionDrawer" aria-hidden="true">
        <div class="drawer__content">
            <div class="drawer__header">
                <div>
                    <p class="muted">Solicitud de adopción</p>
                    <h3 id="drawerPetName"></h3>
                    <p class="muted" id="drawerPetMeta"></p>
                </div>
                <button class="btn-icon" id="closeDrawer" aria-label="Cerrar">✕</button>
            </div>
            <form id="adoptionForm" class="form-grid form-grid--stacked">
                <label>Tu nombre<input required name="applicant" placeholder="Nombre completo"></label>
                <label>Correo electrónico<input required name="email" type="email" placeholder="tucorreo@email.com"></label>
                <label>Mensaje para el refugio<textarea required name="message" rows="4" placeholder="Cuéntanos sobre tu hogar y por qué quieres adoptarlo"></textarea></label>
                <div class="form-actions">
                    <button type="button" class="btn-outline" id="cancelDrawer">Cancelar</button>
                    <button class="btn-primary" type="submit">Enviar solicitud</button>
                </div>
            </form>
        </div>
    </section>
</main>

<script src="js/auth.js"></script>
<script src="js/search-pets.js"></script>
</body>
</html>
