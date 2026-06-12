const DATA_URL = "scores.json";
const REFRESH_MS = 60 * 1000;
const SCROLL_MS = 5 * 1000;
const SCROLL_STEP = 105;

function fmtTime() {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
}

function setImg(id, src) {
  const el = document.getElementById(id);
  if (!el) return;
  el.src = src || "";
  el.style.visibility = src ? "visible" : "hidden";
}

function matchLabel(m) {
  if (!m) return "";
  if (m.status === "live") return `${m.home} ${m.homeScore ?? 0} - ${m.awayScore ?? 0} ${m.away} · ${m.minute || "EN VIVO"}`;
  if (m.status === "finished") return `${m.home} ${m.homeScore ?? 0} - ${m.awayScore ?? 0} ${m.away} · FT`;
  return `${m.home} vs ${m.away} · ${m.date} ${m.time}`;
}

function scoreText(m) {
  if (m.status === "live" || m.status === "finished") {
    return `${m.homeScore ?? 0} - ${m.awayScore ?? 0}`;
  }
  return m.time || "--:--";
}

function stateText(m) {
  if (m.status === "live") return m.minute || "EN VIVO";
  if (m.status === "finished") return "FT";
  return m.date || "Programado";
}

function groupMatches(matches) {
  const groups = new Map();
  for (const m of matches) {
    const key = `${m.group || "Mundial"}__${m.date || ""}`;
    if (!groups.has(key)) {
      groups.set(key, { group: m.group || "Mundial", date: m.date || "", matches: [] });
    }
    groups.get(key).matches.push(m);
  }
  return [...groups.values()];
}

function renderMatchRow(m) {
  return `
    <div class="match-row ${m.status === "live" ? "is-live" : ""}">
      <div class="row-team">
        <img src="${m.homeLogo || ""}" alt="">
        <strong>${m.home || "--"}</strong>
      </div>
      <div class="row-center">
        <div class="score">${scoreText(m)}</div>
        <div class="state">${stateText(m)}</div>
      </div>
      <div class="row-team away">
        <img src="${m.awayLogo || ""}" alt="">
        <strong>${m.away || "--"}</strong>
      </div>
    </div>
  `;
}

function renderList(matches) {
  const list = document.getElementById("matchesList");
  if (!list) return;

  if (!matches || !matches.length) {
    list.innerHTML = `<div class="empty">No hay partidos cargados en scores.json.</div>`;
    return;
  }

  const groups = groupMatches(matches);
  list.innerHTML = groups.map(g => `
    <section class="group-block">
      <div class="group-head">
        <strong>${g.group}</strong>
        <span>${g.date}</span>
      </div>
      ${g.matches.map(renderMatchRow).join("")}
    </section>
  `).join("");
}

function render(data) {
  const next = data.nextMatch || (data.matches || []).find(m => m.status === "scheduled");
  const live = data.liveMatch || (data.matches || []).find(m => m.status === "live");
  const matches = data.matches || [];

  document.getElementById("updateLabel").textContent = "Act. " + fmtTime();

  if (next) {
    setText("nextGroup", next.group);
    setText("nextHome", next.home);
    setText("nextAway", next.away);
    setText("nextDate", next.date);
    setText("nextTime", next.time);
    setImg("nextHomeLogo", next.homeLogo);
    setImg("nextAwayLogo", next.awayLogo);
  }

  const liveCard = document.getElementById("liveCard");
  if (live) {
    liveCard.style.opacity = "1";
    setText("liveStatus", live.minute || "EN VIVO");
    setText("liveHome", live.home);
    setText("liveAway", live.away);
    setText("liveScore", `${live.homeScore ?? 0} - ${live.awayScore ?? 0}`);
    setText("liveMinute", live.minute || "EN VIVO");
    setImg("liveHomeLogo", live.homeLogo);
    setImg("liveAwayLogo", live.awayLogo);
  } else {
    liveCard.style.opacity = "0.86";
    setText("liveStatus", "Sin partido en vivo");
    setText("liveHome", "Esperando");
    setText("liveAway", "próximo partido");
    setText("liveScore", "--");
    setText("liveMinute", "SIN VIVO");
    setImg("liveHomeLogo", "");
    setImg("liveAwayLogo", "");
  }

  const liveOrNext = live || next;
  document.getElementById("tickerText").textContent = liveOrNext ? matchLabel(liveOrNext) : "Sin información disponible.";
  document.getElementById("countPill").textContent = matches.length;
  renderList(matches);
}

async function loadData() {
  try {
    const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar scores.json");
    const data = await response.json();
    render(data);
  } catch (err) {
    console.error(err);
    document.getElementById("tickerText").textContent = "Error cargando scores.json. Revisa que el archivo esté en el repositorio.";
  }
}

function autoScroll() {
  const el = document.getElementById("scrollArea");
  if (!el) return;
  const maxScroll = el.scrollHeight - el.clientHeight;
  if (maxScroll <= 0) return;

  if (el.scrollTop + SCROLL_STEP >= maxScroll) {
    el.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    el.scrollBy({ top: SCROLL_STEP, behavior: "smooth" });
  }
}

loadData();
setInterval(loadData, REFRESH_MS);
setInterval(autoScroll, SCROLL_MS);
