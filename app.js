/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// environment
var env = process.env.NODE_ENV || 'local';
var config = require('./config')(env);
// mongodb and mongoose
var mongoose = require('mongoose');
var User = require('./models/Users');
var Chat = require('./models/Chats');
var ChatMessage = require('./models/ChatMessages');
// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var chats = require('./routes/chats');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// jade layouts disabled by default
app.set('view options', { layout: false });
// show pretty html
app.locals.pretty = true;

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: "Power of the dragonflame",
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({
		db: config.mongo.sessionName,
		host: config.mongo.host,
		port: config.mongo.port
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Static files (CSS, JS, etc...)
app.use(serveStatic('./public', {index: false}));
// Main routes
app.use('/', routes);
// Users routes
app.use('/users', users);
// Chats routes
app.use('/chats', chats);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// http server
var http = require('http').Server(app);

// socket.io
var io = require('./lib/sockets').listen(http);

// MongoDB
mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.name);

module.exports = app;
