var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var post = require('./routes/post');
var info = require('./routes/information');
var api = require('./routes/api');
var user = require('./routes/user');

var sass = require('node-sass');
//var compass = require('node-compass');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'secret'}));
app.use(flash());

app.use(sass.middleware({
    src: __dirname + '/public',
    dest: __dirname+ '/public',
    debug: true,
    outputStyle: 'expanded'
}));

app.use(express.static(path.join(__dirname, 'public')));
//app.use(compass({mode: 'expanded'}));

app.use('/', routes);
app.use('/post', post);
app.use('/user', user);
app.use('/info', info);
app.use('/api', api);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/// error handlers

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
