/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	body: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chats' }
});

module.exports = mongoose.model('Message', MessageSchema);