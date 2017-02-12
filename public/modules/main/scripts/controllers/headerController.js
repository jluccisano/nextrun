"use strict";

angular.module("nextrunApp").controller("HeaderController",
	function(
		$scope,
		$location,
		AuthService) {

		$scope.user = AuthService.user;
		$scope.userRoles = AuthService.userRoles;
		$scope.accessLevels = AuthService.accessLevels;

		$scope.logout = function() {
			AuthService.logout().then(function() {
				$location.path("/login");
			});
		};

		$scope.login = function() {
			$location.path("/login");
		};
	});