<?php
session_start();
include "config.php";

if (!isset($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

$username = $_SESSION["user"];
$initial = strtoupper(substr($username, 0, 1));

$stmt = $conn->prepare("SELECT points, level, streak FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stats = $stmt->get_result()->fetch_assoc();

$points = $stats["points"] ?? 0;
$level  = $stats["level"] ?? 1;
$streak = $stats["streak"] ?? 0;
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel · CodeQuest</title>
  <?php include __DIR__ . '/partials/theme-head.php'; ?>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body class="has-bottom-nav">

  <div class="brand">
    <div class="brand-icon" aria-hidden="true">Q</div>
    CodeQuest
  </div>

  <div class="hub-wrap hub-centered app-shell">
    <?php include __DIR__ . '/partials/app-header.php'; ?>

    <div class="card dashboard-card">
      <div class="avatar"><?php echo htmlspecialchars($initial); ?></div>
      <h2>Hola, <?php echo htmlspecialchars($username); ?></h2>
      <p class="subtitle">Tu progreso de hoy</p>

      <div class="stats-bar">
        <div class="stat-pill"><div class="num"><?php echo $points; ?></div><div class="label">Puntos</div></div>
        <div class="stat-pill"><div class="num"><?php echo $level; ?></div><div class="label">Nivel</div></div>
        <div class="stat-pill"><div class="num"><?php echo $streak; ?></div><div class="label">Racha</div></div>
      </div>

      <a href="game.php" class="btn-primary">Reto diario</a>
    </div>
  </div>

  <?php $navActive = 'panel'; include __DIR__ . '/partials/bottom-nav.php'; ?>

  <script src="assets/js/theme.js"></script>
</body>
</html>