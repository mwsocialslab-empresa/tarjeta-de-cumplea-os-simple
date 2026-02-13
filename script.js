// 1. VARIABLES GLOBALES
let lastTouchEnd = 0;

// 2. FUNCIÓN DE LOS GLOBOS (Definirla primero)
function startBalloonRain() {
    const container = document.getElementById('balloons-container');
    if (!container) return;

    const colors = ['#ec4899', '#a855f7', '#6366f1', '#f472b6', '#c084fc'];
    
    setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Ajustes aleatorios
        const size = Math.random() * (70 - 40) + 40;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startPos = Math.random() * 100;
        const duration = Math.random() * (15 - 8) + 8;

        balloon.style.left = `${startPos}%`;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;
        balloon.style.backgroundColor = color;
        balloon.style.animationDuration = `${duration}s`;
        
        container.appendChild(balloon);

        // Limpiar globos viejos
        setTimeout(() => balloon.remove(), duration * 1000);
    }, 600);
}

// 3. CONTROL DE FECHA Y ARRANQUE
document.addEventListener('DOMContentLoaded', () => {
    // FECHA LÍMITE: 8 de Marzo de 2026 (Mes 2 en JS)
    const fechaLimite = new Date(2026, 2, 7, 0, 0, 0); 
    const ahora = new Date();

    if (ahora > fechaLimite) {
        // SI YA PASÓ LA FECHA
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="container text-center p-3">
                    <div class="card invitation-card p-5 shadow-lg border-0 rounded-4">
                        <div class="display-1 mb-3">🎈</div>
                        <h2 class="fw-bold" style="color: #a855f7;">¡La fiesta terminó!</h2>
                        <p class="text-muted">Gracias por habernos acompañado en el cumple de Zoe.</p>
                        <div class="bottom-bar mt-4"></div>
                    </div>
                </div>
            `;
        }
    } else {
        // SI LA FECHA ES VÁLIDA: Arrancamos globos
        startBalloonRain();
    }
});

// 4. PREVENIR ZOOM PERO PERMITIR SCROLL
document.addEventListener('touchend', function (event) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        // Solo bloqueamos si el toque fue en un botón
        if (event.target.tagName === 'BUTTON' || event.target.classList.contains('btn')) {
            event.preventDefault();
        }
    }
    lastTouchEnd = now;
}, false);

// 5. FUNCIONES DE ASISTENCIA (Cantidad y Confirmación)
function changeQty(type, delta) {
    const span = document.getElementById(`qty-${type}`);
    let current = parseInt(span.innerText);
    current = Math.max(0, current + delta);
    span.innerText = current;
}

function confirmAttendance() {
    const name = document.getElementById('guest-name').value;
    const errorMsg = document.getElementById('error-message');
    
    if (!name.trim()) {
        errorMsg.classList.remove('d-none');
        return;
    }
    
    errorMsg.classList.add('d-none');
    document.getElementById('form-container').classList.add('d-none');
    document.getElementById('success-container').classList.remove('d-none');
    document.getElementById('confirmed-name').innerText = name;
    
    // Aquí podrías agregar el efecto de confeti extra si lo tienes
}