require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sessionMiddleware = require('./middleware/session');
const { csrfProtection, csrfHeader } = require('./middleware/csrf');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_URL_USER,
  process.env.CLIENT_URL_ADMIN,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
  exposedHeaders: ['X-CSRF-Token'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use('/product-images', express.static(path.join(__dirname, '..', 'public', 'product-images')));

const fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  useTempFiles: false,
  safeFileNames: true,
  preserveExtension: 4,
}));

// Routes
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

// User routes: cookie/session/CSRF-based, now scoped to /user
app.use('/user', sessionMiddleware, csrfProtection, csrfHeader, userRouter);

// Admin routes: token-based, no cookies/CSRF at all
app.use('/admin', adminRouter);

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;
  const clientMessage = err.isOperational ? err.message : 'Something went wrong';

  res.status(statusCode).json({ error: clientMessage });
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

module.exports = app;