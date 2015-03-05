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
var routeFunct = require('./routeFunctions');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});

/* GET login page */
router.get('/login', routeFunct.isNotLoggedIn, function (req, res, next) {
	res.render('login', { title: 'login', message: req.flash('error') });
});

/* POST try to login */
router.post('/login', routeFunct.isNotLoggedIn, passport.authenticate('local', { successRedirect: '/',
																										failureRedirect: '/login',
																										failureFlash: 'Invalid credentials.' }), function (req, res) {});

/* GET signup page */
router.get('/signup', routeFunct.isNotLoggedIn, function (req, res, next) {
	res.render('signup', { title: 'Sign up', errors: req.flash('error') });
});

/* POST sign up */
router.post('/signup', routeFunct.isNotLoggedIn, routeFunct.checkUser, routeFunct.checkEmail, routeFunct.passwordValidity, function (req, res, next) {
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

// Logout action
router.get('/logout', routeFunct.isLoggedIn, function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
