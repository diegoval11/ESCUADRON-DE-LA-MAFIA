const { verifyToken, getPool, error, ok } = require('./db');

exports.handler = async (event) => {
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const pool = await getPool();
  const { rows: users } = await pool.query('SELECT id FROM users WHERE username = $1', [payload.username]);
  if (users.length === 0) return error(404, 'Usuario no encontrado');
  const userId = users[0].id;

  const { rows: earnedRows } = await pool.query('SELECT achievement_code, earned_at FROM user_achievements WHERE user_id = $1', [userId]);
  const earned = {};
  for (const row of earnedRows) {
    earned[row.achievement_code] = row.earned_at;
  }

  const { rows: all } = await pool.query('SELECT * FROM achievements ORDER BY type, threshold');
  return ok({ achievements: all, earned, earnedCount: Object.keys(earned).length, total: all.length });
};
