const session = require('express-session');

const { RedisStore, redis } = require('../config/redis');


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
    // secure: true,
    // sameSite: 'none',

    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',

    maxAge: 1000 * 60 * 60 * 24 * 7,

    path: '/',
  },
});

module.exports = sessionMiddleware;
