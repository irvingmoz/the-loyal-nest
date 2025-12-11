// js/reports.js
// Consumo de /reports y renderizado con Chart.js

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('reportCanvas')) loadReports();
});

async function loadReports() {
    const canvas = document.getElementById('reportCanvas');
    const exportBtn = document.getElementById('exportCsv');
    try {
        const res = await apiFetch('/reports');
        if (!res.ok) throw new Error('No se pudieron cargar los reportes');
        const data = await res.json();
        renderChart(canvas, data.adoptions || []);
        if (exportBtn) exportBtn.addEventListener('click', () => exportCsv(data.adoptions || []));
    } catch (error) {
        console.error(error);
        if (canvas) canvas.insertAdjacentHTML('afterend', '<p>No se pudieron cargar los reportes.</p>');
    }
}

function renderChart(canvas, series) {
    if (!canvas || typeof Chart === 'undefined') return;
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: series.map((item) => item.label),
            datasets: [{ label: 'Adopciones', data: series.map((item) => item.value), backgroundColor: '#ff914d' }]
        }
    });
}

function exportCsv(series) {
    const header = 'Etiqueta,Valor\n';
    const rows = series.map((item) => `${item.label},${item.value}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportes.csv';
    link.click();
    URL.revokeObjectURL(url);
}
