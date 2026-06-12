const SCROLL_MS = 5000;
const PAGE_RELOAD_MS = 120000;
const SCROLL_STEP = 105;

let lastSignature = "";
let resultsTabAttempted = false;

function qs(root, selector) {
  return root ? root.querySelector(selector) : null;
}

function qsa(root, selector) {
  return root ? [...root.querySelectorAll(selector)] : [];
}

function txt(el) {
  return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function getSrc(img) {
  return img?.getAttribute("src") || "";
}

function fmtNow() {
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
  if (el) el.textContent = value || "--";
}

function setImg(id, src) {
  const el = document.getElementById(id);
  if (!el) return;
  el.src = src || "";
  el.style.visibility = src ? "visible" : "hidden";
}

function parseDateFromText(value) {
  const match = String(value || "").match(/\d{1,2}\/\d{1,2}\/\d{4}/);
  return match ? match[0] : "";
}

/*
  Punto crítico:
  NO se interpreta "15:00" ni "0:00" como resultado.
  Solo se considera marcador real si viene con guion: "2 - 0", "2-0" o "2–0".
*/
function parseCenterValue(value, fullText) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();

  const scoreMatch = clean.match(/^(\d{1,2})\s*[-–]\s*(\d{1,2})$/);
  if (scoreMatch) {
    const liveText = /EN VIVO|LIVE|HT|ST|1T|2T|\d{1,3}'/i.test(fullText || "");
    return {
      status: liveText ? "live" : "finished",
      homeScore: Number(scoreMatch[1]),
      awayScore: Number(scoreMatch[2]),
      display: `${scoreMatch[1]} - ${scoreMatch[2]}`
    };
  }

  const timeMatch = clean.match(/^([01]?\d|2[0-3]):[0-5]\d$/);
  if (timeMatch) {
    return {
      status: "scheduled",
      display: clean
    };
  }

  return {
    status: "scheduled",
    display: clean || "--"
  };
}

function clickResultsTabIfAvailable() {
  if (resultsTabAttempted) return;
  const source = document.getElementById("sourceResults");
  if (!source) return;

  const candidates = qsa(source, "button, a, div, span").filter(el => {
    const label = txt(el).toLowerCase();
    return label === "resultados" || label.includes("resultados");
  });

  const tab = candidates[0];
  if (!tab) return;

  resultsTabAttempted = true;

  try {
    tab.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  } catch (e) {
    console.warn("No se pudo activar pestaña Resultados:", e);
  }
}

function matchLabel(m) {
  if (!m) return "Sin información disponible";
  if (m.status === "live") return `${m.home} ${m.homeScore ?? 0} - ${m.awayScore ?? 0} ${m.away} · ${m.minute || "EN VIVO"}`;
  if (m.status === "finished") return `${m.home} ${m.homeScore ?? 0} - ${m.awayScore ?? 0} ${m.away} · FT`;
  return `${m.home} vs ${m.away} · ${m.date} ${m.time}`;
}

function scoreText(m) {
  if (m.status === "live" || m.status === "finished") return `${m.homeScore ?? 0} - ${m.awayScore ?? 0}`;
  return m.time || "--:--";
}

function stateText(m) {
  if (m.status === "live") return m.minute || "EN VIVO";
  if (m.status === "finished") return "FT";
  return m.date || "Programado";
}

function extractMatchesFromSource(sourceId) {
  const source = document.getElementById(sourceId);
  if (!source) return [];

  const groupNodes = qsa(source, '[class*="entity-scores-widget-group_container"]')
    .filter(group => qsa(group, '[class*="game-card_container"]').length > 0);

  const matches = [];

  groupNodes.forEach(group => {
    const groupTitle = txt(qs(group, '[class*="entity-scores-widget-group_header_title"]')) || "Mundial";
    const groupDate = txt(qs(group, '[class*="entity-scores-widget-group_header_date"]')) || parseDateFromText(txt(group));

    const cards = qsa(group, '[class*="game-card_container"]');
    cards.forEach(card => {
      const nameNodes = qsa(card, '[class*="game-card-competitor_name"]')
        .map(node => txt(node))
        .filter(Boolean);

      const home = nameNodes[0] || "";
      const away = nameNodes[nameNodes.length - 1] || "";
      if (!home || !away || home === away) return;

      const logoNodes = qsa(card, 'img[class*="game-card-competitor_logo"]');
      const homeLogo = getSrc(logoNodes[0]);
      const awayLogo = getSrc(logoNodes[logoNodes.length - 1]);

      const scoreNode = qs(card, '[class*="game-card-center_center_score"]');
      const rawCenter = txt(scoreNode);
      const fullText = txt(card);
      const parsed = parseCenterValue(rawCenter, fullText);

      const href = qs(card, "a[href*='#id=']")?.getAttribute("href") || "";
      const id = href.match(/#id=(\d+)/)?.[1] || `${home}-${away}-${groupDate}-${rawCenter}`;

      const bottom = txt(qs(card, '[class*="game-card_bottom_view"]'));
      const minute = fullText.match(/\d{1,3}'|HT|ST|1T|2T|EN VIVO|LIVE/i)?.[0] || "";

      matches.push({
        id,
        source: sourceId,
        group: groupTitle,
        date: groupDate,
        time: parsed.status === "scheduled" ? parsed.display : "",
        status: parsed.status,
        statusLabel: parsed.status === "finished" ? "FT" : "",
        minute: parsed.status === "live" ? (minute || "EN VIVO") : "",
        home,
        away,
        homeScore: parsed.homeScore,
        awayScore: parsed.awayScore,
        homeLogo,
        awayLogo,
        note: bottom
      });
    });
  });

  return matches;
}

function extractFrom365Widgets() {
  clickResultsTabIfAvailable();

  const fixtures = extractMatchesFromSource("sourceFixtures");
  const results = extractMatchesFromSource("sourceResults");

  return dedupe([...results, ...fixtures]);
}

function dedupe(matches) {
  const map = new Map();

  for (const m of matches) {
    const key = m.id || `${m.home}|${m.away}|${m.date}|${m.time}`;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, m);
      continue;
    }

    // Priorizar registros con marcador real por sobre registros programados.
    if (existing.status === "scheduled" && (m.status === "finished" || m.status === "live")) {
      map.set(key, m);
    }
  }

  return [...map.values()];
}

