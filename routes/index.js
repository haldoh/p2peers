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

module.exports = router;
