const { getPool, verifyToken, error, ok } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return error(405, 'Método no permitido');
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const { level } = JSON.parse(event.body || '{}');
  const allowed = ['basico', 'intermedio', 'avanzado'];
  if (!allowed.includes(level)) return error(400, 'Nivel inválido');

  const pool = await getPool();
  await pool.execute('UPDATE users SET skill_level = ?, onboarded = 1 WHERE username = ?', [level, payload.username]);
  return ok({});
};
