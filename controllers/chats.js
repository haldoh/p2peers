/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

var Chat = require('mongoose').model('Chat');

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