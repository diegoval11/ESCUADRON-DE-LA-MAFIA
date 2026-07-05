<?php
session_start();
include "config.php";

if (!isset($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}

$username = $_SESSION["user"];
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$userId = $stmt->get_result()->fetch_assoc()["id"];

$earnedStmt = $conn->prepare("SELECT achievement_code, earned_at FROM user_achievements WHERE user_id = ?");
$earnedStmt->bind_param("i", $userId);
$earnedStmt->execute();
$earnedResult = $earnedStmt->get_result();

$earned = [];
while ($row = $earnedResult->fetch_assoc()) {
    $earned[$row["achievement_code"]] = $row["earned_at"];
}

$all = $conn->query("SELECT * FROM achievements ORDER BY type, threshold");
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logros · CodeQuest</title>
  <?php include __DIR__ . '/partials/theme-head.php'; ?>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body class="has-bottom-nav">

  <div class="brand">
    <div class="brand-icon" aria-hidden="true">Q</div>
    CodeQuest
  </div>

  <div class="hub-wrap hub-narrow app-shell">
    <?php include __DIR__ . '/partials/app-header.php'; ?>

    <h2 class="page-heading">Logros</h2>

    <p style="color:var(--text-muted); font-size:13px; margin-bottom:16px;">
      Has desbloqueado <?php echo count($earned); ?> de <?php echo $all->num_rows; ?> logros
    </p>

    <div class="badges-grid">
      <?php while ($ach = $all->fetch_assoc()):
        $isEarned = isset($earned[$ach["code"]]);
      ?>
        <div class="badge-card <?php echo $isEarned ? '' : 'locked'; ?>">
          <div class="badge-icon"><?php echo $ach["icon"]; ?></div>
          <div class="badge-name"><?php echo htmlspecialchars($ach["name"]); ?></div>
          <div class="badge-desc"><?php echo htmlspecialchars($ach["description"]); ?></div>
          <?php if ($isEarned): ?>
            <div class="badge-date"><?php echo date("d/m/Y", strtotime($earned[$ach["code"]])); ?></div>
          <?php endif; ?>
        </div>
      <?php endwhile; ?>
    </div>
  </div>

  <?php $navActive = 'achievements'; include __DIR__ . '/partials/bottom-nav.php'; ?>

  <script src="assets/js/theme.js"></script>
</body>
</html>