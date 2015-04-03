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
	should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

var user = new User({
	username:	'testuser',
	email:		'testuser@test.com',
	name:			'firstname',
	surname:	'lastname'
}),
	userPwd = 'password';

describe('User Model Unit Test:', function () {
	
	describe('Test user save', function () {
	
		it('Should register a new user without errors', function (done) {
			User.register(user, userPwd, function (err, newUser) {
				should.not.exists(err);
				newUser.username.should.be.exactly(user.username);
				newUser.name.should.be.exactly(user.name);
				newUser.surname.should.be.exactly(user.surname);
				done();
			});
		});
		
		it('Should not register without username', function () {
			user.username = '';
			User.register(user, userPwd, function (err, newUser) {
				should.exist(err);
			});
		});
		
		it('Should not register without email', function () {
			user.email = '';
			User.register(user, userPwd, function (err, newUser) {
				should.exist(err);
			});
		});
	
	});
	
	afterEach(function (done) {
		User.remove({}, done);
	});
	
});
