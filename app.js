var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Common = require('./lib/Common');
var Cart = require('./routes/Cart.class');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//TODO 现在只是开发使用，上线不能这样用，因为默认是内存存储，文档说有内存泄漏的风险
var session = require('express-session');
app.use(session({
  secret: 'session secret',
  resave: false,
  saveUninitialized: true
}));


//静态资源
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.locals.__dirname = __dirname;//全局可以通过req.app.locals访问到
app.locals.toDateStr = Common.toDateStr; //给ejs模板文件内使用的函数


//测试
app.use('/chat', require('./routes/chat'));
app.use('/test', require('./routes/test/test'));


//为全站提供登录用户的信息，方便在ejs中使用
app.use(function(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.cart = new Cart(req.session.cart || []); //购物车
  next();
});

app.use('/admin', require('./routes/admin/app'));
app.use('/admin', express.static(path.join(__dirname, 'views/admin/static')));
app.use('/', require('./routes/index'));
app.use('/download', require('./routes/download'));
// app.use('/user', express.static(path.join(__dirname, 'views/user/')));
app.use('/user', require('./routes/user/user'));
app.use('/flow', require('./routes/user/flow'));




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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
