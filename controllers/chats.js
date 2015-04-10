/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

var Chat = require('mongoose').model('Chat'),
	User = require('mongoose').model('User');

// Remove hash and salt from users before sending them around
var safeUser = function (user) {
	user.hash = '';
	user.salt = '';
	return user;
};

// Get a list of chats for the logged user
module.exports.getChats = function (req, res, next) {
	req.user
		.populate('chats', '-messages')
		.exec(function (err, user) {
			if (err) { return next(err); }
			// This user contains all the data for all his chats
			// excluding messages (for bandwith's sake)
			res.json(safeUser(user));
		});
};

// Create a new chat
module.exports.newChat = function (req, res, next) {
	var newChat = new Chat(req.body);
	// Current logged user is admin and first user
	newChat.admins.push(req.user);
	newChat.users.push(req.user);
	// Save
	newChat.save(function (err, chat) {
		if (err) { return next(err); }
		// Add chat to user
		req.user.chats.push(chat);
		req.user.save(function (err, user) {
			if (err) { return next(err); }
			// If all goes well, return the newly created chat
			res.json(chat);
		});
	});
};

// Get a chat, including user list and messages
module.exports.getChat = function (req, res, next) {
	req.chat
		.populate('users', '-hash -salt')
		.exec(function (err, chat) {
			if (err) { return next(err); }
			// If all goes well, return the chat with the populated data
			res.json(chat);
		});
};

// Post a message to a chat
module.exports.newMessage = function (req, res, next) {
	// Chat and user are already in req
	req.chat.newMessage(req.body.body, req.user, function (err, newChat) {
		if (err) { return next(err); }
		// If all goes well, return the chat with the new message
		res.json(newChat);
	});
};

// TODO Delete a chat
module.exports.deleteChat = function (req, res, next) {
	// TODO
	next();
};

// Make a chat public
module.exports.publicChat = function (req, res, next) {
	req.chat.public = true;
	req.chat.save(function (err, chat) {
		if (err) { return next(err); }
		res.sendStatus(200);
	});
};

// Make a chat private
module.exports.privateChat = function (req, res, next) {
	req.chat.public = false;
	req.chat.save(function (err, chat) {
		if (err) { return next(err); }
		res.sendStatus(200);
	});
};

// Add a user to the chat
module.exports.addUser = function (req, res, next) {
	req.chat.addUser(req.paramUser, function (user, err, newChat) {
		if (err) { return next(err); }
		res.json(safeUser(user));
	});
};

// Remove a user from the chat
module.exports.removeUser = function (req, res, next) {
	req.chat.removeUser(req.paramUser, function (user, err, newChat) {
		if (err) { return next(err); }
		res.json(safeUser(user));
	});
};

// Add a user to the admins list
module.exports.addAdmin = function (req, res, next) {
	req.chat.addAdmin(req.paramUser, function (user, err, newChat) {
		if (err) { return next(err); }
		res.json(safeUser(user));
	});
};

// Find a chat by id - param
module.exports.findChatById = function (req, res, next, id) {
	Chat.findById(id, function (err, chat) {
		// If there are no errors, save it in req.chat and continue
		if (err) { return next(err); }
		if (!chat) { return next(new Error('can\'t find chat')); }
		req.chat = chat;
		return next();
	});
};

// Find a user by id - param
module.exports.findUserById = function (req, res, next, id) {
	User.findById(id, function (err, user) {
		// If there are no errors, save it in req.paramUser and continue
		if (err) { return next(err); }
		if (!user) { return next(new Error('can\'t find user')); }
		req.paramUser = user;
		return next();
	});
};