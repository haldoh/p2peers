/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	name: { type: String, required: true },
	updated: { type: Date, 'default': Date.now },
	public: Boolean,
	admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	messages: [
		{
			body: { type: String, required: true },
			time: { type: Date, 'default': Date.now, expires: 60 * 60 * 24 },
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
		}
	]
});

ChatSchema.methods.newMessage = function (msg, user, cb) {
	// Push new message
	var pos = this.messages.push({
		body: msg,
		user: user
	});
	// Set update time
	this.updated = this.messages[pos - 1].time;
	// Save changes
	this.save(cb);
};

ChatSchema.methods.addUser = function (user, cb) {
	// Use addToSet to insert the new user only if it is not already in the array
	this.users.addToSet(user);
	// Save changes
	this.save(function (err, chat) {
		cb(user, err, chat);
	});
};

ChatSchema.methods.removeUser = function (user, cb) {
	// Use pull to remove user from the array
	this.users.pull(user);
	// Save changes
	this.save(function (err, chat) {
		cb(user, err, chat);
	});
};

ChatSchema.methods.addAdmin = function (user, cb) {
	// Only users of the chat can become admins
	if (this.users.indexOf(user) > -1) {
		// Use addToSet to insert the new admin only if it is not already in the array
		this.admins.addToSet(user);
		// Save changes
		this.save(function (err, chat) {
			cb(user, err, chat);
		});
	}
};

module.exports = mongoose.model('Chat', ChatSchema);
