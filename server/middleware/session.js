const session = require('express-session');

const { RedisStore, redis } = require('../config/redis');

// const isProduction = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
  store: new RedisStore({
    client: redis,
  }),

  secret: process.env.SESSION_SECRET,

  name: 'sid',

  resave: false,

  saveUninitialized: false,

  rolling: true,

  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none',

    // secure: isProduction,

    // sameSite: isProduction ? 'none' : 'lax',

    maxAge: 1000 * 60 * 60 * 24 * 7,

    path: '/',
  },
});

module.exports = sessionMiddleware;
