PANEL MUNDIAL 2026 - 365SCORES SIN RESULTADOS INVENTADOS

Corrección aplicada:
- Se eliminó la interpretación incorrecta de horas como resultados.
- Ahora "15:00" y "0:00" se leen como horarios, nunca como marcador.
- Solo se considera resultado real si 365Scores entrega el centro del partido con guion:
  2 - 0
  2-0
  2–0

Fuentes:
- Se usa el widget entityScores de 365Scores como fuente automática.
- Se carga una segunda instancia oculta para intentar leer la pestaña Resultados.
- No existe ningún resultado cargado manualmente en el código.
- Si 365Scores no entrega un marcador real en el DOM, el panel NO inventa el resultado.

Sobre el widget entityStandings:
- Ese widget sirve para tabla de posiciones/grupos.
- No se usa para marcador de partidos porque "standings" no equivale a resultados de partidos.
- Si quieres agregar una sección visual de posiciones por grupo, se puede crear aparte usando:
  data-widget-type="entityStandings"

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
  src="https://meteorpa.github.io/fixtures/?v=365-auto-02"
  width="550"
  height="1030"
  frameborder="0"
  scrolling="no">
</iframe>
