/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose'),
	deepPopulate = require('mongoose-deep-populate');

var UserSchema = new mongoose.Schema({
	username: { type: String, index: { unique: true } },
	email:		String,
	password: String,
	name:			String,
	surname:	String,
	chats:		[{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
	chatmessages:	[{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }]
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(deepPopulate);

module.exports = mongoose.model('User', UserSchema);
