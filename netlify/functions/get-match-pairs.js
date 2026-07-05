const { getPool, verifyToken, error, ok } = require('./db');
const { calculateUserRating, pickByDifficultyWindow } = require('./rating');

exports.handler = async (event) => {
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const pool = await getPool();
  const count = Math.max(4, Math.min(8, parseInt(event.queryStringParameters?.count) || 6));

  const { rows: users } = await pool.query('SELECT skill_level, points, level FROM users WHERE username = $1', [payload.username]);
  if (users.length === 0) return error(404, 'Usuario no encontrado');
  const user = users[0];
  const userRating = calculateUserRating(user.skill_level || 'basico', user.points || 0, user.level || 1);

  let bank;
  try { bank = require('./match_pairs'); } catch { return error(503, 'Banco de emparejamiento no disponible'); }
  if (!Array.isArray(bank)) return error(503, 'Banco corrupto');

  const selected = pickByDifficultyWindow(bank, count, userRating, [], (item) => !!(item.term && item.def));

  const publicPairs = selected.map(p => ({ id: p.id, term: p.term, def: p.def }));
  return ok({ pairs: publicPairs, meta: { count: publicPairs.length } });
};
