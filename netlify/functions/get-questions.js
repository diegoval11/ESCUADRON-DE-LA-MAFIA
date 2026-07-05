const { getPool, verifyToken, error, ok } = require('./db');
const { calculateUserRating, pickByDifficultyWindow } = require('./rating');

exports.handler = async (event) => {
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  const pool = await getPool();
  const mode = event.queryStringParameters?.mode || 'quiz';
  const count = Math.max(1, Math.min(15, parseInt(event.queryStringParameters?.count) || 8));
  const isDaily = event.queryStringParameters?.daily === '1';
  const today = new Date().toISOString().slice(0, 10);
  const allowedModes = ['quiz', 'timed'];
  if (!allowedModes.includes(mode)) return error(400, 'Modo inválido');

  const [users] = await pool.execute('SELECT skill_level, points, level FROM users WHERE username = ?', [payload.username]);
  if (users.length === 0) return error(404, 'Usuario no encontrado');
  const user = users[0];

  const userRating = calculateUserRating(user.skill_level || 'basico', user.points || 0, user.level || 1);

  const fs = require('fs');
  const path = require('path');
  const bankPath = path.resolve(__dirname, '../../data/questions.json');
  if (!fs.existsSync(bankPath)) return error(503, 'Banco de preguntas no disponible');
  const bank = JSON.parse(fs.readFileSync(bankPath, 'utf-8'));
  if (!Array.isArray(bank)) return error(503, 'Banco de preguntas corrupto');

  const dailyKey = `codequest_daily_${payload.username}`;
  // For daily quiz, state is managed client-side via localStorage

  const selected = pickByDifficultyWindow(bank, count, userRating, [], (q) => {
    if (!q.q || !q.options || q.correct === undefined) return false;
    const modes = q.modes || ['quiz'];
    return modes.includes(mode);
  });

  const publicQuestions = selected.map(q => ({
    id: q.id,
    q: q.q,
    options: q.options,
    correct: q.correct,
    explain: q.explain || '',
  }));

  return ok({
    questions: publicQuestions,
    meta: { count: publicQuestions.length, mode, daily: isDaily },
  });
};
