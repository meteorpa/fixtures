PANEL MUNDIAL 2026 - 365SCORES SIN VISTA RÁPIDA

Cambios de esta versión:
- Se eliminó el bloque "Vista rápida" porque repetía la información del próximo partido.
- Se mantiene:
  - Próximo partido.
  - Partido en vivo.
  - Últimos resultados reales.
  - Lista de partidos y resultados.
  - Scroll automático cada 5 segundos.
  - Recarga de la página cada 1 minuto.
- No se inventan resultados.
- "15:00" y "0:00" se leen como horarios.
- Solo se considera resultado real si 365Scores entrega marcador con guion:
  2 - 0
  2-0
  2–0

Archivos:
- index.html
- styles.css
- app.js

Subir a GitHub Pages:
Sube estos 3 archivos al repo meteorpa/fixtures.

Iframe recomendado:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=365-auto-03"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>
