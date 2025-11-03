// Map System JavaScript
let map;
let userLocation = null;
let shelters = [];
let markers = [];
let userMarker = null;
let isSatelliteView = false;

// Datos de ejemplo de refugios en Iztapalapa y CDMX
const sampleShelters = [
    {
        id: 1,
        name: "Refugio Esperanza",
        lat: 19.3575,
        lng: -99.0671,
        address: "Av. Central 123, Iztapalapa, CDMX",
        phone: "55-1234-5678",
        email: "contacto@refugioesperanza.mx",
        rating: 4.8,
        reviewCount: 124,
        distance: 1.2,
        pets: 24,
        species: ["perro", "gato"],
        services: ["adopcion", "esterilizacion", "vacunacion"],
        description: "Refugio dedicado al rescate y cuidado de perros y gatos en situación de calle. Contamos con instalaciones adecuadas y personal capacitado.",
        hours: "Lunes a Domingo: 9:00 AM - 6:00 PM",
        website: "https://refugioesperanza.mx"
    },
    {
        id: 2,
        name: "Casa Gatuna",
        lat: 19.3456,
        lng: -99.0789,
        address: "Calle Felina 456, Iztapalapa, CDMX",
        phone: "55-2345-6789",
        email: "hola@casagatuna.org",
        rating: 4.5,
        reviewCount: 89,
        distance: 2.8,
        pets: 15,
        species: ["gato"],
        services: ["adopcion", "esterilizacion", "vacunacion", "urgencias"],
        description: "Especializados en el rescate y adopción de gatos. Promovemos la tenencia responsable y la esterilización.",
        hours: "Martes a Domingo: 10:00 AM - 5:00 PM",
        website: null
    },
    {
        id: 3,
        name: "Patitas Salvadas",
        lat: 19.3312,
        lng: -99.0915,
        address: "Plaza Animal 789, Iztapalapa, CDMX",
        phone: "55-3456-7890",
        email: "info@patitassalvadas.org",
        rating: 4.9,
        reviewCount: 203,
        distance: 4.2,
        pets: 42,
        species: ["perro", "gato"],
        services: ["adopcion", "esterilizacion", "vacunacion", "urgencias"],
        description: "Organización sin fines de lucro con más de 10 años rescatando animales. Programas de adopción responsable y educación.",
        hours: "Lunes a Sábado: 8:00 AM - 7:00 PM",
        website: "https://patitassalvadas.org"
    },
    {
        id: 4,
        name: "Hogar Canino",
        lat: 19.3689,
        lng: -99.0543,
        address: "Boulevard Can 321, Iztapalapa, CDMX",
        phone: "55-4567-8901",
        email: "adopciones@hogarcanino.mx",
        rating: 4.6,
        reviewCount: 167,
        distance: 3.5,
        pets: 31,
        species: ["perro"],
        services: ["adopcion", "entrenamiento", "vacunacion"],
        description: "Enfocados en la rehabilitación y adopción de perros. Programas de entrenamiento y socialización.",
        hours: "Miércoles a Domingo: 9:00 AM - 6:00 PM",
        website: null
    },
    {
        id: 5,
        name: "Amigos Peludos",
        lat: 19.3521,
        lng: -99.0456,
        address: "Jardín Animal 654, Iztapalapa, CDMX",
        phone: "55-5678-9012",
        email: "voluntarios@amigospeludos.org",
        rating: 4.7,
        reviewCount: 95,
        distance: 5.1,
        pets: 28,
        species: ["perro", "gato"],
        services: ["adopcion", "esterilizacion", "vacunacion"],
        description: "Comunidad de voluntarios dedicados al bienestar animal. Eventos de adopción cada fin de semana.",
        hours: "Viernes a Domingo: 10:00 AM - 4:00 PM",
        website: "https://amigospeludos.org"
    }
];

// Inicializar el mapa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadShelters();
    setupEventListeners();
});

// Inicializar el mapa de Leaflet
function initializeMap() {
    // Centro inicial en Iztapalapa, CDMX
    const iztapalapaCoords = [19.3575, -99.0671];
    
    map = L.map('sheltersMap').setView(iztapalapaCoords, 13);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Agregar controles de escala
    L.control.scale().addTo(map);

    // Intentar obtener la ubicación del usuario
    setTimeout(() => {
        if (!userLocation) {
            requestLocation();
        }
    }, 1000);
}

// Cargar refugios en el mapa
function loadShelters() {
    shelters = [...sampleShelters];
    displayShelters(shelters);
    updateSheltersCount(shelters.length);
}

