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

// App name and initialization
var mainAppModuleName = 'p2peers';
var app = angular.module(mainAppModuleName, ['ui.router']);

// Manual bootstrapping
angular.element(document).ready(function () {
	angular.bootstrap(document, [mainAppModuleName]);
});

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	
	function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					chatPromise: ['chats', function (chats) {
						return chats.getAll();
					}]
				}
			})
			.state('chat', {
				url: '/chats/{id}',
				templateUrl: '/chat.html',
				controller: 'ChatCtrl',
				resolve: {
					chat: ['$stateParams', 'chats', function ($stateParams, chats) {
						return chats.get($stateParams.id);
					}]
				}
			});
	
		$urlRouterProvider.otherwise('home');
		
	}
]);

app.factory('chats', [
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
		// Method to retrieve a single chat
		o.get = function (id) {
			return $http.get('/chats/' + id).then(function (res) {
				return res.data;
			});
		};
		// Create a new chat
		o.newChat = function (chat) {
			return $http.post('/chats/newchat', chat);
		};
		// Send a new message
		o.sendMessage = function (id, message) {
			return $http.post('/chats/' + id + '/newmessage', message);
		};
		return o;
	}
]);

// Main controller for chats list
app.controller('MainCtrl', [
	'$scope',
	'chats',
	function ($scope, chats) {
		$scope.chats = chats.chats;
		$scope.newChat = function () {
			chats.newChat({ name: $scope.name });
		};
		$scope.name = '';
	}
]);

// Controller for single chat page
app.controller('ChatCtrl', [
	'$scope',
	'chats',
	'chat',
	function ($scope, chats, chat) {
		$scope.actionUrl = "/chats/" + chat._id + "/newmessage";
		$scope.chat = chat;
		// Send a new message
		$scope.sendMessage = function () {
			if ($scope.body === '') { return; }
			chats.sendMessage(chat._id, {
				body: $scope.body
			}).success(function (message) {
				$scope.post.messages.push(message);
			});
			$scope.body = '';
		};
	}
]);