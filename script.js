const defaultConfig = {
    nombre_cumpleanero: 'Zoe',
    fecha_fiesta: 'Sábado 15 de Julio',
    hora_fiesta: '4:00 PM',
    lugar_fiesta: 'Salón de Fiestas Luna',
    direccion_fiesta: 'Calle Principal #123',
    background_color: '#fdf2f8',
    font_family: 'Poppins',
    font_size: 16
};

// 1. Mover las variables globales al principio para asegurar disponibilidad
let allGuests = [];
let isLoading = false;
let counts = { adults: 0, kids: 0 };

// --- GESTIÓN DE DATOS ---
const dataHandler = {
    onDataChanged(data) {
        allGuests = data || [];
        updateGuestsCounter();
    }
};

function updateGuestsCounter() {
    const counter = document.getElementById('guests-counter');
    const countEl = document.getElementById('guest-count');
    if (counter && countEl && allGuests.length > 0) {
        counter.classList.remove('d-none');
        countEl.textContent = allGuests.length;
    }
}

// Función para sumar/restar
function changeQty(type, delta) {
    counts[type] = Math.max(0, counts[type] + delta);
    const element = document.getElementById(`qty-${type}`);
    if (element) element.textContent = counts[type];
}

// --- FUNCIÓN DE CONFIRMACIÓN CORREGIDA ---
async function confirmAttendance() {
    const nameInput = document.getElementById('guest-name');
    const name = nameInput?.value.trim();
    
    // 1. Validar nombre
    if (!name) {
        document.getElementById('error-message')?.classList.remove('d-none');
        return;
    }

    // 2. Configuración del mensaje
// 1. IMPORTANTE: Agregamos 54 y el 9 antes del 11 para Argentina
        const miTelefono = "5491127461954"; 

        const textoMensaje = `¡Hola! Soy *${name}*. Confirmo mi asistencia al cumple de ZOE. 🎉\n\n` +
                            `👥 *Adultos:* ${counts.adults}\n` +
                            `🧒 *Menores:* ${counts.kids}\n` +
                            `👨‍👩‍👧‍👦 *Total:* ${1 + counts.adults + counts.kids}`;

        // El resto del código para abrir la URL se mantiene igual:
        const url = `https://wa.me/${miTelefono}?text=${encodeURIComponent(textoMensaje)}`;
        window.open(url, '_blank');

    // 4. Intentar guardar en el SDK (opcional, por si quieres tener la lista también en la web)
    if (window.dataSdk) {
        try {
            await window.dataSdk.create({
                nombre: name,
                adultos: counts.adults,
                menores: counts.kids
            });
        } catch (e) { console.log("SDK no disponible, enviando solo por WA"); }
    }

    // 5. Mostrar éxito en la pantalla y ABRIR WHATSAPP
    showSuccessMessage(name);
    
    // Abrir en pestaña nueva
    window.open(url, '_blank');
}
function showSuccessMessage(name) {
    document.getElementById('form-container').classList.add('d-none');
    document.getElementById('success-container').classList.remove('d-none');
    document.getElementById('confirmed-name').textContent = name;
    createConfetti();
}

function resetButton() {
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span class="position-relative z-index-1">¡Confirmar Asistencia! 🎉</span><div class="shimmer"></div>';
    }
}

// --- CONFIGURACIÓN Y SDK ---
async function onConfigChange(config) {
    if (!config) return;
    
    // Cambiamos el texto pero NO el estilo de fuente aquí para que no rompa el CSS
    const nombreEl = document.getElementById('nombre-cumpleanero');
    if (nombreEl) {
        nombreEl.textContent = config.nombre_cumpleanero || defaultConfig.nombre_cumpleanero;
    }
    
    document.getElementById('fecha').textContent = config.fecha_fiesta || defaultConfig.fecha_fiesta;
    document.getElementById('hora').textContent = config.hora_fiesta || defaultConfig.hora_fiesta;
    document.getElementById('lugar').textContent = config.lugar_fiesta || defaultConfig.lugar_fiesta;
    document.getElementById('direccion').textContent = config.direccion_fiesta || defaultConfig.direccion_fiesta;
    
    // El fondo sí lo dejamos dinámico
    const app = document.getElementById('app');
    if (app) {
        const bgColor = config.background_color || defaultConfig.background_color;
        app.style.background = `linear-gradient(135deg, ${bgColor} 0%, #fae8ff 50%, #e0e7ff 100%)`;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (window.elementSdk) {
        window.elementSdk.init({
            defaultConfig,
            onConfigChange,
            mapToCapabilities: (config) => ({ recolorables: [], fontEditable: {}, fontSizeable: {} }),
            mapToEditPanelValues: (config) => new Map(Object.entries(config))
        });
    }
    
    if (window.dataSdk) {
        try {
            await window.dataSdk.init(dataHandler);
        } catch (e) {
            console.error("Error inicializando Data SDK:", e);
        }
    }
});

function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const colors = ['#ec4899', '#a855f7', '#6366f1', '#fbbf24'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.position = 'absolute';
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear forwards`;
        container.appendChild(confetti);
    }
}
function createOneBalloon() {
    const container = document.getElementById('balloons-container');
    if (!container) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    const colors = ['#ffc1e3', '#b28dff', '#85e3ff', '#fff9ae', '#aff8db', '#ff9aa2'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Tamaño y posición aleatoria
    const size = Math.random() * (70 - 40) + 40;
    const startX = Math.random() * 100;
    const duration = Math.random() * (15 - 10) + 10; // Más lento = más elegante
    
    balloon.style.left = `${startX}%`;
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;
    balloon.style.backgroundColor = color;
    balloon.style.color = color; // Para el triangulito del nudo
    balloon.style.animationDuration = `${duration}s`;
    
    // Efecto de profundidad aleatorio (algunos borrosos)
    if (Math.random() > 0.7) {
        balloon.style.filter = 'blur(2px)';
        balloon.style.zIndex = -2;
    }

    container.appendChild(balloon);

    // Borrar el globo del código cuando termine de subir para no saturar la PC
    setTimeout(() => {
        balloon.remove();
    }, duration * 1000);
}

// Iniciar la lluvia de globos
function startBalloonRain() {
    // Crear globos de inmediato para empezar
    for(let i=0; i < 10; i++) {
        setTimeout(createOneBalloon, Math.random() * 5000);
    }
    
    // Seguir creando globos infinitamente cada 100ms
    setInterval(createOneBalloon, 100);
}

// Llamar al inicio
document.addEventListener('DOMContentLoaded', () => {
    startBalloonRain();
});

