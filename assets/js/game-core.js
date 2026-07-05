/**
 * Núcleo del hub de juegos: navegación, puntajes, desbloqueos.
 */
const CODE_UNLOCK_POINTS = window.CODEQUEST?.codeUnlockPoints ?? 300;
let codeUnlocked = Boolean(window.CODEQUEST?.codeUnlocked);

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function openGame(mode) {
  if ((mode === 'code' || mode === 'codeadv') && !codeUnlocked) {
    showLockedNotice();
    return;
  }
  document.getElementById('menuView').style.display = 'none';
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + mode).classList.add('active');
  if (mode === 'quiz') startQuiz();
  if (mode === 'flash') startFlash();
  if (mode === 'match') startMatch();
  if (mode === 'timed') startTimed();
  if (mode === 'code') startCode();
  if (mode === 'codeadv') startCodeAdvanced();
}

function showLockedNotice() {
  const wrap = document.getElementById('toastWrap');
  const toast = document.createElement('div');
  toast.className = 'toast toast-error';
  toast.innerHTML = `
    <div class="t-icon">🔒</div>
    <div class="t-text">
      <div class="t-title">Modo bloqueado</div>
      <div class="t-name">Programa al Gato se desbloquea con ${CODE_UNLOCK_POINTS} puntos</div>
    </div>`;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function backToMenu() {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('menuView').style.display = 'grid';
  clearInterval(window.timedInterval);
  refreshGameStats();
  if (typeof updateDailyCardUI === 'function') updateDailyCardUI();
}

function updateProgressUI(data) {
  document.getElementById('statPoints').textContent = data.points;
  document.getElementById('statLevel').textContent = data.level;
  document.getElementById('statStreak').textContent = '🔥 ' + data.streak;
  document.getElementById('progressLabel').textContent = data.pointsInLevel + '/100 pts';
  document.getElementById('progressFill').style.width = data.pointsInLevel + '%';

  const levelLabel = document.getElementById('levelProgressLabel');
  if (levelLabel) levelLabel.textContent = 'Nivel ' + data.level;

  if (!codeUnlocked && (data.points >= CODE_UNLOCK_POINTS || data.codeUnlocked)) {
    codeUnlocked = true;
    updateCodeUnlockCards();
    showUnlockToast();
  }
}

async function refreshGameStats() {
  if (!document.getElementById('statPoints')) return;
  try {
    const res = await fetch('get_user_stats.php');
    const data = await res.json();
    if (data.ok) updateProgressUI(data);
  } catch (_) {}
}

function updateCodeUnlockCards() {
  ['codeCard', 'codeAdvCard'].forEach(id => {
    const card = document.getElementById(id);
    if (!card) return;
    card.classList.remove('mode-locked');
    card.classList.add('mode-unlock-animate');
    const icon = card.querySelector('.icon');
    const hint = card.querySelector('p');
    if (id === 'codeCard') {
      if (icon) icon.textContent = '🐱';
      if (hint) hint.textContent = 'Bloques de comandos';
    } else {
      if (icon) icon.textContent = '💻';
      if (hint) hint.textContent = 'Escribe tu propio código';
    }
  });
}

function showUnlockToast() {
  const wrap = document.getElementById('toastWrap');
  const toast = document.createElement('div');
  toast.className = 'toast toast-unlock';
  toast.innerHTML = `
    <div class="t-icon">🐱</div>
    <div class="t-text">
      <div class="t-title">¡Modo desbloqueado!</div>
      <div class="t-name">Programa al Gato ya está disponible</div>
    </div>`;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);

  if (typeof anime === 'function') {
    ['codeCard', 'codeAdvCard'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        anime({
          targets: el,
          scale: [1, 1.04, 1],
          duration: 600,
          easing: 'easeOutElastic(1, .6)',
        });
      }
    });
  }
}

async function saveScore(points) {
  try {
    const res = await fetch('save_score.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points }),
    });

    if (!res.ok) {
      showErrorToast('El servidor no respondió correctamente. Tus puntos no se guardaron.');
      return false;
    }

    const data = await res.json();

    if (data.ok) {
      updateProgressUI(data);

      if (data.newBadges && data.newBadges.length > 0) {
        data.newBadges.forEach((badge, idx) => {
          setTimeout(() => showToast(badge), idx * 300);
        });
      }
      return true;
    }

    showErrorToast(data.error || 'No se pudo guardar tu puntaje.');
    return false;
  } catch {
    showErrorToast('Sin conexión a internet. Tus puntos no se guardaron, inténtalo de nuevo.');
    return false;
  }
}

function showToast(badge) {
  const wrap = document.getElementById('toastWrap');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="t-icon">${escapeHtml(badge.icon)}</div>
    <div class="t-text">
      <div class="t-title">¡Nuevo logro desbloqueado!</div>
      <div class="t-name">${escapeHtml(badge.name)}</div>
    </div>`;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showErrorToast(message) {
  const wrap = document.getElementById('toastWrap');
  const toast = document.createElement('div');
  toast.className = 'toast toast-error';
  toast.innerHTML = `
    <div class="t-icon">⚠️</div>
    <div class="t-text">
      <div class="t-title">Ups, algo salió mal</div>
      <div class="t-name">${escapeHtml(message)}</div>
    </div>`;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function resultScreen(container, earned, onDone) {
  container.innerHTML = `
    <div class="result-box">
      <div class="big-score">+${earned} pts</div>
      <div class="msg">¡Buen trabajo!</div>
      <button class="btn-primary" id="doneBtn">Guardar y volver</button>
    </div>`;

  document.getElementById('doneBtn').onclick = async (e) => {
    const btn = e.currentTarget;
    if (btn.classList.contains('btn-loading')) return;
    btn.classList.add('btn-loading');
    btn.disabled = true;

    const success = await saveScore(earned);

    if (success) {
      backToMenu();
      if (onDone) onDone();
    } else {
      btn.classList.remove('btn-loading');
      btn.disabled = false;
    }
  };
}

function showQuestionLoadError(area, message, onRetry) {
  area.innerHTML = `
    <div class="alert alert-error">${escapeHtml(message)}</div>
    <button class="btn-secondary" type="button" id="retryLoadBtn">Reintentar</button>
    <button class="back-btn" type="button" id="backFromErrorBtn" style="display:block;margin-top:12px;">← Volver al menú</button>
  `;
  document.getElementById('backFromErrorBtn').onclick = backToMenu;
  if (onRetry) document.getElementById('retryLoadBtn').onclick = onRetry;
}

async function fetchQuestions(mode, count = 8, daily = false) {
  const params = new URLSearchParams({ mode, count: String(count) });
  if (daily) params.set('daily', '1');
  const res = await fetch(`get_questions.php?${params}`);
  const data = await res.json();
  if (data.error === 'daily_done') {
    const err = new Error(data.message || 'Reto diario completado.');
    err.code = 'daily_done';
    throw err;
  }
  if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudieron cargar las preguntas.');
  return data.questions;
}

async function fetchMatchPairs(count = 6) {
  const res = await fetch(`get_match_pairs.php?count=${count}`);
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudieron cargar los pares.');
  return data.pairs;
}

async function markQuestionsComplete(ids) {
  await fetch('mark_questions.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

function isCodeUnlocked() {
  return codeUnlocked;
}

if (document.getElementById('statPoints')) {
  refreshGameStats();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshGameStats();
  });
}
