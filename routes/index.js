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
// Check if user already exists
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
  res.render('index');
});

/* GET login page */
router.get('/login', function (req, res, next) {
	res.render('login', { title: 'login', message: req.flash('error') });
});

/* POST try to login */
router.post('/login', passport.authenticate('local', { successRedirect: '/',
																										failureRedirect: '/login',
																										failureFlash: 'Invalid credentials.' }), function (req, res) {});

module.exports = router;
