// js/medical.js
// Historial médico de mascotas y cálculo de próximas fechas

document.addEventListener('DOMContentLoaded', () => {
    const medicalForm = document.getElementById('medicalForm');
    if (medicalForm) medicalForm.addEventListener('submit', submitMedicalEntry);
    loadMedicalHistory();
});

async function loadMedicalHistory() {
    const list = document.getElementById('medicalHistory');
    if (!list) return;
    const params = new URLSearchParams(window.location.search);
    const petId = params.get('id');
    if (!petId) return;
    try {
        const res = await apiFetch(`/pets/${petId}/medical`);
        if (!res.ok) throw new Error('No se pudo cargar el historial');
        const data = await res.json();
        renderMedicalHistory(data);
    } catch (error) {
        console.error(error);
        list.innerHTML = '<p>No hay historial disponible.</p>';
    }
}

function renderMedicalHistory(entries) {
    const list = document.getElementById('medicalHistory');
    if (!list) return;
    if (!entries.length) {
        list.innerHTML = '<p>No hay entradas médicas.</p>';
        return;
    }
    list.innerHTML = entries.map((entry) => `
        <tr>
            <td>${entry.type}</td>
            <td>${entry.date}</td>
            <td>${entry.notes || 'Sin notas'}</td>
            <td>${entry.nextDate || 'N/A'}</td>
        </tr>
    `).join('');
}

async function submitMedicalEntry(event) {
    event.preventDefault();
    const form = event.target;
    const params = new URLSearchParams(window.location.search);
    const petId = params.get('id');
    const data = Object.fromEntries(new FormData(form).entries());
    try {
        form.querySelector('button[type="submit"]').disabled = true;
        const res = await apiFetch(`/pets/${petId}/medical`, { method: 'POST', body: JSON.stringify(data) });
        if (!res.ok) throw new Error('No se pudo guardar la entrada');
        form.reset();
        loadMedicalHistory();
    } catch (error) {
        console.error(error);
        alert('No se pudo guardar la entrada');
    } finally {
        form.querySelector('button[type="submit"]').disabled = false;
    }
}
