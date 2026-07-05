async function startTimed() {
  let current = 0, score = 0, timeLeft = 100;
  const area = document.getElementById('timedArea');
  const panel = document.getElementById('panel-timed');
  area.innerHTML = '<p class="subtitle">Cargando preguntas para tu nivel...</p>';

  let timedQuestions;
  try {
    timedQuestions = await fetchQuestions('timed', 8);
  } catch (err) {
    showQuestionLoadError(area, err.message, () => startTimed());
    return;
  }

  if (timedQuestions.length === 0) {
    area.innerHTML = `
      <p class="subtitle">No hay más preguntas contra reloj en tu rango por ahora.</p>
      <button class="btn-primary" type="button" onclick="backToMenu()">Volver al menú</button>`;
    return;
  }

  function render() {
    clearInterval(window.timedInterval);
    if (current >= timedQuestions.length) {
      resultScreen(area, score);
      return;
    }

    const item = timedQuestions[current];
    timeLeft = 100;
    area.innerHTML = `
      <div class="timed-score">Puntos: ${score} · Pregunta ${current + 1}/${timedQuestions.length}</div>
      <div class="timer-track"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>
      <div class="quiz-question">${escapeHtml(item.q)}</div>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<div class="quiz-option" data-i="${i}">${escapeHtml(opt)}</div>`).join('')}
      </div>`;

    window.timedInterval = setInterval(() => {
      timeLeft -= 2;
      const fill = document.getElementById('timerFill');
      if (fill) fill.style.width = timeLeft + '%';
      if (timeLeft <= 0) {
        clearInterval(window.timedInterval);
        SoundFX.wrong();
        current++;
        render();
      }
    }, 100);

    area.querySelectorAll('.quiz-option').forEach(el => {
      el.onclick = () => {
        clearInterval(window.timedInterval);
        const i = parseInt(el.dataset.i, 10);
        const correctEl = area.querySelector(`[data-i="${item.correct}"]`);
        if (i === item.correct) {
          el.classList.add('correct');
          score += 15;
          SoundFX.correct();
          QuizFeedback.correct(el);
        } else {
          el.classList.add('incorrect');
          correctEl?.classList.add('correct');
          SoundFX.wrong();
          QuizFeedback.wrong(el, correctEl, panel);
        }
        area.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
        setTimeout(() => { current++; render(); }, 700);
      };
    });
  }

  render();
}
