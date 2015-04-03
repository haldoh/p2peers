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
	
	var chatName = 'testChat';
	
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
			agent
				.post('/chats')
				.send({ name: chatName })
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					res.body.name.should.be.exactly(chatName);
					res.body.users[0].should.be.exactly(user.id);
					res.body.admins[0].should.be.exactly(user.id);
					done();
				});
				
		});
		
		it('Should return a chat with a new message', function (done) {
			Chat.findOne({ name: chatName }, function (err, chat) {
				var msgsNum = chat.messages.length;
				var msg = 'a new message';
				agent
					.post('/chats/' + chat.id)
					.send({ body: msg })
					.expect('Content-Type', /json/)
					.end(function (err, res) {
						var newMsgsNum = res.body.messages.length;
						var newMsg = res.body.messages[newMsgsNum - 1].body;
						newMsgsNum.should.be.exactly(msgsNum + 1);
						newMsg.should.be.exactly(msg);
						done();
					});
			});
			
		});
		
	});
	
	after(function (done) {
		Chat.remove({}, function () {
			User.remove({}, done);
		});
	});
	
});