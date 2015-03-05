/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var express = require('express');
var router = express.Router();

/*
 * Functions
 */
// Check if a user is logged in before using certain routes
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) { return next();	}
	res.redirect('/');
}
// Check user validity
function checkUser(req, res, next) {
	if (req.body.username === '') {
		// Username can't be empty
		req.flash('error', "Username can not be empty.");
		res.redirect(req.get('referer'));
	} else {
		User.findOne({ username: req.body.username }, function (err, user) {
			if (user) {
				// User already exists
				req.flash('error', "Username already in use.");
				res.redirect(req.get('referer'));
			} else {
				return next();
			}
		});
	}
}
// Check email validity
function checkEmail(req, res, next) {
	if (req.body.email === '') {
		// Email can't be empty
		req.flash('error', "Email can not be empty.");
		res.redirect(req.get('referer'));
	} else if (req.body.password !== req.body.passConfirm) {
		// Passwords do not match
		req.flash('error', "Email addresses do not match.");
		res.redirect(req.get('referer'));
	} else {
		User.findOne({ email: req.body.email }, function (err, user) {
			if (user) {
				// Email already in use
				req.flash('error', "Email already in use.");
				res.redirect(req.get('referer'));
			} else {
				return next();
			}
		});
	}
}
// Check passwords validity before adding user
function passwordValidity(req, res, next) {
	var redir = false;
	if (req.body.password !== req.body.passConfirm) {
		// Passwords do not match
		req.flash('error', "Passwords do not match.");
		redir = true;
	}
	if (req.body.password.length < 8) {
		// Password is too short
		req.flash('error', "Password must contain at least 8 characters.");
		redir = true;
	}
	if (redir) {
		res.redirect(req.get('referer'));
	} else {
		return next();
	}
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});

/* GET login page */
router.get('/login', function (req, res, next) {
	res.render('login', { title: 'login', message: req.flash('error') });
});

/* POST try to login */
router.post('/login', passport.authenticate('local', { successRedirect: '/',
																										failureRedirect: '/login',
																										failureFlash: 'Invalid credentials.' }), function (req, res) {});

/* GET signup page */
router.get('/signup', function (req, res, next) {
	res.render('signup', { title: 'Sign up', message: req.flash('error') });
});

/* POST sign up */
router.post('/signup', checkUser, checkEmail, passwordValidity, function (req, res, next) {
	// New account
	User.register(new User({
		username:	req.body.username,
		email:		req.body.email,
		name:			req.body.name,
		surname:	req.body.surname
	}), req.body.password, function (err, account) {
		if (err) {
			// Return to sign up page if there is an error
			res.redirect('/signup');
		} else {
			// If everything's ok, return to home page
			res.redirect('/');
		}
	});
});

module.exports = router;
