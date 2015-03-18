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
var Users = require('../controllers/users.js');
var express = require('express');
var router = express.Router();

/* GET login page */
router.get('/login', Users.isNotLoggedIn, Users.renderLogin);

/* POST try to login */
router.post('/login', Users.isNotLoggedIn, passport.authenticate('local', { successRedirect: '/',
																										failureRedirect: '/login',
																										failureFlash: 'Invalid credentials.' }), function (req, res) {});

/* GET signup page */
router.get('/signup', Users.isNotLoggedIn, Users.renderSignup);

/* POST sign up */
router.post('/signup', Users.isNotLoggedIn, Users.checkUser, Users.checkEmail, Users.passwordValidity, Users.signup);

/* GET logout */
router.get('/logout', Users.isLoggedIn, Users.logout);

/* GET users listing. */
router.get('/', Users.isLoggedIn, Users.renderUsersList);

/* GET user profile */
router.get('/:user', Users.isLoggedIn, Users.renderUserProfile);

/* PARAM find a user */
router.param('user', function (req, res, next, username) {
	// Find user
	var query = User.findOne({ username: username });
	query.exec(function (err, user) {
		// If there are no errors, save it in req.user and continue
		if (err) { return next(err); }
		if (!user) { return next(new Error('can\'t find user')); }
		req.user = user;
		return next();
	});
});

module.exports = router;
