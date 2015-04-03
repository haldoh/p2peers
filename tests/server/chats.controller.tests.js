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

var user, agent, chat;

describe('Chats Controller Unit Tests:', function () {
	
	before(function (done) {
		// Make sure User is empty
		User.remove({}, function () {
			
			User.register(new User({
				username:	'testuser',
				email:		'testuser@test.com',
				name:			'firstname',
				surname:	'lastname'
			}), 'password', function (err, newUser) {
				if (err) { return done(err); }
				user = newUser;
				agent = request.agent(app);
				agent
					.post('/login')
					.send({ username: 'testuser', password: 'password' })
					.end(done);
			});
			
		});
		
	});
	
	describe('Test chat functions', function () {
		
		it('Should return a new chat', function (done) {
			var chatName = 'testChat';
			agent
				.post('/chats/newchat')
				.send({ name: chatName })
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					res.body.name.should.be.exactly(chatName);
					res.body.users[0].should.be.exactly(user.id);
					res.body.admins[0].should.be.exactly(user.id);
					done();
				});
				
		});
		
	});
	
	// Refresh chat for each test
	afterEach(function (done) {
		Chat.remove({}, done);
	});
	
	after(function (done) {
		User.remove({}, done);
	});
	
});