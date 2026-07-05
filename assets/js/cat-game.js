const catBoards = [
  {
    name: 'Tablero 1 · Línea recta',
    grid: ['......', '.####.', '.#..#.', '.#.*#.', '.#..G.', '......'],
    start: { r: 2, c: 2 },
    basePoints: 20,
  },
  {
    name: 'Tablero 2 · Esquinas',
    grid: ['S....#', '.####.', '.#..*.', '.#.##.', '.*..#.', '####G.'],
    start: { r: 0, c: 0 },
    basePoints: 30,
  },
  {
    name: 'Tablero 3 · El laberinto',
    grid: ['S.#....', '.#.###.', '.#.*..#', '.#.#.#.', '.#.#.#.', '...#.*.', '###.#G.'],
    start: { r: 0, c: 0 },
    basePoints: 40,
  },
];

const codeDirWords = { arriba: 'up', abajo: 'down', izquierda: 'left', derecha: 'right' };

const tutorialSteps = [
  {
    title: '1. El comando mover()',
    body: 'Para mover al gato una casilla usamos la función <code>mover()</code>, indicando la dirección entre comillas:',
    code: 'mover("arriba")\nmover("derecha")',
    explain: 'Cada línea es una instrucción independiente. El gato las ejecuta en orden, de arriba hacia abajo, tal como leerías el código.',
  },
  {
    title: '2. Las 4 direcciones',
    body: 'Puedes usar cualquiera de estas cuatro palabras dentro de <code>mover()</code>:',
    code: 'mover("arriba")\nmover("abajo")\nmover("izquierda")\nmover("derecha")',
    explain: 'Si el gato choca contra un muro o sale del tablero, el programa se detiene y tendrás que corregirlo.',
  },
  {
    title: '3. Repetir código con repetir()',
    body: 'Cuando necesitas el mismo movimiento varias veces seguidas, en vez de repetir la línea puedes usar un bucle con <code>repetir()</code>:',
    code: 'repetir(3, "derecha")\n\n// Es lo mismo que escribir:\nmover("derecha")\nmover("derecha")\nmover("derecha")',
    explain: "El primer valor es cuántas veces se repite, y el segundo es la dirección. Esto es exactamente lo mismo que un bucle 'for' o 'while' en un lenguaje real: menos código, mismo resultado.",
  },
  {
    title: '4. Comentarios',
    body: 'Puedes escribir notas para ti mismo con <code>//</code>. El gato las ignora por completo:',
    code: '// Bajo hasta la fila del tesoro\nmover("abajo")\nmover("abajo")',
    explain: 'Comentar tu código es una buena práctica: te ayuda a recordar por qué escribiste cada parte.',
  },
  {
    title: '5. ¡Tu turno!',
    body: 'Ya conoces todo lo necesario: <code>mover()</code>, <code>repetir()</code> y comentarios con <code>//</code>.',
    code: '// Escribe aquí tu propio programa\nmover("abajo")\nrepetir(2, "derecha")',
    explain: 'Ahora vas a resolver tableros reales escribiendo el código tú mismo. Si te atoras, hay un botón de Ayuda 💡 que te da una pista sin resolverte todo el problema.',
  },
];

const codeBoardsAdvanced = [
  {
    name: 'Reto 1 · El giro',
    grid: ['S....', '.###.', '.#*..', '...#G'],
    start: { r: 0, c: 0 },
    basePoints: 35,
    solution: ['down', 'down', 'down', 'right', 'right', 'up', 'right', 'right', 'down'],
  },
  {
    name: 'Reto 2 · El desvío',
    grid: ['S.#..', '..#..', '..#.*', '....#', '##..G'],
    start: { r: 0, c: 0 },
    basePoints: 45,
    solution: ['down', 'down', 'down', 'right', 'right', 'right', 'down', 'right'],
  },
];

