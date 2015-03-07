/*
 * Copyright (C) 2015 Aldo Ambrosioni
 * ambrosioni.ict@gmail.com
 * 
 * This file is part of the p2peers project
 */

/*jslint node: true*/
/*global angular*/
"use strict";

// App name and initialization
var mainAppModuleName = 'p2peers';
var app = angular.module(mainAppModuleName, ['ui.router']);

// Manual bootstrapping
/*angular.element(document).ready(function () {
	angular.bootstrap(document, [mainAppModuleName]);
});*/

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
		return o;
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'chats',
	function ($scope, chats) {
		$scope.chats = chats.chats;
	}
]);