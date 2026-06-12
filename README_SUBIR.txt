PANEL MUNDIAL 2026 - LIVIANO CON ESTILO 365

Archivos:
- index.html
- styles.css
- app.js
- scores.json

Funcionamiento:
- No usa iframe pesado ni widget completo.
- La pantalla lee scores.json cada 1 minuto.
- El scroll de la lista avanza cada 5 segundos.
- El diseño mantiene el estilo de tarjetas trabajado: encabezado oscuro, cards, grupos, banderas y marcador central.

Para GitHub Pages:
1. Sube los cuatro archivos al repo meteorpa/fixtures.
2. Usa en el panel principal:

<iframe
  id="fixtures-iframe"
  class="fixtures-frame"
  src="https://meteorpa.github.io/fixtures/?v=panel-liviano-365-01"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>

Importante:
scores.json es el archivo que debe actualizar el agente cada minuto.
Mientras no exista agente, queda con datos base del calendario.
