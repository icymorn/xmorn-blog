'use strict';

var express    = require('express');
var routes     = require('./routes');
var http       = require('http');
var path       = require('path');
var MongoStore = require('connect-mongo')(express);
var settings   = require('./settings');
var flash      = require('connect-flash');
var sass       = require('node-sass');


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');


    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({keepExtensions: true, uploadDir: './public/images'}));

    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser());
    app.use(flash());
    app.use(express.session({
        secret: settings.cookieSecret,
        key: settings.db,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30
        },
        store: new MongoStore({
            db: settings.db
        })
    }));

    app.use(sass.middleware({
        src: __dirname + '/precompile',
        dest: __dirname+ '/public',
        debug: true,
        outputStyle: 'compressed'//'expanded'
    }));
    
    app.use(app.router);

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
});

app.locals({
    logo: 'XMORN',
    script: [],
    css: [],
    getScriptTags: function () {
        if (this.script.length >0 ) {
            return this.script.map(function (filename) {
                return '<script src=\"' + filename + '\"></script>';
            }).join('\n');
        }else{
            return '';
        }

    },
    getStyleTags: function () {
        if (this.css.length >0 ) {
            return this.css.map(function (filename) {
                return '<link rel=\"stylesheet\" href=\"' + filename + '\"/>';
            }).join('\n');
        }else{
            return '';
        }
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port' + app.get('port'));
});

routes(app);
