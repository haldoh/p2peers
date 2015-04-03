/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
/*jslint nomen:true*/
"use strict";

// requires
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// TODO remove this
var env = process.env.NODE_ENV || 'local';
var config = require('./config.js')(env);

// Express config
module.exports = function () {
	
	// Create app
	var app = express();
	
	// http server
	var server = require('http').createServer(app);
	
	// view engine setup
	app.set('views', './views');
	app.set('view engine', 'jade');
	// jade layouts disabled by default
	app.set('view options', { layout: false });
	// show pretty html
	app.locals.pretty = true;

	// Logger setup
	var accessLogStream = fs.createWriteStream(__dirname + '/../access.log', {flags: 'a'});
	if(config.logFile) {
		app.use(logger('combined', {stream: accessLogStream}));
	}
	if (config.logConsole) {
		app.use(logger('dev'));
	}
	
	app.use(favicon(__dirname + '/../public/favicon.ico'));
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

	// Static files (CSS, JS, etc...)
	app.use(serveStatic('./public', {index: false}));
	// Static/generic routes
	app.use('/', require('../routes/static'));
	// Users routes
	app.use('/users', require('../routes/users'));
	// Chats routes
	app.use('/chats', require('../routes/chats'));
	
	
	/* error handlers */
	
	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

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
	
	// Return the express app
	return app;
	
};