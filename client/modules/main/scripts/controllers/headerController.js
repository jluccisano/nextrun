"use strict";

angular.module("nextrunApp").controller("HeaderController",
	function(
		$scope,
		$state,
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
			$state.go("view", { id: $item._id });
			$scope.selectedItem = "";
		};

		$scope.logout = function() {
			AuthService.logout().then(function() {
				$state.go("login");
			});
		};

		$scope.login = function() {
			$state.go("login");
		};
	});