"use strict";

angular.module("nextrunApp").controller("HeaderController",
	function(
		$scope,
		$state,
		AuthService,
		RaceService) {

		$scope.user = AuthService.user;

		$scope.autocomplete = function(text) {
			return RaceService.autocomplete(text).then(function(response) {
				return response.data.items;
			});
		};

		$scope.onSelect = function($item) {
			$state.go("view", { id: $item._id });
			$scope.selectedItem = "";
		};

		$scope.goToMyRaces = function() {
			$state.go("myraces", { id: $scope.user.id });
		};

		$scope.logout = function() {
			AuthService.logout().then(function() {
				$state.go("login");
			});
		};

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.isAdmin = function() {
			return AuthService.isAdmin();
		};

		$scope.login = function() {
			$state.go("login");
		};
	});