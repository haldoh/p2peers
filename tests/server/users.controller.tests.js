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
	User = mongoose.model('User');

var user, agent;

describe('Users Controller Unit Tests:', function () {
	
	before(function (done) {
		User.register(new User({
			username:	'testuser',
			email:		'testuser@test.com',
			name:			'firstname',
			surname:	'lastname'
		}), 'password', function (err, newUser) {
			if (err) { return done(err); }
			user = newUser;
			agent = request.agent(app);
			done();
		});
	});
	
	describe('Test Login/Logout', function () {
		
		it('Should login and redirect to /', function (done) {
			agent
				.post('/login')
				.send({ username: 'testuser', password: 'password' })
				.expect('Location', '/', done);
		});
		
		it('Should logout and redirect to /', function (done) {
			agent
				.get('/logout')
				.expect('Location', '/', done);
		});
		
		it('Should not login and redirect to /login', function (done) {
			agent
				.post('/login')
				.send({ user: 'pippo', password: user.password })
				.expect('Location', '/login', done);
		});
		
	});
	
	after(function (done) {
		User.remove({}, function () {
			done();
		});
	});
	
});