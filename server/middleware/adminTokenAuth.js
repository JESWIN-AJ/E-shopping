const crypto = require('crypto');
const { redis } = require('../config/redis');

const TOKEN_PREFIX = 'admintoken:';
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const createAdminToken = async (adminData) => {
  const token = crypto.randomBytes(32).toString('hex');
  await redis.set(TOKEN_PREFIX + token, JSON.stringify(adminData), 'EX', TOKEN_TTL_SECONDS);
  return token;
};

const getAdminByToken = async (token) => {
  if (!token) return null;
  const data = await redis.get(TOKEN_PREFIX + token);
  return data ? JSON.parse(data) : null;
};

const deleteAdminToken = async (token) => {
  if (!token) return;
  await redis.del(TOKEN_PREFIX + token);
};

const requireAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const admin = await getAdminByToken(token);
  if (admin?.isAdmin === true) {
    req.admin = admin;
    req.adminToken = token;
    return next();
  }

  return res.status(401).json({ error: 'Admin authentication required' });
};

module.exports = { createAdminToken, getAdminByToken, deleteAdminToken, requireAdminToken };