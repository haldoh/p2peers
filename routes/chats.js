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
var Chat = mongoose.model('Chat');
var ChatMessage = mongoose.model('ChatMessage');
var routeFunct = require('./routeFunctions');
var express = require('express');
var router = express.Router();

/* GET all chats of the user */
router.get('/', routeFunct.isLoggedIn, function (req, res, next) {
	req.user.populate('chats', function (err, user) {
		if (err) { return next(err); }
		res.json(user.chats);
	});
});

/* GET new chat form */
router.get('/newchat', routeFunct.isLoggedIn, function (req, res, next) {
	res.render('newchat', { title: 'Create new chat', user: req.user });
});

/* POST new chat */
router.post('/newchat', routeFunct.isLoggedIn, function (req, res, next) {
	// Build a new chat
	var newChat = new Chat(req.body);
	// Creator is an admin and the first user
	newChat.admins.push(req.user);
	newChat.users.push(req.user);
	// Save new chat
	newChat.save(function (err, chat) {
		if (err) { return next(err); }
		// Add chat to user
		req.user.chats.push(newChat);
		// Save user
		req.user.save(function (err, user) {
			if (err) { return next(err); }
			res.json(newChat);
		});
	});
});

/* POST new message */
router.post('/:chat/newmessage', routeFunct.isLoggedIn, function (req, res, next) {
	// Build a new message
	var newMsg = new ChatMessage(req.body);
	// User is the owner of the message
	newMsg.user = req.user;
	// The chat in the url is the message's chat
	newMsg.chat = req.chat;
	// Save the message
	newMsg.save(function (err, msg) {
		if (err) { return next(err); }
		// Save reference in user
		req.user.chatmessages.push(newMsg);
		req.user.save(function (err, user) {
			if (err) { return next(err); }
			// Save reference in chat
			req.chat.chatmessages.push(newMsg);
			req.chat.save(function (err, chat) {
				if (err) { return next(err); }
				res.json(newMsg);
			});
		});
	});
});

/* GET a single chat */
router.get('/:chat', routeFunct.isLoggedIn, function (req, res, next) {
	req.chat.populate('chatmessages', function (err, chat) {
		if (err) { return next(err); }
		res.json(chat);
	});
});

/* PARAM chat id */
router.param('chat', function (req, res, next, id) {
	// Find chat by id
	Chat.findById(id, function (err, chat) {
		// If there are no errors, save it in req.chat and continue
		if (err) { return next(err); }
		if (!chat) { return next(new Error('can\'t find chat')); }
		req.chat = chat;
		return next();
	});
});

module.exports = router;