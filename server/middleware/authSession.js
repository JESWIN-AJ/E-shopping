// server/middleware/authSession.js
const requireUser = (req, res, next) => {
  if (req.session.user) next();
  else res.status(401).json({ error: 'Authentication required' });
};

const requireAdmin = (req, res, next) => {
  if (req.session.admin) next();
  else res.status(401).json({ error: 'Admin authentication required' });
};

module.exports = { requireUser, requireAdmin };