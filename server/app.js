require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

var fileUpload = require('express-fileupload');
const db = require('./config/connection');







const allowedOrigins = [
  process.env.CLIENT_URL_USER || 'http://localhost:5173',
  process.env.CLIENT_URL_ADMIN || 'http://localhost:5174',
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());



app.use('/product-images', express.static(path.join(__dirname, '..', 'public', 'product-images')));


app.use('/', userRouter);
app.use('/admin', adminRouter);



db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
    process.exit(1);
  }

  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running, DB connected');
  });
});









module.exports = app;
