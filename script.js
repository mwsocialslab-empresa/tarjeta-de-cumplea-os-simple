// 1. VARIABLES GLOBALES
let lastTouchEnd = 0;

// 2. FUNCIÓN DE LOS GLOBOS
function startBalloonRain() {
    const container = document.getElementById('balloons-container');
    if (!container) return;
    const colors = ['#ec4899', '#a855f7', '#6366f1', '#f472b6', '#c084fc'];
    setInterval(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
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
        setTimeout(() => balloon.remove(), duration * 1000);
    }, 600);
}

// 3. CONTROL DE FECHA, PERSISTENCIA Y ARRANQUE
document.addEventListener('DOMContentLoaded', () => {
    const yaConfirmo = localStorage.getItem('confirmado_zoe');
    const nombreGuardado = localStorage.getItem('nombre_invitado');

    if (yaConfirmo === 'true' && nombreGuardado) {
        mostrarExitoDirecto(nombreGuardado);
    }

    const fechaLimite = new Date(2026, 2, 8, 0, 0, 0); 
    const ahora = new Date();

    if (ahora > fechaLimite) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `<div class="container text-center p-3"><div class="card invitation-card p-5 shadow-lg border-0 rounded-4"><div class="display-1 mb-3">🎈</div><h2 class="fw-bold" style="color: #a855f7;">¡La fiesta terminó!</h2><p class="text-muted">Gracias por habernos acompañado en el cumple de Zoe.</p><div class="bottom-bar mt-4"></div></div></div>`;
        }
    } else {
        startBalloonRain();
    }
});

// 4. PREVENIR ZOOM
document.addEventListener('touchend', function (event) {
    let now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        if (event.target.tagName === 'BUTTON' || event.target.classList.contains('btn')) {
            event.preventDefault();
        }
    }
    lastTouchEnd = now;
}, false);

// 5. FUNCIONES DE ASISTENCIA Y ENVÍO
function changeQty(type, delta) {
    const span = document.getElementById(`qty-${type}`);
    if (!span) return;
    let current = parseInt(span.innerText);
    current = Math.max(0, current + delta);
    span.innerText = current;
}

function confirmAttendance() {
    const nameInput = document.getElementById('guest-name');
    const name = nameInput.value.trim();
    const adults = document.getElementById('qty-adults').innerText;
    const kids = document.getElementById('qty-kids').innerText;
    const errorMsg = document.getElementById('error-message');
    
    if (!name) {
        if (errorMsg) errorMsg.classList.remove('d-none');
        return;
    }

    // --- CONFIGURACIÓN DE WHATSAPP ---
    const telefono = "5491160212516"; // <--- REEMPLAZA CON TU NÚMERO (Código de país + número sin el +)
    const mensaje = `¡Hola! Confirmo mi asistencia al cumple de Zoe.%0A*Nombre:* ${name}%0A*Adultos:* ${adults}%0A*Menores:* ${kids}`;
    const urlWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;

    // 1. Guardar localmente
    localStorage.setItem('confirmado_zoe', 'true');
    localStorage.setItem('nombre_invitado', name);
    
    // 2. Mostrar mensaje de éxito en la web
    mostrarExitoDirecto(name);

    // 3. Abrir WhatsApp para enviar el mensaje real
    window.open(urlWhatsapp, '_blank');
}

function mostrarExitoDirecto(nombre) {
    const formContainer = document.getElementById('form-container');
    const successContainer = document.getElementById('success-container');
    const confirmedName = document.getElementById('confirmed-name');

    if (formContainer) formContainer.classList.add('d-none');
    if (successContainer) successContainer.classList.remove('d-none');
    if (confirmedName) confirmedName.innerText = nombre;
}