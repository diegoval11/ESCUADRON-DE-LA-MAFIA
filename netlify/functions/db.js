const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'codequest-secret-change-in-production';

let pool;
async function getPool() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.PLANETSCALE_HOST || 'aws.connect.psdb.cloud',
    user: process.env.PLANETSCALE_USER,
    password: process.env.PLANETSCALE_PASS,
    database: process.env.PLANETSCALE_DB || 'login_system',
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 5,
  });
  return pool;
}

function createToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(event) {
  const auth = event.headers?.authorization || event.headers?.Authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function error(status, message) {
  return { statusCode: status, body: JSON.stringify({ ok: false, error: message }) };
}

function ok(data = {}) {
  return { statusCode: 200, body: JSON.stringify({ ok: true, ...data }) };
}

module.exports = { getPool, createToken, verifyToken, error, ok };
