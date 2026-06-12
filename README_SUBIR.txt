INSTRUCCIONES

1. Sube estos archivos al repositorio:
   https://github.com/meteorpa/fixtures

   - index.html
   - styles.css
   - app.js

2. La página debería quedar disponible en:
   https://meteorpa.github.io/fixtures/

3. En el panel principal usa este iframe:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=365-live-01"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>

4. Esta versión usa el widget oficial de 365Scores:
   - Liga: Mundial / FIFA World Cup
   - Entity ID: 5930
   - Idioma: español
   - Recarga forzada: cada 1 minuto
   - Scroll automático: cada 45 segundos

NOTA:
Si la pantalla se ve pesada en la TV, cambia en app.js:
RELOAD_MS = 5 * 60 * 1000;
