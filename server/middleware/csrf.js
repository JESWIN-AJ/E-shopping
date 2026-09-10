const csrf = require('csurf');

// Double-submit cookie pattern
const csrfProtection = csrf({
  cookie: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  },
});

// Expose CSRF token via custom header for SPA
const csrfHeader = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.setHeader('x-csrf-token', req.csrfToken());
  next();
};

module.exports = { csrfProtection, csrfHeader };