const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {users} = require('./routes/users');
const chats = require('./routes/chats');
const api = require('./controller/api')
const moniter = require('./routes/api-monitor')
const app = express();

let dbStream = {
  write(line){
    console.log(line)
    api.insertLog(JSON.parse(line))
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(function(tokens,req,res){
  return JSON.stringify({
    method:tokens.method(req, res),
    url:tokens.url(req, res),
    status:tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
    contentLength:res['content-length'],
    timeStamp:Date.parse(tokens.date(req,res))
  })
},{stream:dbStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(expressJwt({secret:'secret'}).unless({path:['/api/createUser','/api/createUser']}))*/
app.use('/api/v2',chats)
app.use('/api/v1',users);
app.use('/api/v3',moniter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.io = chats.io

module.exports = app;
