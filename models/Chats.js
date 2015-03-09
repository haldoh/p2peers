/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate');

var ChatSchema = new mongoose.Schema({
	name: String,
	updated: { type: Date, 'default': Date.now },
	admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	chatmessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }]
});

ChatSchema.plugin(deepPopulate);

module.exports = mongoose.model('Chat', ChatSchema);
