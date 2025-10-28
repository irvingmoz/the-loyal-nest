// Forms JavaScript - Funcionalidades para formularios
document.addEventListener('DOMContentLoaded', function() {
    initializePhotoUpload();
    initializeFormValidation();
    addFirstMedicalItems();
});

// Sistema de subida de fotos
function initializePhotoUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('petPhotos');
    const photoPreview = document.getElementById('photoPreview');

    if (!uploadArea || !fileInput) return;

    // Click en el área de upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Cambio en input de archivo
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    const photoPreview = document.getElementById('photoPreview');
    
    for (let file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="preview-remove" onclick="removePhoto(this)">×</button>
            `;
            photoPreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto(button) {
    button.parentElement.remove();
}

// Sistema de listas dinámicas para historial médico
function addVaccine() {
    const list = document.getElementById('vaccinesList');
    addDynamicItem(list, 'vacuna');
}

function addDeworming() {
    const list = document.getElementById('dewormingsList');
    addDynamicItem(list, 'desparasitacion');
}

function addTreatment() {
    const list = document.getElementById('treatmentsList');
    addDynamicItem(list, 'tratamiento');
}

function addDynamicItem(list, type) {
    const template = list.querySelector('.template');
    const newItem = template.cloneNode(true);
    
    newItem.classList.remove('template');
    newItem.style.display = 'block';
    
    // Configurar botón de eliminar
    const removeBtn = newItem.querySelector('.btn-remove');
    removeBtn.onclick = function() {
        newItem.remove();
    };
    
    list.appendChild(newItem);
}

function addFirstMedicalItems() {
    // Agregar un item vacío por defecto en cada sección médica
    addVaccine();
    addDeworming();
    addTreatment();
}

// Validación del formulario
function initializeFormValidation() {
    const form = document.getElementById('addPetForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    // Validar campos requeridos
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo es requerido');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validar que haya al menos una foto
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview && photoPreview.children.length === 0) {
        alert('⚠️ Por favor agrega al menos una foto de la mascota');
        isValid = false;
    }
    
    // Validar personalidad (al menos una seleccionada)
    const personalityChecked = document.querySelectorAll('input[name="personality"]:checked');
    if (personalityChecked.length === 0) {
        alert('⚠️ Por favor selecciona al menos una característica de personalidad');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = 'var(--danger)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--danger)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Envío del formulario
function submitForm() {
    const form = document.getElementById('addPetForm');
    const formData = new FormData(form);
    
    // Aquí iría la lógica para enviar a tu backend
    console.log('Enviando formulario...');
    
    // Simular envío
    showLoadingState();
    
    setTimeout(() => {
        hideLoadingState();
        showSuccessMessage();
    }, 2000);
}

function showLoadingState() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Publicando...';
}

function hideLoadingState() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🐕 Publicar Mascota';
}

function showSuccessMessage() {
    alert('✅ ¡Mascota publicada exitosamente! Será visible para los adoptantes.');
    // Redirigir al panel del rescatista
    window.location.href = 'dashboard-rescuer.html';
}

// Guardar borrador
function saveDraft() {
    const formData = new FormData(document.getElementById('addPetForm'));
    
    // Aquí iría la lógica para guardar como borrador
    console.log('Guardando borrador...');
    
    alert('💾 Borrador guardado exitosamente. Puedes continuar más tarde.');
}

// Navegación entre secciones del formulario
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}