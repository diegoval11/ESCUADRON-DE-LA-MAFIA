const USERNAME = window.CODEQUEST?.username ?? '';
const DAILY_STORAGE_KEY = `codequest_daily_${USERNAME}`;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadDailyState() {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date !== todayKey()) {
      localStorage.removeItem(DAILY_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveDailyState(state) {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify({ ...state, date: todayKey() }));
}

function updateDailyCardUI() {
  const badge = document.getElementById('dailyBadge');
  const hint = document.getElementById('dailyCardHint');
  const card = document.getElementById('dailyQuizCard');
  if (!badge || !hint) return;

  const state = loadDailyState();
  if (state?.completed) {
    badge.textContent = 'Completado';
    badge.classList.add('done');
    hint.textContent = 'Vuelve mañana para un nuevo reto';
    card.style.opacity = '0.85';
  } else if (state?.questions?.length && !state.completed) {
    badge.textContent = 'En progreso';
    hint.textContent = `Pregunta ${state.current + 1} de ${state.questions.length} · Toca para continuar`;
  } else {
    badge.textContent = 'Reto diario';
    badge.classList.remove('done');
    hint.textContent = '8 preguntas · 1 oportunidad al día';
    card.style.opacity = '1';
  }
}

function renderQuizSegments(total, current, results) {
  let html = '';
  for (let i = 0; i < total; i++) {
    let cls = 'quiz-segment';
    if (i < current) cls += results[i] ? ' is-done' : ' is-wrong';
    else if (i === current) cls += ' is-current';
    html += `<div class="${cls}"><div class="quiz-segment-fill"></div></div>`;
  }
  return html;
}

function showDailyCompleteScreen(area) {
  SoundFX.dailyDone();
  area.innerHTML = `
    <div class="daily-hero">
      <div class="daily-hero-icon">✓</div>
      <h3>Reto diario completado</h3>
      <p class="subtitle">Ya jugaste tu quiz de hoy. Vuelve mañana para seguir progresando.</p>
      <button class="btn-primary" type="button" id="dailyDoneBtn">Volver al menú</button>
    </div>`;
  document.getElementById('dailyDoneBtn').onclick = backToMenu;
}

async function startQuiz() {
  const area = document.getElementById('quizArea');
  const panel = document.getElementById('panel-quiz');
  SoundFX.click();

  const saved = loadDailyState();
  if (saved?.completed) {
    showDailyCompleteScreen(area);
    return;
  }

  let quizQuestions = saved?.questions || null;
  let current = saved?.current || 0;
  let score = saved?.score || 0;
  const results = saved?.results || [];
  let lifelines = saved?.lifelines || { fiftyFifty: false, eliminate: false };
  let currentStrikes = saved?.currentStrikes || [];
  let answered = false;

  function getActiveWrongElements(questionItem) {
    return [...area.querySelectorAll('.quiz-option')].filter(el => {
      const i = parseInt(el.dataset.i, 10);
      return i !== questionItem.correct && !el.classList.contains('is-struck');
    });
  }

  function countSelectableOptions() {
    return area.querySelectorAll('.quiz-option:not(.is-struck)').length;
  }

  function strikeOption(el, index) {
    if (el.classList.contains('is-struck')) return;
    el.classList.add('is-struck');
    if (!currentStrikes.includes(index)) currentStrikes.push(index);
  }

  function restoreStrikes() {
    currentStrikes.forEach(i => {
      const el = area.querySelector(`.quiz-option[data-i="${i}"]`);
      if (el) el.classList.add('is-struck');
    });
  }

  if (!quizQuestions?.length) {
    area.innerHTML = '<p class="subtitle">Preparando tu reto diario...</p>';
    try {
      quizQuestions = await fetchQuestions('quiz', 8, true);
    } catch (err) {
      if (err.code === 'daily_done') {
        saveDailyState({ completed: true, questions: [], current: 0, score: 0, results: [], lifelines });
        updateDailyCardUI();
        showDailyCompleteScreen(area);
        return;
      }
      showQuestionLoadError(area, err.message, () => startQuiz());
      return;
    }
    if (!quizQuestions.length) {
      area.innerHTML = `<p class="subtitle">No hay preguntas disponibles hoy.</p><button class="btn-primary" type="button" onclick="backToMenu()">Volver</button>`;
      return;
    }
    current = 0;
    score = 0;
    lifelines = { fiftyFifty: false, eliminate: false };
    saveDailyState({ completed: false, questions: quizQuestions, current, score, results: [], lifelines });
  }

  function persistProgress() {
    saveDailyState({ completed: false, questions: quizQuestions, current, score, results, lifelines, currentStrikes });
    updateDailyCardUI();
  }

  async function finishQuiz() {
    saveDailyState({ completed: true, questions: quizQuestions, current, score, results, lifelines });
    updateDailyCardUI();
    SoundFX.complete();
    const ids = quizQuestions.map(q => q.id);
    try { await markQuestionsComplete(ids); } catch (_) {}

    area.innerHTML = `
      <div class="result-box">
        <div class="big-score">+${score} pts</div>
        <div class="msg">Reto diario completado · Vuelve mañana</div>
        <button class="btn-primary" id="doneBtn">Guardar y volver</button>
      </div>`;

    document.getElementById('doneBtn').onclick = async (e) => {
      const btn = e.currentTarget;
      if (btn.classList.contains('btn-loading')) return;
      btn.classList.add('btn-loading');
      btn.disabled = true;
      const success = await saveScore(score);
      if (success) backToMenu();
      else {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
      }
    };
  }

  function applyFiftyFifty(item) {
    if (lifelines.fiftyFifty || answered) return;
    const active = getActiveWrongElements(item);
    const toStrike = Math.min(2, active.length - 1);
    if (toStrike <= 0) return;
    const shuffled = [...active].sort(() => Math.random() - 0.5);
    shuffled.slice(0, toStrike).forEach(el => strikeOption(el, parseInt(el.dataset.i, 10)));
    lifelines.fiftyFifty = true;
    SoundFX.lifeline();
    persistProgress();
    updateLifelineButtons(item);
  }

  function applyEliminate(item) {
    if (lifelines.eliminate || answered) return;
    if (countSelectableOptions() <= 2) return;
    const active = getActiveWrongElements(item);
    if (!active.length) return;
    const pick = active[Math.floor(Math.random() * active.length)];
    strikeOption(pick, parseInt(pick.dataset.i, 10));
    lifelines.eliminate = true;
    SoundFX.lifeline();
    persistProgress();
    updateLifelineButtons(item);
  }

  function updateLifelineButtons(item) {
    const b5050 = document.getElementById('btn5050');
    const bElim = document.getElementById('btnElim');
    if (!b5050 || !bElim || !item) return;
    const activeWrong = getActiveWrongElements(item).length;
    const selectable = countSelectableOptions();
    b5050.disabled = !(!lifelines.fiftyFifty && !answered && activeWrong > 1);
    bElim.disabled = !(!lifelines.eliminate && !answered && activeWrong > 0 && selectable > 2);
    b5050.classList.toggle('is-used', lifelines.fiftyFifty);
    bElim.classList.toggle('is-used', lifelines.eliminate);
  }

  function render() {
    if (current >= quizQuestions.length) {
      finishQuiz();
      return;
    }

    answered = false;
    const item = quizQuestions[current];

    area.innerHTML = `
      <div class="quiz-top-bar">
        <button type="button" class="quiz-close" id="quizPauseBtn" aria-label="Pausar y volver">×</button>
        <div class="quiz-segments">${renderQuizSegments(quizQuestions.length, current, results)}</div>
      </div>
      <div class="lifeline-bar">
        <button type="button" class="lifeline-btn" id="btn5050">50 / 50</button>
        <button type="button" class="lifeline-btn" id="btnElim">Quitar 1 incorrecta</button>
      </div>
      <div class="quiz-question">${escapeHtml(item.q)}</div>
      <div class="quiz-options" id="quizOpts">
        ${item.options.map((opt, i) => `<div class="quiz-option" data-i="${i}">${escapeHtml(opt)}</div>`).join('')}
      </div>
      <div class="explanation" id="expBox"></div>
    `;

    document.getElementById('quizPauseBtn').onclick = () => { persistProgress(); backToMenu(); };
    document.getElementById('btn5050').onclick = () => applyFiftyFifty(item);
    document.getElementById('btnElim').onclick = () => applyEliminate(item);
    restoreStrikes();
    updateLifelineButtons(item);

    area.querySelectorAll('.quiz-option').forEach(el => {
      el.onclick = () => {
        if (answered || el.classList.contains('is-struck')) return;
        answered = true;
        SoundFX.click();
        const i = parseInt(el.dataset.i, 10);
        const isCorrect = i === item.correct;
        const correctEl = area.querySelector(`[data-i="${item.correct}"]`);
        area.querySelectorAll('.quiz-option:not(.is-struck)').forEach(o => o.classList.add('disabled'));
        updateLifelineButtons(item);

        if (isCorrect) {
          el.classList.add('correct');
          score += 10;
          SoundFX.correct();
          QuizFeedback.correct(el);
        } else {
          el.classList.add('incorrect');
          correctEl?.classList.add('correct');
          SoundFX.wrong();
          QuizFeedback.wrong(el, correctEl, panel);
        }

        results[current] = isCorrect;
        persistProgress();

        const expBox = document.getElementById('expBox');
        expBox.className = 'explanation show ' + (isCorrect ? 'exp-correct' : 'exp-incorrect');
        expBox.innerHTML = `<strong>${isCorrect ? 'Correcto' : 'Incorrecto'}</strong>${escapeHtml(item.explain)}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-primary';
        nextBtn.style.marginTop = '14px';
        nextBtn.textContent = current + 1 < quizQuestions.length ? 'Continuar' : 'Ver resultado';
        nextBtn.onclick = () => {
          SoundFX.click();
          currentStrikes = [];
          current++;
          render();
        };
        area.appendChild(nextBtn);
      };
    });
  }

  render();
}

updateDailyCardUI();
