var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var methoOveride=require('method-override');
var db = mongoose.connection;

var products=require('./routes/Products');
var shops=require('./routes/shops');

var routes = require('./routes/index');
var users = require('./routes/users');
var cart  =require('./routes/cart');

var app = express();

app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methoOveride("_method"));
// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
// app.use(function (req, res, next) {
//   res.locals.messages = req.flash('success');
//
//   next();
// });
var address;

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  res.locals.messages = req.flash('success');
  res.locals.address=address;

  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/',products);
app.use('/',shops);
app.use('/users',cart);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.jade', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.jade', {
    message: err.message,
    error: {}
  });
});


var io = require('socket.io').listen(server); // initiate socket.io server

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' }); // Send data to client
  // wait for the event raised by the client
  socket.on('location', function (data) {
    console.log(data);
    address=data.my;
    console.log(address);
  });
});
//server.listen(3000);



server.listen(3000,function(req,res){
  console.log("Server is On");
});




module.exports = app;
