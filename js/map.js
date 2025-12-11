// js/map.js - VERSIÓN CORREGIDA

// 1. Variables Globales
let map;
let userLocation = null;
let markers = [];
let userMarker = null;
let isSatelliteView = false;

// 2. Datos de Refugios (Base de Datos)
const shelters = [
    {
        id: 1,
        name: "Refugio Esperanza",
        lat: 19.3575, lng: -99.0671,
        address: "Av. Central 123, Iztapalapa",
        rating: 4.8, reviewCount: 124, distance: 1.2,
        pets: 24, species: ["perro", "gato"],
        services: ["adopcion", "esterilizacion", "vacunacion"],
        description: "Refugio dedicado al rescate y cuidado de perros y gatos.",
        hours: "9:00 AM - 6:00 PM",
        email: "contacto@refugioesperanza.mx", website: "https://refugioesperanza.mx"
    },
    {
        id: 2,
        name: "Casa Gatuna",
        lat: 19.3456, lng: -99.0789,
        address: "Calle Felina 456, Iztapalapa",
        rating: 4.5, reviewCount: 89, distance: 2.8,
        pets: 15, species: ["gato"],
        services: ["adopcion", "esterilizacion"],
        description: "Especializados en gatos.",
        hours: "10:00 AM - 5:00 PM",
        email: "hola@casagatuna.org", website: null
    },
    {
        id: 3,
        name: "Patitas Salvadas",
        lat: 19.3312, lng: -99.0915,
        address: "Plaza Animal 789, Iztapalapa",
        rating: 4.9, reviewCount: 203, distance: 4.2,
        pets: 42, species: ["perro", "gato"],
        services: ["adopcion", "vacunacion", "urgencias"],
        description: "Rescate y adopción responsable.",
        hours: "8:00 AM - 7:00 PM",
        email: "info@patitassalvadas.org", website: "https://patitassalvadas.org"
    },
    {
        id: 4,
        name: "Hogar Canino",
        lat: 19.3689, lng: -99.0543,
        address: "Boulevard Can 321, Iztapalapa",
        rating: 4.6, reviewCount: 167, distance: 3.5,
        pets: 31, species: ["perro"],
        services: ["adopcion", "entrenamiento"],
        description: "Rehabilitación canina.",
        hours: "9:00 AM - 6:00 PM",
        email: "adopciones@hogarcanino.mx", website: null
    },
    {
        id: 5,
        name: "Amigos Peludos",
        lat: 19.3521, lng: -99.0456,
        address: "Jardín Animal 654, Iztapalapa",
        rating: 4.7, reviewCount: 95, distance: 5.1,
        pets: 28, species: ["perro", "gato"],
        services: ["adopcion", "vacunacion"],
        description: "Comunidad de voluntarios.",
        hours: "10:00 AM - 4:00 PM",
        email: "voluntarios@amigospeludos.org", website: "https://amigospeludos.org"
    }
];

// 3. Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    // Cargar datos iniciales
    displayShelters(shelters);
    updateSheltersCount(shelters.length);
    setupEventListeners();
});

function initializeMap() {
    // Coordenadas de Iztapalapa
    const iztapalapaCoords = [19.3575, -99.0671];
    
    // Crear mapa
    map = L.map('sheltersMap').setView(iztapalapaCoords, 13);

    // Capa visual
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    L.control.scale().addTo(map);

    // FIX VITAL: Forzar tamaño después de cargar
    setTimeout(function(){ 
        map.invalidateSize(); 
    }, 500);
}

