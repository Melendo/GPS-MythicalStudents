var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var session = require('express-session');
const mysqlSession = require("express-mysql-session");

//const MySQLStore = mysqlSession(session);

const sessionOptions = session({
  saveUninitialized: false,
  secret: "a",
  resave: false,
});

const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "mm_db"
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tiendaRouter = require('./routes/tienda');
var crearColeccionRouter = require('./routes/crearColeccion');

var app = express(); 

const middlewareSession = session({
  saveUninitialized: false,
  secret: "foobar34",
  resave: false,
  store: sessionStore
});

app.use(middlewareSession);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionOptions);

app.use(session({
  secret: 'xdrtjxyzxdryjzxdrkgseyt',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tienda', tiendaRouter);
app.use('/crearColeccion', crearColeccionRouter);

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
