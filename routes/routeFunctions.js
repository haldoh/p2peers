/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

var mongoose = require('mongoose');
var User = mongoose.model('User');

// Check if a user is logged in before using certain routes
module.exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
};

// Check if a user is NOT logged in before using certain other routes
module.exports.isNotLoggedIn = function (req, res, next) {
	if (!req.isAuthenticated()) { return next(); }
	res.redirect('/');
};

// Check user validity
module.exports.checkUser = function (req, res, next) {
	if (req.body.username === '') {
		// Username can't be empty
		req.flash('error', "Username can not be empty.");
		req.p2pRedir = true;
	} else {
		User.findOne({ username: req.body.username }, function (err, user) {
			if (user) {
				// User already exists
				req.flash('error', "Username already in use.");
				req.p2pRedir = true;
			}
		});
	}
	return next();
};

// Check email validity
module.exports.checkEmail = function (req, res, next) {
	console.log(req.p2pRedir);
	if (req.body.email === '') {
		// Email can't be empty
		req.flash('error', "Email can not be empty.");
		req.p2pRedir = true;
	} else if (req.body.password !== req.body.passConfirm) {
		// Passwords do not match
		req.flash('error', "Email addresses do not match.");
		req.p2pRedir = true;
	} else {
		User.findOne({ email: req.body.email }, function (err, user) {
			if (user) {
				// Email already in use
				req.flash('error', "Email already in use.");
				req.p2pRedir = true;
			}
		});
	}
	return next();
};

// Check passwords validity before adding user
module.exports.passwordValidity = function (req, res, next) {
	if (req.body.password !== req.body.passConfirm) {
		// Passwords do not match
		req.flash('error', "Passwords do not match.");
		req.p2pRedir = true;
	}
	if (req.body.password.length < 8) {
		// Password is too short
		req.flash('error', "Password must contain at least 8 characters.");
		req.p2pRedir = true;
	}
	return next();
};