function parseAdvancedCode(code) {
  const lines = code.split('\n');
  const commands = [];

  for (let i = 0; i < lines.length; i++) {
    let raw = lines[i];
    const commentIdx = raw.indexOf('//');
    if (commentIdx !== -1) raw = raw.slice(0, commentIdx);
    const line = raw.trim();
    if (line === '') continue;

    let m = line.match(/^mover\(\s*["'](arriba|abajo|izquierda|derecha)["']\s*\)$/);
    if (m) {
      commands.push(codeDirWords[m[1]]);
      continue;
    }

    m = line.match(/^repetir\(\s*(\d{1,2})\s*,\s*["'](arriba|abajo|izquierda|derecha)["']\s*\)$/);
    if (m) {
      const n = Math.min(parseInt(m[1], 10), 20);
      for (let k = 0; k < n; k++) commands.push(codeDirWords[m[2]]);
      continue;
    }

    return {
      commands: null,
      error: { line: i + 1, message: `Línea ${i + 1}: no reconozco "${escapeHtml(line)}". Usa mover("direccion") o repetir(n, "direccion").` },
    };
  }

  if (commands.length === 0) {
    return { commands: null, error: { line: 0, message: 'Tu programa está vacío. Escribe al menos un comando mover(...).' } };
  }
  if (commands.length > 60) {
    return { commands: null, error: { line: 0, message: 'Tu programa es demasiado largo (máx. 60 pasos). Prueba usar repetir(n, "direccion").' } };
  }
  return { commands, error: null };
}

function startCode() {
  const area = document.getElementById('codeArea');
  let boardIndex = 0;
  let totalEarned = 0;

  function renderIntro() {
    area.innerHTML = `
      <div class="flash-intro">
        <div class="flash-intro-icon">🐱</div>
        <h3>Programa al Gato</h3>
        <p class="subtitle">Escribe un programa con bloques de comandos para llevar al gato hasta la meta 🐟.</p>
        <ol class="flash-intro-steps">
          <li>Arma una secuencia con los bloques ⬆️ ⬇️ ⬅️ ➡️.</li>
          <li>Presiona <strong>▶ Ejecutar</strong> para ver al gato seguir tus instrucciones paso a paso.</li>
          <li>Recoge las estrellas ⭐ en el camino y llega hasta la meta 🐟 sin chocar contra los muros 🧱.</li>
          <li>Usa <strong>🔁 Repetir</strong> para duplicar el último bloque y ahorrar pasos, como un bucle.</li>
        </ol>
        <p class="flash-intro-tip">💡 Si el gato choca con un muro, el programa se reinicia. ¡Piensa antes de ejecutar!</p>
        <button class="btn-primary" id="startCodeBtn">Comenzar</button>
      </div>`;
    document.getElementById('startCodeBtn').onclick = () => loadBoard();
  }

  function loadBoard() {
    if (boardIndex >= catBoards.length) {
      resultScreen(area, totalEarned);
      return;
    }

    const board = catBoards[boardIndex];
    const grid = board.grid.map(row => row.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    let cat = { r: board.start.r, c: board.start.c };
    let program = [];
    let running = false;
    let collectedThisBoard = 0;

    area.innerHTML = `
      <div class="code-header">
        <span>${escapeHtml(board.name)}</span>
        <span class="code-progress">Tablero ${boardIndex + 1} de ${catBoards.length}</span>
      </div>
      <div class="code-board" id="codeBoard" style="grid-template-columns: repeat(${cols}, 1fr);"></div>
      <div class="code-message" id="codeMessage">Arma tu programa y presiona Ejecutar ▶</div>
      <div class="code-program" id="codeProgram"></div>
      <div class="code-palette">
        <button class="code-block" data-dir="up">⬆️</button>
        <button class="code-block" data-dir="down">⬇️</button>
        <button class="code-block" data-dir="left">⬅️</button>
        <button class="code-block" data-dir="right">➡️</button>
        <button class="code-block code-repeat" id="repeatBtn">🔁 Repetir</button>
      </div>
      <div class="code-actions">
        <button class="btn-secondary" id="clearBtn">🗑️ Borrar todo</button>
        <button class="btn-primary" id="runBtn">▶ Ejecutar</button>
      </div>`;

    const boardEl = document.getElementById('codeBoard');
    const messageEl = document.getElementById('codeMessage');
    const programEl = document.getElementById('codeProgram');
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const repeatBtn = document.getElementById('repeatBtn');

    function cellType(r, c) { return grid[r][c]; }

    function renderBoard() {
      boardEl.innerHTML = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const type = cellType(r, c);
          const cell = document.createElement('div');
          cell.className = 'code-cell';
          if (type === '#') cell.classList.add('cell-wall');
          else if (type === 'G') cell.classList.add('cell-goal');
          else if (type === '*') cell.classList.add('cell-star');
          else cell.classList.add('cell-floor');

          if (r === cat.r && c === cat.c) {
            const catSpan = document.createElement('span');
            catSpan.className = 'cell-cat';
            catSpan.textContent = '🐱';
            cell.appendChild(catSpan);
          } else if (type === 'G') {
            cell.textContent = '🐟';
          } else if (type === '*') {
            cell.textContent = '⭐';
          }
          boardEl.appendChild(cell);
        }
      }
    }

    function renderProgram() {
      if (program.length === 0) {
        programEl.innerHTML = '<span class="code-empty">Tu programa está vacío. Agrega bloques abajo 👇</span>';
        return;
      }
      const icons = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
      programEl.innerHTML = program.map((dir, i) => `<span class="code-chip" data-idx="${i}">${icons[dir]}</span>`).join('');
      programEl.querySelectorAll('.code-chip').forEach(chip => {
        chip.onclick = () => {
          if (running) return;
          program.splice(parseInt(chip.dataset.idx, 10), 1);
          renderProgram();
        };
      });
    }

    area.querySelectorAll('.code-block[data-dir]').forEach(btn => {
      btn.onclick = () => { if (!running) { program.push(btn.dataset.dir); renderProgram(); } };
    });

    repeatBtn.onclick = () => {
      if (running || program.length === 0) return;
      program.push(program[program.length - 1]);
      renderProgram();
    };

    clearBtn.onclick = () => { if (!running) { program = []; renderProgram(); } };

    function setControlsEnabled(enabled) {
      area.querySelectorAll('.code-block, #clearBtn, #runBtn').forEach(el => { el.disabled = !enabled; });
    }

    async function runProgram() {
      if (running || program.length === 0) return;
      running = true;
      setControlsEnabled(false);
      messageEl.className = 'code-message';
      messageEl.textContent = '▶ Ejecutando programa...';

      const deltas = { up: { r: -1, c: 0 }, down: { r: 1, c: 0 }, left: { r: 0, c: -1 }, right: { r: 0, c: 1 } };

      for (let i = 0; i < program.length; i++) {
        await new Promise(res => setTimeout(res, 450));
        const d = deltas[program[i]];
        const nr = cat.r + d.r;
        const nc = cat.c + d.c;
        const outOfBounds = nr < 0 || nr >= rows || nc < 0 || nc >= cols;
        const hitsWall = !outOfBounds && cellType(nr, nc) === '#';

        if (outOfBounds || hitsWall) {
          messageEl.className = 'code-message code-fail';
          messageEl.textContent = '💥 ¡El gato chocó! Ajusta el programa e inténtalo de nuevo.';
          SoundFX.wrong();
          await new Promise(res => setTimeout(res, 700));
          cat = { r: board.start.r, c: board.start.c };
          collectedThisBoard = 0;
          renderBoard();
          running = false;
          setControlsEnabled(true);
          return;
        }

        cat = { r: nr, c: nc };
        if (cellType(nr, nc) === '*') {
          grid[nr][nc] = '.';
          collectedThisBoard += 5;
        }
        renderBoard();

        if (cellType(nr, nc) === 'G') {
          messageEl.className = 'code-message code-success';
          messageEl.textContent = '🎉 ¡Llegaste a la meta!';
          const earned = board.basePoints + collectedThisBoard;
          totalEarned += earned;
          await new Promise(res => setTimeout(res, 900));
          boardIndex++;
          loadBoard();
          return;
        }
      }

      messageEl.className = 'code-message code-fail';
      messageEl.textContent = '🙀 El gato se quedó sin instrucciones antes de llegar a la meta.';
      await new Promise(res => setTimeout(res, 700));
      cat = { r: board.start.r, c: board.start.c };
      collectedThisBoard = 0;
      renderBoard();
      running = false;
      setControlsEnabled(true);
    }

    runBtn.onclick = runProgram;
    renderBoard();
    renderProgram();
  }

  renderIntro();
}

function startCodeAdvanced() {
  const area = document.getElementById('codeAdvArea');
  let tutorialIndex = 0;
  let boardIndex = 0;
  let totalEarned = 0;

  function renderTutorialStep() {
    const step = tutorialSteps[tutorialIndex];
    const isLast = tutorialIndex === tutorialSteps.length - 1;
    area.innerHTML = `
      <div class="tut-wrap">
        <div class="tut-progress">Tutorial ${tutorialIndex + 1}/${tutorialSteps.length}</div>
        <h3>${step.title}</h3>
        <p class="subtitle">${step.body}</p>
        <pre class="code-preview">${escapeHtml(step.code)}</pre>
        <p class="tut-explain">${escapeHtml(step.explain)}</p>
        <div class="code-actions">
          ${tutorialIndex > 0 ? '<button class="btn-secondary" id="tutPrev">← Anterior</button>' : '<span></span>'}
          <button class="btn-primary" id="tutNext">${isLast ? 'Comenzar retos →' : 'Siguiente →'}</button>
        </div>
      </div>`;

    if (tutorialIndex > 0) {
      document.getElementById('tutPrev').onclick = () => { tutorialIndex--; renderTutorialStep(); };
    }
    document.getElementById('tutNext').onclick = () => {
      if (isLast) loadChallenge();
      else { tutorialIndex++; renderTutorialStep(); }
    };
  }

  function loadChallenge() {
    if (boardIndex >= codeBoardsAdvanced.length) {
      resultScreen(area, totalEarned);
      return;
    }

    const board = codeBoardsAdvanced[boardIndex];
    const grid = board.grid.map(row => row.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    let cat = { r: board.start.r, c: board.start.c };
    let running = false;
    let hintsUsed = 0;
    let collectedThisBoard = 0;

    area.innerHTML = `
      <div class="code-header">
        <span>${escapeHtml(board.name)}</span>
        <span class="code-progress">Reto ${boardIndex + 1} de ${codeBoardsAdvanced.length}</span>
      </div>
      <div class="code-board" id="codeBoardAdv" style="grid-template-columns: repeat(${cols}, 1fr);"></div>
      <div class="code-message" id="codeMessageAdv">Escribe tu programa y presiona Ejecutar ▶</div>
      <textarea class="code-editor" id="codeEditor" spellcheck="false" placeholder='mover(&quot;arriba&quot;)\nrepetir(2, &quot;derecha&quot;)'></textarea>
      <div class="code-hint" id="codeHint" style="display:none;"></div>
      <div class="code-actions">
        <button class="btn-secondary" id="clearAdvBtn">🗑️ Borrar</button>
        <button class="btn-secondary" id="hintBtn">💡 Ayuda</button>
        <button class="btn-primary" id="runAdvBtn">▶ Ejecutar</button>
      </div>`;

    const boardEl = document.getElementById('codeBoardAdv');
    const messageEl = document.getElementById('codeMessageAdv');
    const editorEl = document.getElementById('codeEditor');
    const hintEl = document.getElementById('codeHint');
    const runBtn = document.getElementById('runAdvBtn');
    const clearBtn = document.getElementById('clearAdvBtn');
    const hintBtn = document.getElementById('hintBtn');

    function cellType(r, c) { return grid[r][c]; }

    function renderBoard() {
      boardEl.innerHTML = '';
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const type = cellType(r, c);
          const cell = document.createElement('div');
          cell.className = 'code-cell';
          if (type === '#') cell.classList.add('cell-wall');
          else if (type === 'G') cell.classList.add('cell-goal');
          else if (type === '*') cell.classList.add('cell-star');
          else cell.classList.add('cell-floor');

          if (r === cat.r && c === cat.c) {
            const catSpan = document.createElement('span');
            catSpan.className = 'cell-cat';
            catSpan.textContent = '🐱';
            cell.appendChild(catSpan);
          } else if (type === 'G') {
            cell.textContent = '🐟';
          } else if (type === '*') {
            cell.textContent = '⭐';
          }
          boardEl.appendChild(cell);
        }
      }
    }

    clearBtn.onclick = () => { if (!running) { editorEl.value = ''; hintEl.style.display = 'none'; } };

    hintBtn.onclick = () => {
      if (running) return;
      const parsed = parseAdvancedCode(editorEl.value);
      const typed = parsed.commands || [];
      const solution = board.solution;
      let idx = 0;
      while (idx < typed.length && idx < solution.length && typed[idx] === solution[idx]) idx++;
      hintsUsed++;
      hintEl.style.display = 'block';
      if (idx >= solution.length) {
        hintEl.textContent = '💡 ¡Ya tienes una secuencia válida! Presiona Ejecutar para probarla.';
      } else {
        const dirWord = Object.keys(codeDirWords).find(k => codeDirWords[k] === solution[idx]);
        hintEl.textContent = `💡 Pista: el paso ${idx + 1} podría ser mover("${dirWord}"). (Usar ayuda reduce un poco los puntos del reto)`;
      }
    };

    async function runProgram() {
      if (running) return;
      hintEl.style.display = 'none';
      const parsed = parseAdvancedCode(editorEl.value);
      if (parsed.error) {
        messageEl.className = 'code-message code-fail';
        messageEl.textContent = '❌ ' + parsed.error.message;
        return;
      }

      const program = parsed.commands;
      running = true;
      editorEl.disabled = true;
      runBtn.disabled = true;
      clearBtn.disabled = true;
      hintBtn.disabled = true;
      messageEl.className = 'code-message';
      messageEl.textContent = '▶ Ejecutando programa...';

      const deltas = { up: { r: -1, c: 0 }, down: { r: 1, c: 0 }, left: { r: 0, c: -1 }, right: { r: 0, c: 1 } };

      for (let i = 0; i < program.length; i++) {
        await new Promise(res => setTimeout(res, 400));
        const d = deltas[program[i]];
        const nr = cat.r + d.r;
        const nc = cat.c + d.c;
        const outOfBounds = nr < 0 || nr >= rows || nc < 0 || nc >= cols;
        const hitsWall = !outOfBounds && cellType(nr, nc) === '#';

        if (outOfBounds || hitsWall) {
          messageEl.className = 'code-message code-fail';
          messageEl.textContent = '💥 ¡El gato chocó! Revisa tu código e inténtalo de nuevo.';
          SoundFX.wrong();
          await new Promise(res => setTimeout(res, 700));
          cat = { r: board.start.r, c: board.start.c };
          collectedThisBoard = 0;
          renderBoard();
          running = false;
          editorEl.disabled = false;
          runBtn.disabled = false;
          clearBtn.disabled = false;
          hintBtn.disabled = false;
          return;
        }

        cat = { r: nr, c: nc };
        if (cellType(nr, nc) === '*') {
          grid[nr][nc] = '.';
          collectedThisBoard += 5;
        }
        renderBoard();

        if (cellType(nr, nc) === 'G') {
          messageEl.className = 'code-message code-success';
          messageEl.textContent = '🎉 ¡Tu programa funcionó! Meta alcanzada.';
          const penalty = Math.min(hintsUsed * 5, board.basePoints - 10);
          const earned = Math.max(10, board.basePoints - penalty) + collectedThisBoard;
          totalEarned += earned;
          await new Promise(res => setTimeout(res, 900));
          boardIndex++;
          loadChallenge();
          return;
        }
      }

      messageEl.className = 'code-message code-fail';
      messageEl.textContent = '🙀 Tu programa terminó pero el gato no llegó a la meta.';
      await new Promise(res => setTimeout(res, 700));
      cat = { r: board.start.r, c: board.start.c };
      collectedThisBoard = 0;
      renderBoard();
      running = false;
      editorEl.disabled = false;
      runBtn.disabled = false;
      clearBtn.disabled = false;
      hintBtn.disabled = false;
    }

    runBtn.onclick = runProgram;
    renderBoard();
  }

  renderTutorialStep();
}
