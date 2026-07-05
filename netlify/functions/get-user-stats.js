const { getPool, verifyToken, error, ok } = require('./db');

exports.handler = async (event) => {
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const pool = await getPool();
  const { rows } = await pool.query('SELECT points, level, streak FROM users WHERE username = $1', [payload.username]);
  if (rows.length === 0) return error(404, 'Usuario no encontrado');

  const { points = 0, level = 1, streak = 0 } = rows[0];
  return ok({ points, level, streak, pointsInLevel: points % 100, codeUnlocked: points >= 300 });
};
