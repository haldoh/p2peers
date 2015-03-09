/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
/*jslint nomen: true*/
/*global angular*/
"use strict";

// Chats service
angular.module('p2peers').factory('chats', [
	'$http',
	function ($http) {
		var o = {
			chats: []
		};
		// Method to get all chats for the logged user
		o.getAll = function () {
			return $http.get('/chats').success(function (data) {
				angular.copy(data, o.chats);
			});
		};
		// Method to retrieve a single chat's messages
		o.getMsgs = function (id) {
			return $http.get('/chats/' + id + '/msgs').then(function (res) {
				return res.data;
			});
		};
		// Method to retrieve a single chat's users
		o.getUsers = function (id) {
			return $http.get('/chats/' + id + '/users').then(function (res) {
				return res.data;
			});
		};
		// Create a new chat
		o.newChat = function (chat) {
			return $http.post('/chats/newchat', chat).success(function (data) {
				o.chats.push(data);
			});
		};
		// Send a new message
		o.sendMessage = function (id, message) {
			return $http.post('/chats/' + id + '/newmessage', message);
		};
		return o;
	}
]);