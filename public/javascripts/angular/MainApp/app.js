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
var app = angular.module(mainAppModuleName, ['ui.router', 'users', 'chats']);

// Hashbangs
app.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.hashPrefix('!');
}]);

// Fix for Facebook redirect bug (useful?)
if (window.location.has === '#_=_') { window.location.hash = '#!'; }

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
						return chats.getMsgs($stateParams.id);
					}],
					users: ['$stateParams', 'chats', function ($stateParams, chats) {
						return chats.getUsers($stateParams.id);
					}]
				}
			});
	
		$urlRouterProvider.otherwise('home');
		
	}
]);