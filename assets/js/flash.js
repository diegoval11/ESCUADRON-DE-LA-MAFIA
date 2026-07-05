const flashcards = [
  { front: 'Variable', back: 'Espacio de memoria que almacena un valor que puede cambiar.' },
  { front: 'Función', back: 'Bloque de código reutilizable que realiza una tarea específica.' },
  { front: 'Bucle (loop)', back: 'Estructura que repite un bloque de código varias veces.' },
  { front: 'Condicional', back: 'Estructura que ejecuta código según si una condición es verdadera o falsa.' },
  { front: 'Array', back: 'Colección ordenada de valores almacenados en una sola variable.' },
  { front: 'API', back: 'Conjunto de reglas que permite que dos programas se comuniquen entre sí.' },
  { front: 'Base de datos', back: 'Sistema organizado para almacenar y consultar información.' },
  { front: 'Debugging', back: 'Proceso de encontrar y corregir errores en el código.' },
];

function startFlash() {
  let current = 0, known = 0;
  const area = document.getElementById('flashArea');

  function renderIntro() {
    area.innerHTML = `
      <div class="flash-intro">
        <div class="flash-intro-icon">🗂️</div>
        <h3>Flashcards — Memoriza conceptos</h3>
        <p class="subtitle">Repasa conceptos de programación uno por uno, a tu propio ritmo.</p>
        <ol class="flash-intro-steps">
          <li>Verás una tarjeta con un concepto (por ejemplo, "Variable").</li>
          <li>Tócala para voltearla y descubrir su definición.</li>
          <li>Marca si <strong>ya lo sabías</strong> o si quieres <strong>repasarlo</strong>.</li>
        </ol>
        <p class="flash-intro-tip">💡 Sé honesto contigo mismo: la idea es identificar qué conceptos ya dominas y cuáles necesitas reforzar, no solo conseguir puntos rápido.</p>
        <button class="btn-primary" id="startFlashBtn">Comenzar</button>
      </div>`;
    document.getElementById('startFlashBtn').onclick = () => render();
  }

  function render() {
    if (current >= flashcards.length) {
      resultScreen(area, known * 10);
      return;
    }
    const card = flashcards[current];
    area.innerHTML = `
      <div class="flash-progress">Tarjeta ${current + 1} de ${flashcards.length}</div>
      <div class="flashcard-scene">
        <div class="flashcard" id="fc">
          <div class="flash-face flash-front">${escapeHtml(card.front)}</div>
          <div class="flash-face flash-back">${escapeHtml(card.back)}</div>
        </div>
      </div>
      <div class="flash-actions">
        <button class="btn-review" id="btnReview">Repasar</button>
        <button class="btn-know" id="btnKnow">Ya lo sé</button>
      </div>`;

    document.getElementById('fc').onclick = () => document.getElementById('fc').classList.toggle('flipped');
    document.getElementById('btnKnow').onclick = () => { known++; current++; render(); };
    document.getElementById('btnReview').onclick = () => { current++; render(); };
  }

  renderIntro();
}
