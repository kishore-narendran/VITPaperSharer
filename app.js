'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('express-mongo-db');
var multer = require('multer');
var os = require('os');
var path = require('path');

var web = require('./routes/web');
var api = require('./routes/api')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Cookie Parser
let secret = process.env.SECRET_KEY || 'randomsecretstring';
app.use(cookieParser(secret, {signed: true}));

// Multer for image uploading
app.use(multer({dest: path.join(__dirname, 'public', 'uploads')}));

// MongoDB
let mongodbOptions = {
    hosts: [{
        host: process.env.MONGODB_HOST || '127.0.0.1',
        port: process.env.MONGODB_PORT || '27017'
    }],
    database: process.env.MONGODB_DATABASE || 'VITPaperSharer',
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    options: {
        db: {
            native_parser: true,
            recordQueryStats: true,
            retryMiliSeconds: 500,
            numberOfRetries: 10
        },
        server: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 10000
            },
            auto_reconnect: true,
            poolSize: 50
        },
        replset: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 10000
            }
        }
    }
};
app.use(mongodb(require('mongodb'), mongodbOptions));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', web);
app.use('/api', api);

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
