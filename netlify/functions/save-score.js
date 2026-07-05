const { getPool, verifyToken, error, ok } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return error(405, 'Método no permitido');
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const { points: earned } = JSON.parse(event.body || '{}');
  const pts = Math.max(0, Math.min(1000, parseInt(earned) || 0));
  const pool = await getPool();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const { rows } = await pool.query('SELECT id, points, streak, last_played, games_played FROM users WHERE username = $1', [payload.username]);
  if (rows.length === 0) return error(404, 'Usuario no encontrado');
  const u = rows[0];
  const userId = u.id;
  const newPoints = (u.points || 0) + pts;
  const newLevel = Math.floor(newPoints / 100) + 1;
  const newGamesPlayed = (u.games_played || 0) + 1;
  let streak = u.streak || 0;
  const lastPlayed = u.last_played ? new Date(u.last_played).toISOString().slice(0, 10) : null;

  if (lastPlayed === today) {
    // already played today
  } else if (lastPlayed === yesterday) {
    streak++;
  } else {
    streak = 1;
  }

  await pool.query(
    'UPDATE users SET points = $1, level = $2, streak = $3, last_played = $4, games_played = $5 WHERE id = $6',
    [newPoints, newLevel, streak, today, newGamesPlayed, userId]
  );

  // check achievements
  const { rows: achievements } = await pool.query('SELECT * FROM achievements');
  const newBadges = [];
  for (const ach of achievements) {
    const stats = { games: newGamesPlayed, streak, points: newPoints, level: newLevel };
    if (stats[ach.type] >= ach.threshold) {
      const { rows: existing } = await pool.query(
        'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_code = $2',
        [userId, ach.code]
      );
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO user_achievements (user_id, achievement_code) VALUES ($1, $2)',
          [userId, ach.code]
        );
        newBadges.push({ name: ach.name, icon: ach.icon });
      }
    }
  }

  return ok({
    points: newPoints,
    level: newLevel,
    streak,
    pointsInLevel: newPoints % 100,
    newBadges,
  });
};