function groupMatches(matches) {
  const groups = new Map();

  for (const m of matches.filter(m => m.status !== "finished")) {
    const key = `${m.group || "Mundial"}__${m.date || ""}`;
    if (!groups.has(key)) groups.set(key, { group: m.group || "Mundial", date: m.date || "", matches: [] });
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

function renderPastRow(m) {
  return `
    <div class="past-row">
      <div class="past-team">
        <img src="${m.homeLogo || ""}" alt="">
        <strong>${m.home || "--"}</strong>
      </div>
      <div class="past-score">
        <strong>${m.homeScore ?? 0} - ${m.awayScore ?? 0}</strong>
        <span>${m.statusLabel || "FT"}</span>
      </div>
      <div class="past-team away">
        <img src="${m.awayLogo || ""}" alt="">
        <strong>${m.away || "--"}</strong>
      </div>
    </div>
  `;
}

function renderPastResults(matches) {
  const container = document.getElementById("pastResultsList");
  const count = document.getElementById("pastCount");
  const past = matches.filter(m => m.status === "finished").slice(0, 3);

  if (count) count.textContent = past.length;

  if (!past.length) {
    container.innerHTML = `
      <div class="past-empty">
        Aún no hay resultados finalizados visibles en el widget. No se convertirán horarios en marcadores.
      </div>
    `;
    return;
  }

  container.innerHTML = past.map(renderPastRow).join("");
}

function renderList(matches) {
  const list = document.getElementById("matchesList");
  const groups = groupMatches(matches);

  if (!groups.length) {
    list.innerHTML = `<div class="empty">Esperando próximos partidos desde 365Scores...</div>`;
    return;
  }

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

function render(matches) {
  const signature = JSON.stringify(matches.map(m => [m.id, m.status, m.homeScore, m.awayScore, m.time]));
  if (signature === lastSignature) return;
  lastSignature = signature;

  document.getElementById("updateLabel").textContent = "Act. " + fmtNow();

  const live = matches.find(m => m.status === "live");
  const next = matches.find(m => m.status === "scheduled") || matches.find(m => m.status !== "finished") || matches[0];

  if (next) {
    setText("nextGroup", next.group);
    setText("nextHome", next.home);
    setText("nextAway", next.away);
    setText("nextDate", next.date);
    setText("nextTime", next.time || scoreText(next));
    setImg("nextHomeLogo", next.homeLogo);
    setImg("nextAwayLogo", next.awayLogo);
  }

  const liveCard = document.getElementById("liveCard");
  if (live) {
    liveCard.style.opacity = "1";
    setText("liveStatus", live.minute || "EN VIVO");
    setText("liveHome", live.home);
    setText("liveAway", live.away);
    setText("liveScore", scoreText(live));
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

  document.getElementById("countPill").textContent = matches.filter(m => m.status !== "finished").length;

  renderPastResults(matches);
  renderList(matches);
}

function tryExtractAndRender() {
  const matches = extractFrom365Widgets();
  if (matches.length) render(matches);
  else document.getElementById("updateLabel").textContent = "Act. " + fmtNow();
}

function observeWidgets() {
  ["sourceFixtures", "sourceResults"].forEach(id => {
    const source = document.getElementById(id);
    if (!source) return;

    const observer = new MutationObserver(() => {
      window.clearTimeout(window.__parseTimer);
      window.__parseTimer = window.setTimeout(tryExtractAndRender, 350);
    });

    observer.observe(source, { childList: true, subtree: true, characterData: true });
  });
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

observeWidgets();

setTimeout(tryExtractAndRender, 1500);
setTimeout(tryExtractAndRender, 3500);
setTimeout(tryExtractAndRender, 7000);
setInterval(tryExtractAndRender, 10000);
setInterval(autoScroll, SCROLL_MS);

setTimeout(() => {
  window.location.reload();
}, PAGE_RELOAD_MS);
