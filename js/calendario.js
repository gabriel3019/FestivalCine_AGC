document.addEventListener("DOMContentLoaded", () => {

    const calendarGrid = document.getElementById("calendarGrid");
    const monthDisplay = document.getElementById("monthDisplay");
    const eventModal = document.getElementById("eventModal");
    const modalBody = document.getElementById("modalBody");
    const overlay = document.getElementById("overlay");
    const closeButton = document.querySelector(".close-button");

    let currentDate = new Date();
    let eventos = [];

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // ===================== CARGAR EVENTOS =====================
    async function cargarEventos() {
        try {
            const res = await fetch("../php/acciones/eventos.php");
            const data = await res.json();
            eventos = data.success ? data.eventos : [];
            renderCalendar();
        } catch (error) {
            console.error("Error cargando eventos:", error);
            eventos = [];
            renderCalendar();
        }
    }

    // ===================== RENDER CALENDAR (CLAVE) =====================
    function renderCalendar() {
        calendarGrid.innerHTML = "";

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Título del mes
        monthDisplay.textContent = new Intl.DateTimeFormat('es-ES', {
            month: 'long',
            year: 'numeric'
        }).format(currentDate);

        // Encabezados de días
        diasSemana.forEach(dia => {
            const headerDiv = document.createElement("div");
            headerDiv.className = "day-header";
            headerDiv.textContent = dia;
            calendarGrid.appendChild(headerDiv);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Celdas vacías
        for (let i = 0; i < adjustedFirstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "calendar-day empty";
            calendarGrid.appendChild(empty);
        }

        // Días del mes
        const hoy = new Date();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.className = "calendar-day";

            // Marcar hoy
            if (
                day === hoy.getDate() &&
                month === hoy.getMonth() &&
                year === hoy.getFullYear()
            ) {
                dayDiv.classList.add("today");
            }

            dayDiv.innerHTML = `<span class="day-number">${day}</span>`;

            const fechaKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const eventosDelDia = eventos.filter(e => e.fecha === fechaKey);

            eventosDelDia.forEach(ev => {
                const tag = document.createElement("div");
                tag.className = "event-tag";
                tag.textContent = ev.nombre;
                tag.onclick = (e) => {
                    e.stopPropagation();
                    mostrarDetalle(ev);
                };
                dayDiv.appendChild(tag);
            });

            calendarGrid.appendChild(dayDiv);
        }
    }

    // ===================== MODAL =====================
    function mostrarDetalle(ev) {
        modalBody.innerHTML = `
            <h3>${ev.nombre}</h3>
            <p><strong>📅 Fecha:</strong> ${ev.fecha_formateada || ev.fecha}</p>
            <p><strong>📍 Lugar:</strong> ${ev.lugar || 'Por confirmar'}</p>
            <p><strong>🕐 Horario:</strong> ${ev.hora_inicio_formateada || ev.hora_inicio} - ${ev.hora_fin_formateada || ev.hora_fin}</p>
            <p><strong>🏷️ Tipo:</strong> ${ev.tipo_evento || 'Evento'}</p>
            <p>${ev.descripcion || 'Sin descripción disponible.'}</p>
            ${ev.imagen ? `<img src="${ev.imagen}" alt="Imagen del evento" onerror="this.style.display='none'">` : ''}
        `;

        eventModal.classList.remove("oculto");
        overlay.classList.remove("oculto");
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        eventModal.classList.add("oculto");
        overlay.classList.add("oculto");
        document.body.style.overflow = '';
    }

    // ===================== EVENTOS =====================
    if (closeButton) closeButton.onclick = cerrarModal;
    if (overlay) overlay.onclick = cerrarModal;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !eventModal.classList.contains('oculto')) {
            cerrarModal();
        }
    });

    document.getElementById("prevMonth").onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };

    document.getElementById("nextMonth").onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };

    // ===================== INICIO =====================
    cargarEventos();
});
