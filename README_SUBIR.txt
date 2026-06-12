PANEL MUNDIAL 2026 - AUTOMATICO DESDE WIDGET 365SCORES

Esta versión ya no usa scores.json manual.

Cómo funciona:
1. index.html carga el widget oficial de 365Scores fuera de la pantalla.
2. app.js observa el DOM renderizado por el widget.
3. Extrae grupos, fechas, equipos, logos, horarios y marcadores.
4. Renderiza todo con el diseño liviano estilo 365 que trabajamos.
5. Revisa cambios del widget cada 10 segundos.
6. Hace scroll automático cada 5 segundos.
7. Recarga la página completa cada 1 minuto para forzar actualización del widget.

Archivos:
- index.html
- styles.css
- app.js

Importante:
- Esta solución depende de que el widget de 365Scores renderice contenido accesible dentro del DOM de la página.
- Si 365Scores cambia las clases internas del widget, puede ser necesario ajustar los selectores en app.js.
- Si el widget pasa a renderizarse dentro de un iframe cross-origin cerrado, el navegador no permitirá leer su contenido y habrá que usar un agente externo con Playwright/Node o una API.

Subir a GitHub Pages:
Sube estos 3 archivos al repo meteorpa/fixtures.

Iframe recomendado en el panel principal:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=365-auto-01"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>
