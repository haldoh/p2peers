/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
	email:		String,
	password: String,
	name:			String,
	surname:	String,
	chats:		[{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
