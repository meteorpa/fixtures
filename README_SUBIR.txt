INSTRUCCIONES

1. Sube estos archivos al repositorio:
   https://github.com/meteorpa/fixtures

   - index.html
   - styles.css
   - app.js

2. La página quedará en:
   https://meteorpa.github.io/fixtures/

3. En el panel principal usa:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=365-resumen-scroll5-01"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>

CAMBIOS DE ESTA VERSION

- Mantiene el widget oficial de 365Scores.
- Deja un encabezado propio "Resumen".
- Oculta visualmente la barra interna Partidos / Resultados cuando el widget la inyecta.
- Scroll automático cada 5 segundos.
- Recarga automática completa del widget cada 1 minuto.
- Mantiene el tamaño 550 x 1030 px.

NOTA
365Scores no entrega, en el tag público, un parámetro documentado para fusionar pestañas internas.
Por eso esta versión lo resuelve visualmente: dejamos una sola vista "Resumen" y ocultamos la pestaña redundante.
