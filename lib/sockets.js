/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node:true*/
"use strict";

var socketio = require('socket.io');

module.exports.listen = function (app) {
	// Listen for incomning connections
	var io = socketio.listen(app);
	
	// TODO do something
};