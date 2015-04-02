/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
/*jshint mocha: true*/
"use strict";

var app = require('../../app.js'),
	request = require('supertest'),
	should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Chat = mongoose.model('Chat');

var user, chat;

describe('Chats Controller Unit Tests:', function () {
	
	beforeEach(function (done) {
		user = new User({
			username:	'testuser',
			email:		'testuser@test.com',
			password:	'password',
			name:			'firstname',
			surname:	'lastname',
		});
		
		user.save(function (err) { done(); });
		
	});
	
	
	
	afterEach(function (done) {
		User.remove({}, function () {
			done();
		});
	});
	
});