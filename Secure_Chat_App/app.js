var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const flash = require('connect-flash');
const layout = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
require('./db/connect_db');
require('dotenv').config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();


// view engine setup
app.use(layout);
app.set('layout','./layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'secure-chap-app',
  secret: 'secure-chat-app',
  store: new MongoStore({ url: process.env.DATABASE_URI }),
})
);

//Can pass data without redirect
app.use(flash());
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res) => {
  res.locals.current_user = req.user;
  res.locals.danger = req.flash("danger");
  res.locals.success = req.flash("success");
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
