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

// Main controller for chats list
angular.module('p2peers').controller('MainCtrl', [
	'$scope',
	'chats',
	function ($scope, chats) {
		/* Hide/show new chat form */
		$scope.chatForm = false;
		$scope.showForm = function () {
			$scope.chatForm = true;
		};
		$scope.hideForm = function () {
			$scope.name = '';
			$scope.chatForm = false;
		};
		
		$scope.chats = chats.chats;
		// create a new chat
		$scope.newChat = function () {
			// Create only chats with non-empty names
			if ($scope.name === '') { return; }
			chats.newChat({ name: $scope.name });
			// Reset form
			$scope.name = '';
			$scope.hideForm();
		};
	}
]);

// Controller for single chat page
angular.module('p2peers').controller('ChatCtrl', [
	'$scope',
	'chats',
	'chat',
	function ($scope, chats, chat) {
		$scope.actionUrl = "/chats/" + chat._id + "/newmessage";
		$scope.chat = chat;
		// Send a new message
		$scope.sendMessage = function () {
			// Send only non-empty messages
			if ($scope.body === '') { return; }
			chats.sendMessage(chat._id, {
				body: $scope.body
			}).success(function (message) {
				// Update this client's message list
				$scope.chat.chatmessages.push(message);
			});
			// Reset form
			$scope.body = '';
		};
	}
]);