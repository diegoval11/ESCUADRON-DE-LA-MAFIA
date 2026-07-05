const { verifyToken, getPool, error, ok } = require('./db');

exports.handler = async (event) => {
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const pool = await getPool();
  const { rows } = await pool.query('SELECT username, points, level FROM users ORDER BY points DESC LIMIT 20');
  return ok({ leaderboard: rows });
};
