const WIDGET_ID = "a7755b1f-67df-4510-beea-cc2583660a40";
const RELOAD_MS = 60 * 1000;
const SCROLL_MS = 45 * 1000;
const SCROLL_STEP = 420;

function nowCL() {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

function setStatus(text) {
  document.getElementById("refresh-state").textContent = text;
  document.getElementById("updated-at").textContent = "Act. " + nowCL();
}

function inject365Widget() {
  const zone = document.getElementById("widget-zone");
  setStatus("Actualizando");

  zone.innerHTML = `
    <div
      data-widget-type="entityScores"
      data-entity-type="league"
      data-entity-id="5930"
      data-lang="es-es"
      data-widget-id="${WIDGET_ID}">
    </div>
    <div id="powered-by">
      Provisto por
      <a id="powered-by-link" href="https://www.365scores.com/es" target="_blank" rel="noopener">
        365Scores.com
      </a>
    </div>
  `;

  const oldScript = document.getElementById("scores365-widget-script");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.id = "scores365-widget-script";
  script.src = "https://widgets.365scores.com/main.js?v=" + Date.now();
  script.async = true;
  script.onload = () => setStatus("365Scores");
  script.onerror = () => setStatus("Error widget");
  document.body.appendChild(script);
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

inject365Widget();
setInterval(inject365Widget, RELOAD_MS);
setInterval(autoScroll, SCROLL_MS);