// Mostrar refugios en el mapa y lista
function displayShelters(sheltersToShow) {
    // Limpiar marcadores existentes
    clearMarkers();

    // Agregar nuevos marcadores
    sheltersToShow.forEach(shelter => {
        const marker = L.marker([shelter.lat, shelter.lng])
            .addTo(map)
            .bindPopup(createShelterPopup(shelter))
            .on('click', function() {
                highlightShelter(shelter.id);
            });

        markers.push({
            id: shelter.id,
            marker: marker,
            shelter: shelter
        });
    });

    // Actualizar lista de resultados
    updateResultsList(sheltersToShow);

    // Ajustar vista del mapa para mostrar todos los marcadores
    if (sheltersToShow.length > 0) {
        const group = new L.featureGroup(markers.map(m => m.marker));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Crear popup para marcador
function createShelterPopup(shelter) {
    return `
        <div class="shelter-marker-popup">
            <h3>${shelter.name}</h3>
            <div class="shelter-rating">
                <span class="rating-stars">${getStarRating(shelter.rating)}</span>
                <span class="rating-value">${shelter.rating}</span>
                <span class="rating-count">(${shelter.reviewCount})</span>
            </div>
            <div class="shelter-meta">
                <span>📍 ${shelter.distance} km</span>
                <span>🐕 ${shelter.pets} mascotas</span>
            </div>
            <p>${shelter.address}</p>
            <button class="btn-primary btn-small" onclick="viewShelterDetails(${shelter.id})">
                Ver Detalles
            </button>
        </div>
    `;
}

// Actualizar lista de resultados
function updateResultsList(sheltersToShow) {
    const resultsList = document.getElementById('sheltersList');
    
    if (sheltersToShow.length === 0) {
        resultsList.innerHTML = `
            <div class="no-results">
                <p>😔 No se encontraron refugios con los filtros aplicados</p>
                <button class="btn-outline" onclick="clearFilters()">Limpiar filtros</button>
            </div>
        `;
        return;
    }

    resultsList.innerHTML = sheltersToShow.map(shelter => `
        <div class="shelter-card" data-shelter-id="${shelter.id}" onclick="selectShelter(${shelter.id})">
            <div class="shelter-header">
                <div class="shelter-info">
                    <div class="shelter-name">${shelter.name}</div>
                    <div class="shelter-distance">📍 ${shelter.distance} km</div>
                </div>
                <div class="shelter-rating">
                    <span class="rating-stars">${getStarRating(shelter.rating)}</span>
                    <span class="rating-value">${shelter.rating}</span>
                </div>
            </div>
            <div class="shelter-meta">
                <div class="shelter-pets">
                    ${shelter.species.includes('perro') ? '🐕' : ''}
                    ${shelter.species.includes('gato') ? '🐈' : ''}
                    ${shelter.pets} mascotas
                </div>
                <div class="review-count">(${shelter.reviewCount} reseñas)</div>
            </div>
            <div class="shelter-services">
                ${shelter.services.map(service => `
                    <span class="service-tag">${getServiceIcon(service)} ${getServiceName(service)}</span>
                `).join('')}
            </div>
            <div class="shelter-actions">
                <button class="btn-outline btn-small" onclick="event.stopPropagation(); viewShelterDetails(${shelter.id})">
                    👁️ Ver
                </button>
                <button class="btn-primary btn-small" onclick="event.stopPropagation(); getDirections(${shelter.id})">
                    🗺️ Cómo llegar
                </button>
            </div>
        </div>
    `).join('');
}

// Configurar event listeners
function setupEventListeners() {
    // Filtro de distancia
    const distanceFilter = document.getElementById('distanceFilter');
    if (distanceFilter) {
        distanceFilter.addEventListener('change', filterShelters);
    }

    // Ordenamiento de resultados
    const sortResults = document.getElementById('sortResults');
    if (sortResults) {
        sortResults.addEventListener('change', sortShelters);
    }

    // Búsqueda en tiempo real podría agregarse aquí
}

// Filtrar refugios
function filterShelters() {
    const distance = parseInt(document.getElementById('distanceFilter').value);
    const minRating = parseFloat(document.getElementById('ratingFilter').value);
    
    // Obtener especies seleccionadas
    const selectedSpecies = Array.from(document.querySelectorAll('input[name="species"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Obtener servicios seleccionados
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => checkbox.value);

    let filteredShelters = shelters.filter(shelter => {
        // Filtrar por distancia
        if (shelter.distance > distance) return false;
        
        // Filtrar por calificación
        if (shelter.rating < minRating) return false;
        
        // Filtrar por especies
        if (selectedSpecies.length > 0 && !selectedSpecies.some(species => shelter.species.includes(species))) {
            return false;
        }
        
        // Filtrar por servicios
        if (selectedServices.length > 0 && !selectedServices.every(service => shelter.services.includes(service))) {
            return false;
        }
        
        return true;
    });

    // Ordenar resultados
    sortSheltersList(filteredShelters);
    
    displayShelters(filteredShelters);
    updateSheltersCount(filteredShelters.length);
}

// Ordenar refugios
function sortShelters() {
    const sortBy = document.getElementById('sortResults').value;
    let sortedShelters = [...shelters];
    
    sortSheltersList(sortedShelters, sortBy);
    displayShelters(sortedShelters);
}

function sortSheltersList(sheltersList, sortBy = 'distance') {
    sheltersList.sort((a, b) => {
        switch (sortBy) {
            case 'distance':
                return a.distance - b.distance;
            case 'rating':
                return b.rating - a.rating;
            case 'pets':
                return b.pets - a.pets;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });
}

// Filtrar por distancia
function filterByDistance() {
    filterShelters();
}

// Seleccionar refugio
function selectShelter(shelterId) {
    // Remover clase active de todas las tarjetas
    document.querySelectorAll('.shelter-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Agregar clase active a la tarjeta seleccionada
    const selectedCard = document.querySelector(`[data-shelter-id="${shelterId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    // Encontrar y abrir el marcador correspondiente
    const markerData = markers.find(m => m.id === shelterId);
    if (markerData) {
        markerData.marker.openPopup();
        map.setView([markerData.shelter.lat, markerData.shelter.lng], 15);
    }
}

// Resaltar refugio en el mapa
function highlightShelter(shelterId) {
    selectShelter(shelterId);
}

// Ver detalles del refugio
function viewShelterDetails(shelterId) {
    const shelter = shelters.find(s => s.id === shelterId);
    if (!shelter) return;

    const modalContent = document.getElementById('shelterModalContent');
    modalContent.innerHTML = `
        <div class="shelter-detail-header">
            <div class="shelter-detail-info">
                <h2 class="shelter-detail-name">${shelter.name}</h2>
                <div class="shelter-detail-meta">
                    <div class="shelter-detail-rating">
                        <span class="rating-stars">${getStarRating(shelter.rating)}</span>
                        <span class="rating-value">${shelter.rating}</span>
                        <span class="rating-count">(${shelter.reviewCount} reseñas)</span>
                    </div>
                    <span>📍 ${shelter.distance} km de ti</span>
                    <span>🐕 ${shelter.pets} mascotas disponibles</span>
                </div>
            </div>
            <div class="shelter-detail-actions">
                <button class="btn-outline" onclick="getDirections(${shelter.id})">🗺️ Cómo llegar</button>
                <button class="btn-primary" onclick="viewShelterPets(${shelter.id})">🐕 Ver Mascotas</button>
            </div>
        </div>

        <div class="shelter-detail-content">
            <div>
                <div class="shelter-detail-section">
                    <h3>📝 Descripción</h3>
                    <p>${shelter.description}</p>
                </div>

                <div class="shelter-detail-section">
                    <h3>🕒 Horarios de Atención</h3>
                    <p>${shelter.hours}</p>
                </div>

                <div class="shelter-detail-section">
                    <h3>🐾 Especies</h3>
                    <div class="shelter-services-list">
                        ${shelter.species.map(species => `
                            <div class="service-item">
                                ${species === 'perro' ? '🐕' : '🐈'}
                                <span>${species === 'perro' ? 'Perros' : 'Gatos'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div>
                <div class="shelter-detail-section">
                    <h3>📍 Información de Contacto</h3>
                    <div class="shelter-contact-info">
                        <div class="contact-item">
                            <span>🏠</span>
                            <span>${shelter.address}</span>
                        </div>
                        <div class="contact-item">
                            <span>📞</span>
                            <span>${shelter.phone}</span>
                        </div>
                        <div class="contact-item">
                            <span>📧</span>
                            <span>${shelter.email}</span>
                        </div>
                        ${shelter.website ? `
                        <div class="contact-item">
                            <span>🌐</span>
                            <a href="${shelter.website}" target="_blank">${shelter.website}</a>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="shelter-detail-section">
                    <h3>⚡ Servicios</h3>
                    <div class="shelter-services-list">
                        ${shelter.services.map(service => `
                            <div class="service-item">
                                ${getServiceIcon(service)}
                                <span>${getServiceName(service)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal('shelterModal');
}

// Obtener direcciones
function getDirections(shelterId) {
    const shelter = shelters.find(s => s.id === shelterId);
    if (!shelter) return;

    if (userLocation) {
        // Usar Google Maps para direcciones
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${shelter.lat},${shelter.lng}&travelmode=driving`;
        window.open(url, '_blank');
    } else {
        // Solo mostrar la ubicación del refugio
        const url = `https://www.google.com/maps?q=${shelter.lat},${shelter.lng}`;
        window.open(url, '_blank');
    }
}

// Ver mascotas del refugio
function viewShelterPets(shelterId) {
    // Redirigir a la página de búsqueda filtrada por refugio
    window.location.href = `search.html?refuge=${shelterId}`;
}

// Ubicación del usuario
function locateUser() {
    if (!navigator.geolocation) {
        alert('La geolocalización no es soportada por tu navegador');
        return;
    }

    openModal('locationModal');
}

function requestLocationPermission() {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Agregar marcador de usuario
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            
            userMarker = L.marker([userLocation.lat, userLocation.lng])
                .addTo(map)
                .bindPopup('📍 Tu ubicación actual')
                .openPopup();

            // Centrar mapa en usuario
            map.setView([userLocation.lat, userLocation.lng], 14);
            
            // Recalcular distancias (en una implementación real)
            shelters.forEach(shelter => {
                shelter.distance = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    shelter.lat, shelter.lng
                );
            });
            
            closeModal('locationModal');
            filterShelters(); // Re-filtrar con nuevas distancias
        },
        function(error) {
            console.error('Error obteniendo ubicación:', error);
            alert('No se pudo obtener tu ubicación. Asegúrate de haber permitido el acceso.');
            closeModal('locationModal');
        }
    );
}

function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Solo agregar marcador si está cerca de Iztapalapa
                const distanceFromIztapalapa = calculateDistance(19.3575, -99.0671, userLocation.lat, userLocation.lng);
                if (distanceFromIztapalapa < 50) { // Dentro de 50km de Iztapalapa
                    userMarker = L.marker([userLocation.lat, userLocation.lng])
                        .addTo(map)
                        .bindPopup('📍 Tu ubicación actual');
                }
            },
            function(error) {
                console.log('Ubicación no disponible:', error.message);
            }
        );
    }
}

// Mostrar todos los refugios
function showAllShelters() {
    map.fitBounds(new L.LatLngBounds(
        markers.map(m => m.marker.getLatLng())
    ).pad(0.1));
}

// Zoom a todos los refugios
function zoomToAll() {
    if (markers.length > 0) {
        const group = new L.featureGroup(markers.map(m => m.marker));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Alternar vista satélite
function toggleSatellite() {
    if (isSatelliteView) {
        // Volver a vista normal
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);
        
        isSatelliteView = false;
    } else {
        // Cambiar a vista satélite
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
        }).addTo(map);
        
        isSatelliteView = true;
    }
}

// Utilidades
function clearMarkers() {
    markers.forEach(markerData => {
        map.removeLayer(markerData.marker);
    });
    markers = [];
}

function updateSheltersCount(count) {
    const countElement = document.getElementById('sheltersCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

function clearFilters() {
    // Restablecer todos los filtros
    document.getElementById('distanceFilter').value = '10';
    document.querySelectorAll('input[name="species"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    document.getElementById('ratingFilter').value = '4';
    document.querySelectorAll('input[name="services"]').forEach(checkbox => {
        checkbox.checked = checkbox.value === 'adopcion';
    });
    
    filterShelters();
}

function getStarRating(rating) {
    const fullStars = '⭐'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '⭐' : '';
    return fullStars + halfStar;
}

function getServiceIcon(service) {
    const icons = {
        'adopcion': '🏠',
        'esterilizacion': '💊',
        'vacunacion': '💉',
        'urgencias': '🚑',
        'entrenamiento': '🎓'
    };
    return icons[service] || '⚡';
}

function getServiceName(service) {
    const names = {
        'adopcion': 'Adopción',
        'esterilizacion': 'Esterilización',
        'vacunacion': 'Vacunación',
        'urgencias': 'Urgencias',
        'entrenamiento': 'Entrenamiento'
    };
    return names[service] || service;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10; // Distancia en km con 1 decimal
}

// Navegación
function navigateTo(url) {
    window.location.href = url;
}