INSTRUCCIONES

Sube estos archivos al repositorio:
https://github.com/meteorpa/fixtures

- index.html
- styles.css
- app.js

Luego usa este iframe en el panel principal:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=365-estable-scroll5-01"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>

CAMBIOS

- Versión estable: no manipula ni oculta elementos internos del widget.
- Usa el widget oficial de 365Scores tal como se entrega.
- Scroll automático cada 5 segundos.
- Recarga completa del iframe cada 1 minuto para actualizar resultados.
- Mantiene formato 550 x 1030.

NOTA

La versión anterior no mostraba nada porque el intento de ocultar la pestaña interna del widget podía terminar ocultando el contenedor que 365Scores usa para renderizar el contenido. Esta versión prioriza estabilidad.
