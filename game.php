<?php
session_start();
include "config.php";

if (!isset($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

$username = $_SESSION["user"];
$stmt = $conn->prepare("SELECT points, level, streak FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stats = $stmt->get_result()->fetch_assoc();

$points = $stats["points"] ?? 0;
$level  = $stats["level"] ?? 1;
$streak = $stats["streak"] ?? 0;

$pointsInLevel = $points % 100;
$progressPct = $pointsInLevel;

$codeUnlocked = $points >= 300;
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jugar · CodeQuest</title>
  <?php include __DIR__ . '/partials/theme-head.php'; ?>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body class="has-bottom-nav">

  <div class="brand">
    <div class="brand-icon" aria-hidden="true">Q</div>
    CodeQuest
  </div>

  <div class="hub-wrap app-shell">

    <?php include __DIR__ . '/partials/app-header.php'; ?>

    <div class="stats-bar">
      <div class="stat-pill"><div class="num" id="statPoints"><?php echo $points; ?></div><div class="label">Puntos</div></div>
      <div class="stat-pill"><div class="num" id="statLevel"><?php echo $level; ?></div><div class="label">Nivel</div></div>
      <div class="stat-pill"><div class="num" id="statStreak">🔥 <?php echo $streak; ?></div><div class="label">Racha</div></div>
    </div>

    <div class="level-progress">
      <div class="top-row">
        <span id="levelProgressLabel">Nivel <?php echo $level; ?></span>
        <span id="progressLabel"><?php echo $pointsInLevel; ?>/100 pts</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" id="progressFill" style="width: <?php echo $progressPct; ?>%;"></div>
      </div>
    </div>

    <!-- MENU -->
    <div class="mode-grid" id="menuView">
      <div class="mode-card mode-card-daily" id="dailyQuizCard" onclick="openGame('quiz')">
        <div class="daily-badge" id="dailyBadge">Reto diario</div>
        <div class="icon">📅</div>
        <h3>Quiz diario</h3>
        <p id="dailyCardHint">8 preguntas · 1 oportunidad al día</p>
      </div>
      <div class="mode-card" onclick="openGame('flash')">
        <div class="icon">🗂️</div>
        <h3>Flashcards</h3>
        <p>Memoriza conceptos</p>
      </div>
      <div class="mode-card" onclick="openGame('match')">
        <div class="icon">🔗</div>
        <h3>Emparejar</h3>
        <p>Arrastra y conecta</p>
      </div>
      <div class="mode-card" onclick="openGame('timed')">
        <div class="icon">⚡</div>
        <h3>Contrarreloj</h3>
        <p>Responde rápido</p>
      </div>
      <div class="mode-card <?php echo $codeUnlocked ? '' : 'mode-locked'; ?>" id="codeCard" onclick="openGame('code')">
        <div class="icon"><?php echo $codeUnlocked ? '🐱' : '🔒'; ?></div>
        <h3>Programa al Gato</h3>
        <p><?php echo $codeUnlocked ? 'Bloques de comandos' : 'Se desbloquea con 300 pts'; ?></p>
      </div>
      <div class="mode-card <?php echo $codeUnlocked ? '' : 'mode-locked'; ?>" id="codeAdvCard" onclick="openGame('codeadv')">
        <div class="icon"><?php echo $codeUnlocked ? '💻' : '🔒'; ?></div>
        <h3>Programa al Gato: Avanzado</h3>
        <p><?php echo $codeUnlocked ? 'Escribe tu propio código' : 'Se desbloquea con 300 pts'; ?></p>
      </div>
    </div>

    <!-- QUIZ -->
    <div class="game-panel" id="panel-quiz">
      <button class="back-btn" onclick="backToMenu()">← Volver</button>
      <div id="quizArea"></div>
    </div>

    <!-- FLASHCARDS -->
    <div class="game-panel" id="panel-flash">
      <button class="back-btn" onclick="backToMenu()">← Volver</button>
      <div id="flashArea"></div>
    </div>

    <!-- MATCHING -->
    <div class="game-panel" id="panel-match">
      <button class="back-btn" onclick="backToMenu()">← Volver</button>
      <div id="matchArea"></div>
    </div>

    <!-- TIMED -->
    <div class="game-panel" id="panel-timed">
      <button class="back-btn" onclick="backToMenu()">← Volver</button>
      <div id="timedArea"></div>
    </div>

    <!-- PROGRAMA AL GATO -->
    <div class="game-panel" id="panel-code">
      <button class="back-btn" onclick="backToMenu()">← Volver</button>
      <div id="codeArea"></div>
    </div>

    <!-- PROGRAMA AL GATO: AVANZADO -->
    <div class="game-panel" id="panel-codeadv">
      <button class="back-btn" onclick="backToMenu()">← Volver</button>
      <div id="codeAdvArea"></div>
    </div>

  </div>

  <div class="toast-wrap" id="toastWrap"></div>

  <?php $navActive = 'play'; include __DIR__ . '/partials/bottom-nav.php'; ?>

  <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"></script>
  <script src="assets/sounds.js"></script>
  <script>
    window.CODEQUEST = {
      username: <?php echo json_encode($username); ?>,
      codeUnlocked: <?php echo $codeUnlocked ? 'true' : 'false'; ?>,
      codeUnlockPoints: 300
    };
  </script>
  <script src="assets/js/quiz-feedback.js"></script>
  <script src="assets/js/game-core.js"></script>
  <script src="assets/js/quiz-daily.js"></script>
  <script src="assets/js/match.js"></script>
  <script src="assets/js/timed.js"></script>
  <script src="assets/js/flash.js"></script>
  <script src="assets/js/cat-game.js"></script>
  <script src="assets/js/theme.js"></script>

</body>
</html>
