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
	User = mongoose.model('User'),
	Chat = mongoose.model('Chat');

var user, chat;

describe('Chat Model Unit Test:', function () {
	
	// Create new user once before all the tests
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
				done();
			});
			
		});
		
	});
	
	// Refresh chat for each test
	beforeEach(function (done) {
		chat = new Chat({
			name: "test chat",
			admins: user,
			users: user
		});

		chat.save(function (err, newChat) {
			if (err) { return done(err); }
			chat = newChat;
			done();
		});
	});
	
	describe('Test chat save', function () {
	
		it('Should save without errors', function () {
			chat.save(function (err) {
				should.not.exist(err);
			});
		});
		
		it('Should save chat data in user', function () {
			user.chats.push(chat);
			user.save(function (err) {
				should.not.exist(err);
			});
		});
		
		it('Should not save without a chat name', function () {
			chat.name = '';
			chat.save(function (err) {
				should.exist(err);
			});
		});
		
	});
	
	describe('Test new message', function () {
	
		it('Should save new message', function () {
			chat.newMessage('Hi!', user, function (err) {
				should.not.exist(err);
				should.exist(chat.messages[0]);
			});
		});
		
		it('Should set correct update time', function () {
			chat.newMessage('Hi!', user, function (err) {
				should.not.exist(err);
				chat.updated.should.be.exactly(chat.messages[0].time);
			});
		});
		
		it('Should not save empty message', function () {
			chat.newMessage('', user, function (err) {
				should.exist(err);
			});
		});
		
	});
	
	// Refresh chat for each test
	afterEach(function (done) {
		Chat.remove({}, done);
	});
	
	// Clean up users after tests
	after(function (done) {
		User.remove({}, done);
	});
	
});
