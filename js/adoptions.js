// js/adoptions.js
// Bandeja y flujo de solicitudes de adopción

document.addEventListener('DOMContentLoaded', () => {
    const requestForm = document.getElementById('adoptionRequestForm');
    const requestList = document.getElementById('adoptionRequests');
    if (requestForm) requestForm.addEventListener('submit', submitAdoptionRequest);
    if (requestList) loadAdoptionRequests();
});

async function submitAdoptionRequest(event) {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
        form.querySelector('button[type="submit"]').disabled = true;
        const res = await apiFetch('/adoptions', { method: 'POST', body: JSON.stringify(data) });
        if (!res.ok) throw new Error('No se pudo enviar la solicitud');
        form.reset();
        document.getElementById('adoptionStatus').textContent = 'Solicitud enviada';
        loadAdoptionRequests();
    } catch (error) {
        console.error(error);
        document.getElementById('adoptionStatus').textContent = 'Error al enviar la solicitud';
    } finally {
        form.querySelector('button[type="submit"]').disabled = false;
    }
}

async function loadAdoptionRequests() {
    const container = document.getElementById('adoptionRequests');
    if (!container) return;
    try {
        const res = await apiFetch('/adoptions');
        if (!res.ok) throw new Error('No se pudieron cargar las solicitudes');
        const data = await res.json();
        renderAdoptionRequests(data);
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>No hay solicitudes disponibles.</p>';
    }
}

function renderAdoptionRequests(requests) {
    const container = document.getElementById('adoptionRequests');
    if (!container) return;
    if (!requests.length) {
        container.innerHTML = '<p>No hay solicitudes por ahora.</p>';
        return;
    }
    container.innerHTML = requests.map((req) => `
        <article class="card">
            <div class="card-row">
                <div>
                    <h3>${req.pet?.name || 'Mascota'}</h3>
                    <p class="muted">${req.applicant?.name || 'Solicitante'} · ${req.status || 'nueva'}</p>
                </div>
                <span class="status status-${req.status}">${req.status}</span>
            </div>
            <p>${req.message || 'Sin mensaje'}</p>
            <div class="timeline">
                ${(req.timeline || []).map((item) => `<span>${item.date || ''}: ${item.text || ''}</span>`).join('')}
            </div>
        </article>
    `).join('');
}
