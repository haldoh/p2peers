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

var agent = request.agent(app);

describe('Users Controller Unit Tests:', function () {
	
	var signupUserData = {
		username: 'testuser',
		email: 'user@test.com',
		emailConfirm: 'user@test.com',
		password: 'password',
		passConfirm: 'password',
		name: 'user',
		surname: 'of test'
	};
	
	describe('Test Signup', function () {
		
		it('Should not signup a user with non-matching passwords', function (done) {
			signupUserData.passConfirm = 'abcd1234';
			request(app)
				.post('/signup')
				.send(signupUserData)
				.expect('Location', '/signup', function () {
					signupUserData.passConfirm = signupUserData.password;
					done();
				});
		});
		
		it('Should not signup a user with non-matching emails', function (done) {
			signupUserData.emailConfirm = 'wrong@email.com';
			request(app)
				.post('/signup')
				.send(signupUserData)
				.expect('Location', '/signup', function () {
					signupUserData.emailConfirm = signupUserData.email;
					done();
				});
		});
		
		it('Should signup a new user', function (done) {
			request(app)
				.post('/signup')
				.send(signupUserData)
				.expect('Location', '/', done);
		});
		
		it('Should not signup the same user again', function (done) {
			request(app)
				.post('/signup')
				.send(signupUserData)
				.expect('Location', '/signup', done);
		});
		
	});
	
	
	describe('Test Login/Logout', function () {
		
		it('Should login with new user and redirect to /', function (done) {
			agent
				.post('/login')
				.send({ username: signupUserData.username, password: signupUserData.password })
				.expect('Location', '/', done);
		});
		
		it('Should logout and redirect to /', function (done) {
			agent
				.get('/logout')
				.expect('Location', '/', done);
		});
		
		it('Should not login a non-existing user and redirect to /login', function (done) {
			agent
				.post('/login')
				.send({ user: 'pippo', password: 'abcd' })
				.expect('Location', '/login', done);
		});
		
	});
	
	after(function (done) {
		User.remove({}, done);
	});
	
});