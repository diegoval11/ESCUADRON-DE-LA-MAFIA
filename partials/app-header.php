<?php /** @var string $username */ ?>
<header class="app-header">
  <div class="app-header-start">
    <span class="nav-greeting">Hola, <?php echo htmlspecialchars($username); ?></span>
  </div>
  <a href="logout.php" class="nav-exit">Salir</a>
</header>
