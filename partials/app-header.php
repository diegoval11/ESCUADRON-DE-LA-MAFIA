<?php /** @var string $username */ ?>
<header class="app-header">
  <div class="app-header-start">
    <span class="nav-greeting">Hola, <?php echo htmlspecialchars($username); ?></span>
  </div>
  <div class="app-header-actions">
    <?php include __DIR__ . '/theme-toggle.php'; ?>
    <a href="logout.php" class="nav-exit">Salir</a>
  </div>
</header>
