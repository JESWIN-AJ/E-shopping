require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sessionMiddleware = require('./middleware/session');
const { csrfProtection, csrfHeader } = require('./middleware/csrf');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));




app.use((req, res, next) => {
  console.log('=================================');
  console.log('REQUEST RECEIVED');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Origin:', req.headers.origin);
  console.log('Cookies:', req.headers.cookie);
  console.log('=================================');

  next();
});



// Trust proxy (required for secure cookies behind Render proxy)
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_URL_USER,
  process.env.CLIENT_URL_ADMIN,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(csrfProtection);
app.use(csrfHeader);  // Exposes x-csrf-token header

// Static files
app.use('/product-images', express.static(path.join(__dirname, '..', 'public', 'product-images')));

// Routes
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
app.use('/', userRouter);
app.use('/admin', adminRouter);

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

// DB connect & listen
const db = require('./config/connection');

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 10000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}, DB connected`);
  });
});

// Logs HTTP requests

module.exports = app;
