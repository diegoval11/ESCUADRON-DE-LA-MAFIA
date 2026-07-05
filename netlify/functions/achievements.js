const { verifyToken, getPool, error, ok } = require('./db');

exports.handler = async (event) => {
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const pool = await getPool();
  const [users] = await pool.execute('SELECT id FROM users WHERE username = ?', [payload.username]);
  if (users.length === 0) return error(404, 'Usuario no encontrado');
  const userId = users[0].id;

  const [earnedRows] = await pool.execute('SELECT achievement_code, earned_at FROM user_achievements WHERE user_id = ?', [userId]);
  const earned = {};
  for (const row of earnedRows) {
    earned[row.achievement_code] = row.earned_at;
  }

  const [all] = await pool.execute('SELECT * FROM achievements ORDER BY type, threshold');
  return ok({ achievements: all, earned, earnedCount: Object.keys(earned).length, total: all.length });
};
