<?php /** @var string $navActive panel|play|ranking|achievements */ ?>
<nav class="bottom-nav" aria-label="Navegación principal">
  <a href="dashboard.php" class="bottom-nav-item<?php echo ($navActive ?? '') === 'panel' ? ' is-active' : ''; ?>">
    <svg class="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" fill="currentColor"/></svg>
    <span>Panel</span>
  </a>
  <a href="game.php" class="bottom-nav-item<?php echo ($navActive ?? '') === 'play' ? ' is-active' : ''; ?>">
    <svg class="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5z" fill="currentColor"/></svg>
    <span>Jugar</span>
  </a>
  <a href="leaderboard.php" class="bottom-nav-item<?php echo ($navActive ?? '') === 'ranking' ? ' is-active' : ''; ?>">
    <svg class="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h2v8H7V4zm4 3h2v5h-2V7zm4 4h2v4h-2v-4zM5 20h14v2H5v-2z" fill="currentColor"/></svg>
    <span>Ranking</span>
  </a>
  <a href="achievements.php" class="bottom-nav-item<?php echo ($navActive ?? '') === 'achievements' ? ' is-active' : ''; ?>">
    <svg class="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 5.4L20 8.2l-4 3.8.9 5.5L12 15.8 7.1 17.5 8 12 4 8.2l5.6-.8L12 2z" fill="currentColor"/></svg>
    <span>Logros</span>
  </a>
</nav>
