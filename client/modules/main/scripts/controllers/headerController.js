"use strict";

angular.module("nextrunApp").controller("HeaderController",
	function(
		$scope,
		$location,
		AuthService,
		RaceService) {

		$scope.user = AuthService.user;
		$scope.userRoles = AuthService.userRoles;
		$scope.accessLevels = AuthService.accessLevels;


		$scope.autocomplete = function(text) {
			return RaceService.autocomplete(text).then(function(response) {
				return response.data.items;
			});
		};

		$scope.onSelect = function($item) {
			$location.path("/races/view/" + $item._id + "/");
		};

		$scope.logout = function() {
			AuthService.logout().then(function() {
				$location.path("/login");
			});
		};

		$scope.login = function() {
			$location.path("/login");
		};
	});