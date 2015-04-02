/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

var passport = require('passport');
var Users = require('../controllers/users');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	// Build a custom version of user for angularjs services
	var jsonUser = null;
	if (req.user) {
		jsonUser = {};
		jsonUser.name = req.user.name;
		jsonUser.surname = req.user.surname;
		jsonUser.username = req.user.username;
	}
  res.render('index', { jsonUser: JSON.stringify(jsonUser), user: req.user });
});

/* GET login page */
router.get('/login', Users.isNotLoggedIn, Users.renderLogin);

/* POST try to login */
router.post('/login', Users.isNotLoggedIn, passport.authenticate('local', { successRedirect: '/',
																										failureRedirect: '/login',
																										failureFlash: 'Invalid credentials.' }));

/* GET signup page */
router.get('/signup', Users.isNotLoggedIn, Users.renderSignup);

/* POST sign up */
router.post('/signup', Users.isNotLoggedIn, Users.checkUser, Users.checkEmail, Users.passwordValidity, Users.signup);

/* GET logout */
router.get('/logout', Users.isLoggedIn, Users.logout);

module.exports = router;
