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
	name: String,
	admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Messages' }]
});

module.exports = mongoose.model('Chat', ChatSchema);
