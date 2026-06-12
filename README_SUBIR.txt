PANEL MUNDIAL 2026 - LIVIANO CON BLOQUE DE ULTIMOS RESULTADOS

Archivos:
- index.html
- styles.css
- app.js
- scores.json

Cambios de esta versión:
- Agrega un bloque fijo "Últimos resultados".
- El bloque se llena con data.pastResults.
- Si data.pastResults está vacío, usa automáticamente los partidos de matches con status="finished".
- Si todavía no hay partidos terminados, muestra un mensaje limpio dentro del bloque.
- Mantiene próximo partido, en vivo, vista rápida y calendario compacto.
- Actualiza scores.json cada 1 minuto.
- Scroll automático del calendario cada 5 segundos.

Estructura para un resultado terminado dentro de scores.json:

{
  "id": "123",
  "status": "finished",
  "statusLabel": "FT",
  "group": "Grupo A - Fecha 1",
  "date": "12/06/2026",
  "home": "Equipo A",
  "away": "Equipo B",
  "homeScore": 2,
  "awayScore": 1,
  "homeLogo": "URL_LOGO",
  "awayLogo": "URL_LOGO"
}

Para GitHub Pages:
1. Sube los cuatro archivos al repo meteorpa/fixtures.
2. Usa en el panel principal:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=panel-liviano-365-02"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>
