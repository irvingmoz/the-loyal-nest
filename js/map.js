// js/map.js - CORREGIDO Y FUNCIONAL

let map;
let markers = [];
let userLocation = null;

// Base de datos de refugios
const shelters = [
    {
        id: 1, name: "Refugio Esperanza", lat: 19.3575, lng: -99.0671,
        address: "Av. Central 123, Iztapalapa", rating: 4.8, reviewCount: 124, distance: 1.2,
        pets: 24, species: ["perro", "gato"], services: ["adopcion", "esterilizacion", "vacunacion"],
        hours: "9:00 AM - 6:00 PM"
    },
    {
        id: 2, name: "Casa Gatuna", lat: 19.3456, lng: -99.0789,
        address: "Calle Felina 456, Iztapalapa", rating: 4.5, reviewCount: 89, distance: 2.8,
        pets: 15, species: ["gato"], services: ["adopcion", "esterilizacion"],
        hours: "10:00 AM - 5:00 PM"
    },
    {
        id: 3, name: "Patitas Salvadas", lat: 19.3312, lng: -99.0915,
        address: "Plaza Animal 789, Iztapalapa", rating: 4.9, reviewCount: 203, distance: 4.2,
        pets: 42, species: ["perro", "gato"], services: ["adopcion", "vacunacion", "urgencias"],
        hours: "8:00 AM - 7:00 PM"
    },
    {
        id: 4, name: "Hogar Canino", lat: 19.3689, lng: -99.0543,
        address: "Boulevard Can 321, Iztapalapa", rating: 4.6, reviewCount: 167, distance: 3.5,
        pets: 31, species: ["perro"], services: ["adopcion", "entrenamiento"],
        hours: "9:00 AM - 6:00 PM"
    },
    {
        id: 5, name: "Amigos Peludos", lat: 19.3521, lng: -99.0456,
        address: "Jardín Animal 654, Iztapalapa", rating: 4.7, reviewCount: 95, distance: 5.1,
        pets: 28, species: ["perro", "gato"], services: ["adopcion", "vacunacion"],
        hours: "10:00 AM - 4:00 PM"
    }
];

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    filterShelters(); // Carga inicial de datos
});

function initializeMap() {
    // Coordenadas Iztapalapa
    const iztapalapaCoords = [19.3575, -99.0671];
    
    map = L.map('sheltersMap').setView(iztapalapaCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    L.control.scale().addTo(map);

    // FIX CRÍTICO: Forzar tamaño para evitar mapa gris
    setTimeout(() => { map.invalidateSize(); }, 500);
}

// Mostrar marcadores y lista
function displayShelters(data) {
    // Limpiar marcadores previos
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const list = document.getElementById('sheltersList');
    list.innerHTML = '';

    if(data.length === 0) {
        list.innerHTML = '<div style="padding:20px; text-align:center">No hay resultados</div>';
        return;
    }

    data.forEach(shelter => {
        // 1. Crear Marcador
        const marker = L.marker([shelter.lat, shelter.lng])
            .addTo(map)
            .bindPopup(`<b>${shelter.name}</b><br>${shelter.hours}`);
        
        // Evento clic en marcador
        marker.on('click', () => {
            document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('active'));
            const card = document.getElementById(`card-${shelter.id}`);
            if(card) {
                card.classList.add('active');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        markers.push(marker);

        // 2. Crear Tarjeta en Lista
        const card = document.createElement('div');
        card.className = 'shelter-card';
        card.id = `card-${shelter.id}`;
        card.onclick = () => {
            map.setView([shelter.lat, shelter.lng], 15);
            marker.openPopup();
            document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };

        card.innerHTML = `
            <span class="shelter-name">${shelter.name}</span>
            <div class="shelter-meta">
                <span>⭐ ${shelter.rating}</span>
                <span>📍 ${shelter.distance} km</span>
            </div>
            <div style="font-size:0.8rem; color:#666; margin-top:5px;">
                ${shelter.services.join(', ')}
            </div>
            <div class="shelter-actions">
                <button class="btn-small primary">Ver Detalles</button>
                <button class="btn-small" onclick="window.open('https://maps.google.com/?q=${shelter.lat},${shelter.lng}')">Ir</button>
            </div>
        `;
        list.appendChild(card);
    });
}

// Lógica de Filtrado
function filterShelters() {
    const maxDist = parseInt(document.getElementById('distanceFilter').value);
    const minRating = parseFloat(document.getElementById('ratingFilter').value);
    
    // Obtener checkboxes marcados
    const checkedSpecies = Array.from(document.querySelectorAll('input[name="species"]:checked')).map(cb => cb.value);
    const checkedServices = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);

    const filtered = shelters.filter(s => {
        const distOk = s.distance <= maxDist;
        const ratingOk = s.rating >= minRating;
        const speciesOk = checkedSpecies.length === 0 || s.species.some(sp => checkedSpecies.includes(sp));
        const servicesOk = checkedServices.length === 0 || s.services.some(srv => checkedServices.includes(srv));

        return distOk && ratingOk && speciesOk && servicesOk;
    });

    displayShelters(filtered);
    document.getElementById('sheltersCount').innerText = filtered.length;
}

function clearFilters() {
    document.getElementById('distanceFilter').value = 10;
    document.getElementById('ratingFilter').value = 3;
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    filterShelters();
}

function locateUser() {
    if(!navigator.geolocation) return alert("No soportado");
    navigator.geolocation.getCurrentPosition(pos => {
        const {latitude, longitude} = pos.coords;
        map.setView([latitude, longitude], 14);
        L.marker([latitude, longitude]).addTo(map).bindPopup("Tú").openPopup();
    });
}

// Re-calcular tamaño al cambiar ventana
window.addEventListener('resize', () => { if(map) map.invalidateSize(); });
