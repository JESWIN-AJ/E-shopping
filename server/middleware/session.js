const session = require('express-session');
const { RedisStore } = require('../config/redis');

const isProduction = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
  store: new RedisStore({ client: require('../config/redis').redis }),
  secret: process.env.SESSION_SECRET,
  name: 'sid',                    // Cookie name
  resave: false,
  saveUninitialized: false,
  rolling: true,                  // Reset expiry on activity
  cookie: {
    httpOnly: true,
    // secure: isProduction,
    // sameSite: isProduction ? 'none' : 'lax',
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  },
});

module.exports = sessionMiddleware;