// 4. Lógica de Visualización (Marcadores y Lista)
function displayShelters(sheltersToShow) {
    // Limpiar marcadores viejos
    clearMarkers();

    // Agregar nuevos
    sheltersToShow.forEach(shelter => {
        const marker = L.marker([shelter.lat, shelter.lng])
            .addTo(map)
            .bindPopup(createShelterPopup(shelter));
            
        // Evento click en marcador
        marker.on('click', () => {
            selectShelterCard(shelter.id);
        });

        markers.push({ id: shelter.id, marker: marker });
    });

    // Actualizar lista lateral
    const listContainer = document.getElementById('sheltersList');
    if(listContainer) {
        listContainer.innerHTML = '';
        if (sheltersToShow.length === 0) {
            listContainer.innerHTML = '<div style="padding:20px; text-align:center;">No hay resultados 😔</div>';
            return;
        }

        sheltersToShow.forEach(shelter => {
            const card = document.createElement('div');
            card.className = 'shelter-card';
            card.setAttribute('data-id', shelter.id);
            card.onclick = () => focusOnShelter(shelter.id);
            
            card.innerHTML = `
                <div class="shelter-header">
                    <span class="shelter-name">${shelter.name}</span>
                    <span class="shelter-rating">⭐ ${shelter.rating}</span>
                </div>
                <div class="shelter-meta">
                    <span>📍 ${shelter.distance} km</span>
                    <span>🐾 ${shelter.pets} mascotas</span>
                </div>
                <div class="shelter-services" style="margin-top:5px; font-size:0.8rem; color:#666;">
                    ${shelter.species.join(', ')}
                </div>
                <div class="shelter-actions">
                    <button class="btn-primary btn-small" onclick="viewShelterDetails(${shelter.id})">Ver</button>
                    <button class="btn-outline btn-small" onclick="getDirections(${shelter.id})">Ir</button>
                </div>
            `;
            listContainer.appendChild(card);
        });
    }
}

function createShelterPopup(shelter) {
    return `
        <div style="text-align:center">
            <b>${shelter.name}</b><br>
            ⭐ ${shelter.rating}<br>
            ${shelter.hours}
        </div>
    `;
}

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m.marker));
    markers = [];
}

// 5. Interacción Mapa <-> Lista
function focusOnShelter(id) {
    const target = shelters.find(s => s.id === id);
    if(target) {
        map.setView([target.lat, target.lng], 15);
        const markerObj = markers.find(m => m.id === id);
        if(markerObj) markerObj.marker.openPopup();
        
        // Resaltar tarjeta
        document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('active'));
        const card = document.querySelector(`.shelter-card[data-id="${id}"]`);
        if(card) card.classList.add('active');
    }
}

function selectShelterCard(id) {
    // Scroll a la tarjeta en la lista
    const card = document.querySelector(`.shelter-card[data-id="${id}"]`);
    if(card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.click(); // Activa el estilo active
    }
}

// 6. Filtros
function filterShelters() {
    const distMax = parseInt(document.getElementById('distanceFilter').value);
    // Obtener checkboxes
    const checkedSpecies = Array.from(document.querySelectorAll('input[name="species"]:checked')).map(cb => cb.value);

    const filtered = shelters.filter(s => {
        const passDist = s.distance <= distMax;
        const passSpecies = s.species.some(sp => checkedSpecies.includes(sp));
        return passDist && passSpecies;
    });

    displayShelters(filtered);
    updateSheltersCount(filtered.length);
}

function updateSheltersCount(n) {
    const el = document.getElementById('sheltersCount');
    if(el) el.innerText = n;
}

function setupEventListeners() {
    // Si quieres agregar listeners extra aquí
}

// 7. Utilidades Extra
function getDirections(id) {
    const s = shelters.find(x => x.id === id);
    if(s) window.open(`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`);
}

function viewShelterDetails(id) {
    alert("Aquí se abriría el modal con detalles del refugio ID: " + id);
    // Aquí puedes llamar a tu openModal('shelterModal') si tienes el HTML
}

function clearFilters() {
    document.getElementById('distanceFilter').value = 10;
    document.querySelectorAll('input[name="species"]').forEach(c => c.checked = true);
    filterShelters();
}

function locateUser() {
    if(!navigator.geolocation) {
        alert("Geolocalización no soportada");
        return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
        const {latitude, longitude} = pos.coords;
        map.setView([latitude, longitude], 14);
        L.marker([latitude, longitude]).addTo(map).bindPopup("Estás aquí").openPopup();
    }, () => alert("No pudimos obtener tu ubicación"));
}

// FIX FINAL: Asegurar renderizado al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    if(map) map.invalidateSize();
});
