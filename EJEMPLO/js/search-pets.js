// Search System - Funcionalidad completa de búsqueda
class PetSearch {
    constructor() {
        this.pets = [];
        this.filteredPets = [];
        this.currentPage = 1;
        this.petsPerPage = 9;
        this.currentFilters = {
            type: ['perro', 'gato'],
            age: [],
            size: [],
            gender: [],
            location: '',
            searchTerm: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadPets();
        this.setupEventListeners();
        this.renderPets();
        this.updateResultsCount();
    }

    // Cargar datos de mascotas (simulado)
    async loadPets() {
        // Simular carga de API
        this.showLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.pets = [
            {
                id: 1,
                name: "Max",
                type: "perro",
                breed: "Labrador Mix",
                age: "joven",
                size: "grande",
                gender: "macho",
                location: "cdmx",
                image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
                description: "Max es un labrador juguetón y energético que adora los paseos y jugar a buscar la pelota.",
                status: "available",
                isUrgent: false,
                isNew: true,
                dateAdded: "2024-01-15"
            },
            {
                id: 2,
                name: "Luna",
                type: "gato",
                breed: "Siamés",
                age: "adulto",
                size: "pequeno",
                gender: "hembra",
                location: "cdmx",
                image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
                description: "Luna es una gata tranquila y cariñosa que busca un hogar calmado donde recibir mimos.",
                status: "available",
                isUrgent: true,
                isNew: false,
                dateAdded: "2024-01-10"
            },
            {
                id: 3,
                name: "Rocky",
                type: "perro",
                breed: "Bulldog",
                age: "senior",
                size: "mediano",
                gender: "macho",
                location: "edomex",
                image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
                description: "Rocky es un bulldog senior muy tranquilo, perfecto para familias o personas mayores.",
                status: "available",
                isUrgent: false,
                isNew: false,
                dateAdded: "2024-01-08"
            },
            {
                id: 4,
                name: "Bella",
                type: "perro",
                breed: "Chihuahua",
                age: "cachorro",
                size: "pequeno",
                gender: "hembra",
                location: "jalisco",
                image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop",
                description: "Bella es una cachorrita chihuahua llena de energía y amor para dar.",
                status: "available",
                isUrgent: false,
                isNew: true,
                dateAdded: "2024-01-20"
            },
            {
                id: 5,
                name: "Simba",
                type: "gato",
                breed: "Mestizo",
                age: "joven",
                size: "mediano",
                gender: "macho",
                location: "cdmx",
                image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop",
                description: "Simba es un gato curioso y juguetón que se lleva bien con otros animales.",
                status: "available",
                isUrgent: true,
                isNew: false,
                dateAdded: "2024-01-05"
            },
            {
                id: 6,
                name: "Daisy",
                type: "perro",
                breed: "Golden Retriever",
                age: "adulto",
                size: "grande",
                gender: "hembra",
                location: "nuevo-leon",
                               image: "https://images.unsplash.com/photo-1505623776324-32c5ba67cae7?w=400&h=300&fit=crop",
                description: "Daisy es una golden retriever muy dulce y paciente, ideal para familias con niños.",
                status: "available",
                isUrgent: false,
                isNew: true,
                dateAdded: "2024-01-18"
            },
            {
                id: 7,
                name: "Milo",
                type: "gato",
                breed: "Persa",
                age: "adulto",
                size: "pequeno",
                gender: "macho",
                location: "edomex",
                image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=300&fit=crop",
                description: "Milo es un gato persa tranquilo que disfruta de la compañía y los lugares cómodos.",
                status: "available",
                isUrgent: false,
                isNew: false,
                dateAdded: "2024-01-12"
            },
            {
                id: 8,
                name: "Lola",
                type: "perro",
                breed: "Poodle",
                age: "senior",
                size: "pequeno",
                gender: "hembra",
                location: "cdmx",
                image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=400&h=300&fit=crop",
                description: "Lola es una poodle senior muy educada que busca un hogar tranquilo para sus años dorados.",
                status: "available",
                isUrgent: true,
                isNew: false,
                dateAdded: "2024-01-03"
            },
            {
                id: 9,
                name: "Thor",
                type: "perro",
                breed: "Husky",
                age: "joven",
                size: "grande",
                gender: "macho",
                location: "jalisco",
                image: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?w=400&h=300&fit=crop",
                description: "Thor es un husky energético que necesita espacio para correr y jugar.",
                status: "available",
                isUrgent: false,
                isNew: true,
                dateAdded: "2024-01-22"
            }
        ];
        
        this.showLoading(false);
    }

    // Configurar event listeners
    setupEventListeners() {
        // Búsqueda principal
        const searchInput = document.getElementById('mainSearch');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Filtros rápidos
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                this.handleQuickFilter(e.target);
            });
        });

        // Filtros de checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Filtro de ubicación
        document.getElementById('filterLocation').addEventListener('change', () => {
            this.updateFilters();
        });

        // Botones de favorito
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-favorite')) {
                this.toggleFavorite(e.target);
            }
        });

        // Botones de solicitud
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-request')) {
                this.handleAdoptionRequest(e.target);
            }
        });
    }

    // Manejar filtros rápidos
    handleQuickFilter(chip) {
        // Remover activo de todos los chips
        document.querySelectorAll('.filter-chip').forEach(c => {
            c.classList.remove('active');
        });
        
        // Activar chip clickeado
        chip.classList.add('active');
        
        const filter = chip.dataset.filter;
        
        // Resetear otros filtros
        this.resetCheckboxes();
        
        switch(filter) {
            case 'all':
                this.currentFilters.type = ['perro', 'gato'];
                break;
            case 'perro':
                this.currentFilters.type = ['perro'];
                break;
            case 'gato':
                this.currentFilters.type = ['gato'];
                break;
            case 'cachorro':
                this.currentFilters.age = ['cachorro'];
                break;
            case 'urgente':
                // Filtro especial para urgentes
                this.filteredPets = this.pets.filter(pet => pet.isUrgent);
                this.renderPets();
                return;
            case 'apartamento':
                this.currentFilters.size = ['pequeno', 'mediano'];
                break;
        }
        
        this.updateFilters();
    }

    // Actualizar filtros desde checkboxes
    updateFilters() {
        this.currentFilters.type = this.getCheckedValues('type');
        this.currentFilters.age = this.getCheckedValues('age');
        this.currentFilters.size = this.getCheckedValues('size');
        this.currentFilters.gender = this.getCheckedValues('gender');
        this.currentFilters.location = document.getElementById('filterLocation').value;
        this.currentFilters.searchTerm = document.getElementById('mainSearch').value.toLowerCase();
        
        this.applyFilters();
    }

    // Obtener valores de checkboxes marcados
    getCheckedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // Aplicar filtros
    applyFilters() {
        this.filteredPets = this.pets.filter(pet => {
            // Filtro por tipo
            if (this.currentFilters.type.length > 0 && !this.currentFilters.type.includes(pet.type)) {
                return false;
            }
            
            // Filtro por edad
            if (this.currentFilters.age.length > 0 && !this.currentFilters.age.includes(pet.age)) {
                return false;
            }
            
            // Filtro por tamaño
            if (this.currentFilters.size.length > 0 && !this.currentFilters.size.includes(pet.size)) {
                return false;
            }
            
            // Filtro por género
            if (this.currentFilters.gender.length > 0 && !this.currentFilters.gender.includes(pet.gender)) {
                return false;
            }
            
            // Filtro por ubicación
            if (this.currentFilters.location && pet.location !== this.currentFilters.location) {
                return false;
            }
            
            // Filtro por búsqueda de texto
            if (this.currentFilters.searchTerm) {
                const searchTerm = this.currentFilters.searchTerm.toLowerCase();
                const searchableText = `${pet.name} ${pet.breed} ${pet.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderPets();
        this.updateResultsCount();
    }

    // Realizar búsqueda
    performSearch() {
        this.updateFilters();
    }

    // Renderizar mascotas
    renderPets() {
        const grid = document.getElementById('petsGrid');
        const startIndex = (this.currentPage - 1) * this.petsPerPage;
        const endIndex = startIndex + this.petsPerPage;
        const petsToShow = this.filteredPets.slice(startIndex, endIndex);
        
        if (petsToShow.length === 0) {
            grid.innerHTML = this.getNoResultsHTML();
        } else {
            grid.innerHTML = petsToShow.map(pet => this.getPetCardHTML(pet)).join('');
        }
        
        this.updatePagination();
    }

    // HTML cuando no hay resultados
    getNoResultsHTML() {
        return `
            <div class="no-results">
                <div style="text-align: center; padding: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
                    <h3 style="color: var(--gray); margin-bottom: 1rem;">No se encontraron mascotas</h3>
                    <p style="color: var(--gray); margin-bottom: 2rem;">
                        Intenta ajustar tus filtros o términos de búsqueda.
                    </p>
                    <button class="btn-outline" onclick="resetFilters()">Limpiar Filtros</button>
                </div>
            </div>
        `;
    }

    // HTML de tarjeta de mascota
    getPetCardHTML(pet) {
        const locationNames = {
            'cdmx': 'CDMX',
            'edomex': 'Estado de México', 
            'jalisco': 'Jalisco',
            'nuevo-leon': 'Nuevo León'
        };
        
        const ageLabels = {
            'cachorro': 'Cachorro',
            'joven': 'Joven', 
            'adulto': 'Adulto',
            'senior': 'Senior'
        };
        
        const sizeLabels = {
            'pequeno': 'Pequeño',
            'mediano': 'Mediano',
            'grande': 'Grande'
        };

        return `
            <div class="pet-card" onclick="window.location.href='pet-profile.html?id=${pet.id}'">
                <div class="pet-image">
                    <img src="${pet.image}" alt="${pet.name}" loading="lazy">
                    <div class="pet-badges">
                        ${pet.isUrgent ? '<span class="pet-badge badge-urgent">⚠️ Urgente</span>' : ''}
                        ${pet.isNew ? '<span class="pet-badge badge-new">🆕 Nuevo</span>' : ''}
                        ${pet.age === 'senior' ? '<span class="pet-badge badge-senior">👴 Senior</span>' : ''}
                    </div>
                    <button class="btn-favorite">❤️</button>
                </div>
                <div class="pet-info">
                    <h4>${pet.name}</h4>
                    <div class="pet-details">
                        <span>${pet.type === 'perro' ? '🐕' : '🐈'} ${pet.breed}</span>
                        <span>🎂 ${ageLabels[pet.age]} • ${sizeLabels[pet.size]}</span>
                        <span>📍 ${locationNames[pet.location]}</span>
                    </div>
                    <p class="pet-description">${pet.description}</p>
                    <div class="pet-actions">
                        <button class="btn-outline btn-sm" onclick="event.stopPropagation(); window.location.href='pet-profile.html?id=${pet.id}'">
                            Ver Detalles
                        </button>
                        <button class="btn-primary btn-sm btn-request" data-pet-id="${pet.id}">
                            Solicitar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Actualizar contador de resultados
    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        const locationElement = document.getElementById('resultsLocation');
        const locationFilter = document.getElementById('filterLocation');
        
        const location = locationFilter.options[locationFilter.selectedIndex].text;
        const locationText = location !== 'Todas las ubicaciones' ? `en ${location}` : '';
        
        countElement.textContent = `${this.filteredPets.length} Mascotas Encontradas`;
        locationElement.textContent = locationText;
    }

    // Actualizar paginación
    updatePagination() {
        const totalPages = Math.ceil(this.filteredPets.length / this.petsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Mostrar/ocultar paginación
        const pagination = document.getElementById('pagination');
        pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    // Cambiar página
    changePage(direction) {
        const totalPages = Math.ceil(this.filteredPets.length / this.petsPerPage);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderPets();
            
            // Scroll suave hacia arriba
            window.scrollTo({
                top: document.querySelector('.search-results').offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }

    // Ordenar mascotas
    sortPets() {
        const sortBy = document.getElementById('sortBy').value;
        
        switch(sortBy) {
            case 'recent':
                this.filteredPets.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'urgent':
                this.filteredPets.sort((a, b) => b.isUrgent - a.isUrgent);
                break;
            case 'name':
                this.filteredPets.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'age':
                const ageOrder = { 'cachorro': 0, 'joven': 1, 'adulto': 2, 'senior': 3 };
                this.filteredPets.sort((a, b) => ageOrder[a.age] - ageOrder[b.age]);
                break;
        }
        
        this.currentPage = 1;
        this.renderPets();
    }

    // Alternar favorito
    toggleFavorite(button) {
        button.classList.toggle('active');
        
        const petCard = button.closest('.pet-card');
        const petName = petCard.querySelector('h4').textContent;
        
        if (button.classList.contains('active')) {
            button.style.color = 'var(--danger)';
            this.showNotification(`❤️ ${petName} agregado a favoritos`, 'success');
        } else {
            button.style.color = 'inherit';
            this.showNotification(`💔 ${petName} removido de favoritos`, 'info');
        }
    }

    // Manejar solicitud de adopción
    handleAdoptionRequest(button) {
        const petId = button.dataset.petId;
        const pet = this.pets.find(p => p.id == petId);
        
        if (!pet) return;
        
        // Verificar si el usuario está loggeado
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            this.showNotification('🔐 Inicia sesión para solicitar adopción', 'warning');
            setTimeout(() => {
                window.location.href = 'auth.html?redirect=search-pets.html';
            }, 1500);
            return;
        }
        
        // Mostrar loading
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ Procesando...';
        button.disabled = true;
        
        // Simular envío de solicitud
        setTimeout(() => {
            button.innerHTML = '✅ Solicitado';
            button.disabled = true;
            button.style.background = 'var(--success)';
            
            this.showNotification(`🐕 Solicitud enviada para ${pet.name}`, 'success');
            
            // Guardar en localStorage (simulación)
            this.saveAdoptionRequest(pet, currentUser);
        }, 2000);
    }

    // Guardar solicitud (simulación)
    saveAdoptionRequest(pet, user) {
        const requests = JSON.parse(localStorage.getItem('adoptionRequests') || '[]');
        
        const newRequest = {
            id: Date.now(),
            petId: pet.id,
            petName: pet.name,
            userId: user.id,
            userName: user.nombre,
            status: 'pending',
            date: new Date().toISOString()
        };
        
        requests.push(newRequest);
        localStorage.setItem('adoptionRequests', JSON.stringify(requests));
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `global-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-left: 4px solid var(--${type});
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Mostrar/ocultar loading
    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        if (show) {
            loadingState.classList.add('show');
        } else {
            loadingState.classList.remove('show');
        }
    }

    // Resetear checkboxes
    resetCheckboxes() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Marcar perros y gatos por defecto
        document.querySelectorAll('input[name="type"][value="perro"], input[name="type"][value="gato"]').forEach(cb => {
            cb.checked = true;
        });
    }
}

// Funciones globales
function resetFilters() {
    document.getElementById('mainSearch').value = '';
    document.getElementById('filterLocation').value = '';
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
    
    petSearch.resetCheckboxes();
    petSearch.currentFilters = {
        type: ['perro', 'gato'],
        age: [],
        size: [],
        gender: [],
        location: '',
        searchTerm: ''
    };
    
    petSearch.applyFilters();
}

function performSearch() {
    petSearch.performSearch();
}

function applyFilters() {
    petSearch.applyFilters();
}

function sortPets() {
    petSearch.sortPets();
}

function changePage(direction) {
    petSearch.changePage(direction);
}

// Inicializar cuando el DOM esté listo
let petSearch;
document.addEventListener('DOMContentLoaded', function() {
    petSearch = new PetSearch();
});