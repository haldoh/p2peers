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
var Users = require('../controllers/users');
var Chats = require('../controllers/chats');
var express = require('express');
var router = express.Router();

router.use(Users.isLoggedIn);

router.route('/')
	// GET chats list
	.get(Chats.getChats)
	// POST new chat
	.post(Chats.newChat);

router.route('/:chat')
	// GET this chat
	.get(Chats.getChat)
	// POST new chat message
	.post(Chats.newMessage)
	// DELETE delete this chat
	.delete(Chats.deleteChat);

router.route('/:chat/public')
	// PUT make this chat public
	.put(Chats.publicChat)
	// DELETE make this chat private
	.delete(Chats.privateChat);

router.route('/:chat/:user')
	// PUT add user to the chat
	.put(Chats.addUser)
	// DELETE remove user from the chat
	.delete(Chats.removeUser);

router.route('/:chat/:user/admin')
	// PUT make user admin
	.put(Chats.addAdmin);

/* PARAM chat id */
router.param('chat', Chats.findChatById);

/* PARAM user id */
router.param('user', Chats.findUserById);

module.exports = router;