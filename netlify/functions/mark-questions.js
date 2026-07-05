const { verifyToken, error, ok } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return error(405, 'Método no permitido');
  const payload = verifyToken(event);
  if (!payload) return error(401, 'No autenticado');

  // This is now a client-side concern via localStorage
  return ok({});
};
