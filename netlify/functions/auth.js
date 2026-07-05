const { getPool, createToken, error, ok } = require('./db');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return error(405, 'Método no permitido');

  const { action, username, password } = JSON.parse(event.body || '{}');
  const pool = await getPool();

  if (action === 'register') {
    if (!username || !password) return error(400, 'Faltan campos');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return error(400, 'Usuario debe tener 3-20 caracteres (letras, números, _)');
    if (password.length < 6) return error(400, 'Contraseña debe tener al menos 6 caracteres');

    const hashed = await bcrypt.hash(password, 10);
    try {
      await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
      return ok({ message: 'Cuenta creada' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return error(409, 'Ese usuario ya existe');
      return error(500, 'Error al crear cuenta');
    }
  }

  if (action === 'login') {
    if (!username || !password) return error(400, 'Faltan campos');
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return error(401, 'Usuario o contraseña incorrectos');
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(401, 'Usuario o contraseña incorrectos');
    const token = createToken(username);
    return ok({
      token,
      username,
      onboarded: !!user.onboarded,
      points: user.points ?? 0,
      level: user.level ?? 1,
      streak: user.streak ?? 0,
    });
  }

  if (action === 'check') {
    const payload = require('./db').verifyToken(event);
    if (!payload) return error(401, 'No autenticado');
    const [rows] = await pool.execute('SELECT username, onboarded, points, level, streak FROM users WHERE username = ?', [payload.username]);
    if (rows.length === 0) return error(404, 'Usuario no encontrado');
    return ok({ user: rows[0] });
  }

  return error(400, 'Acción inválida');
};
