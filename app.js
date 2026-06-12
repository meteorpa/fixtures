const SCROLL_MS = 5 * 1000;     // scroll automático cada 5 segundos
const REFRESH_MS = 60 * 1000;   // recarga completa cada 1 minuto
const SCROLL_STEP = 165;        // avance suave para TV

function nowCL() {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

function updateTime() {
  const el = document.getElementById("updated-at");
  if (el) el.textContent = "Act. " + nowCL();
}

function autoScroll() {
  const el = document.getElementById("widget-scroll");
  if (!el) return;

  const maxScroll = el.scrollHeight - el.clientHeight;
  if (maxScroll <= 0) return;

  if (el.scrollTop + SCROLL_STEP >= maxScroll) {
    el.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    el.scrollBy({ top: SCROLL_STEP, behavior: "smooth" });
  }
}

updateTime();

setInterval(updateTime, 1000);
setInterval(autoScroll, SCROLL_MS);

// Recarga la página completa del iframe. Es más estable que reinyectar el script del widget.
setTimeout(() => {
  window.location.href = window.location.pathname + "?v=" + Date.now();
}, REFRESH_MS);
