/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');

var ChatMessageSchema = new mongoose.Schema({
	body: String,
	time: { type: Date, 'default': Date.now, expires: 60 * 60 * 24 },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);