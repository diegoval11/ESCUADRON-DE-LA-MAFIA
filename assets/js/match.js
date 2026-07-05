async function startMatch() {
  const area = document.getElementById('matchArea');
  area.innerHTML = '<p class="subtitle">Preparando pares para tu nivel...</p>';

  let matchPairs;
  try {
    matchPairs = await fetchMatchPairs(6);
  } catch (err) {
    showQuestionLoadError(area, err.message, () => startMatch());
    return;
  }

  if (!matchPairs.length) {
    area.innerHTML = `
      <p class="subtitle">No hay pares de emparejamiento en tu rango por ahora.</p>
      <button class="btn-primary" type="button" onclick="backToMenu()">Volver al menú</button>`;
    return;
  }

  let matched = 0;
  const shuffledDefs = [...matchPairs].sort(() => Math.random() - 0.5);

  area.innerHTML = `
    <div class="match-progress">Arrastra cada término a su definición correcta · ${matchPairs.length} pares</div>
    <div class="match-container">
      <div id="terms">
        ${matchPairs.map(p => `<div class="match-item" draggable="true" data-term="${escapeHtml(p.term)}">${escapeHtml(p.term)}</div>`).join('')}
      </div>
      <div id="defs">
        ${shuffledDefs.map(p => `<div class="match-dropzone" data-answer="${escapeHtml(p.term)}">${escapeHtml(p.def)}</div>`).join('')}
      </div>
    </div>`;

  area.querySelectorAll('.match-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.dataset.term);
    });
  });

  area.querySelectorAll('.match-dropzone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('over');
      if (zone.classList.contains('filled')) return;

      const term = e.dataTransfer.getData('text/plain');
      const draggedEl = [...area.querySelectorAll('.match-item')].find(el => el.dataset.term === term);

      if (term === zone.dataset.answer) {
        zone.classList.add('filled');
        const defText = zone.textContent;
        zone.textContent = '✅ ' + term + ' → ' + defText;
        draggedEl.classList.add('matched');
        draggedEl.setAttribute('draggable', 'false');
        SoundFX.correct();
        matched++;
        if (matched === matchPairs.length) {
          setTimeout(() => resultScreen(area, matched * 15), 700);
        }
      } else if (draggedEl) {
        QuizFeedback.matchWrong(zone, draggedEl);
      }
    });
  });
}
