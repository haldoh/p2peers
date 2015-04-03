/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

// requires
var User = require('mongoose').model('User');

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
		req.p2pSignupRedir = true;
	} else {
		User.findOne({ username: req.body.username }, function (err, user) {
			if (user) {
				// User already exists
				req.flash('error', "Username already in use.");
				req.p2pSignupRedir = true;
			}
		});
	}
	return next();
};

// Check email validity
module.exports.checkEmail = function (req, res, next) {
	if (req.body.email === '') {
		// Email can't be empty
		req.flash('error', "Email can not be empty.");
		req.p2pSignupRedir = true;
	} else if (req.body.email !== req.body.emailConfirm) {
		// Emails do not match
		req.flash('error', "Email addresses do not match.");
		req.p2pSignupRedir = true;
	} else {
		User.findOne({ email: req.body.email }, function (err, user) {
			if (user) {
				// Email already in use
				req.flash('error', "Email already in use.");
				req.p2pSignupRedir = true;
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
		req.p2pSignupRedir = true;
	}
	if (req.body.password.length < 8) {
		// Password is too short
		req.flash('error', "Password must contain at least 8 characters.");
		req.p2pSignupRedir = true;
	}
	return next();
};

// Signup a new user
module.exports.signup = function (req, res, next) {
	// Check if we need a redirect
	if (req.p2pSignupRedir) {
		res.redirect('/signup');
	} else {
		// New account
		User.register(new User({
			username:	req.body.username,
			email:		req.body.email,
			name:			req.body.name,
			surname:	req.body.surname
		}), req.body.password, function (err, user) {
			if (err) {
				// Return to sign up page if there is an error
				res.redirect('/signup');
			} else {
				// If everything's ok, return to home page
				res.redirect('/');
			}
		});
	}
};

// Logout a user
module.exports.logout = function (req, res, next) {
	req.logout();
	res.redirect('/');
};

// Render login page
module.exports.renderLogin = function (req, res, next) {
	res.render('login', { title: 'login', message: req.flash('error') });
};

// Render signup page
module.exports.renderSignup = function (req, res, next) {
	res.render('signup', { title: 'Sign up', errors: req.flash('error') });
};

// Render a list of users
module.exports.renderUsersList = function (req, res, next) {
	// TODO
	res.send('respond with a resource');
};

// Render a user profile
module.exports.renderUserProfile = function (req, res, next) {
	// TODO
	res.send(req.user.username);
};