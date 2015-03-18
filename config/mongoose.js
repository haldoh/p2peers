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
var env = process.env.NODE_ENV || 'local';
var config = require('./config.js')(env);
var mongoose = require('mongoose');

// Mongoose config
module.exports = function () {
	
	// connect to db
	var db = mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.name);
	
	// models
	require('../models/Users');
	require('../models/Chats');
	require('../models/ChatMessages');

	return db;
};