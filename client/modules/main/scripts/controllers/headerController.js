"use strict";

angular.module("nextrunApp").controller("HeaderController",
	function(
		$scope,
		$state,
		$timeout,
		AuthService,
		RaceService,
		SharedCriteriaService) {

		$scope.user = AuthService.user;

		$scope.autocomplete = function(text) {
			return RaceService.autocomplete(text).then(function(response) {
				return response.data.items;
			});
		};

		$scope.onSelect = function($item) {
			$state.go("view", {
				id: $item._id
			});
			$scope.selectedItem = "";
		};

		$scope.logout = function() {
			AuthService.logout().then(function() {
				$state.go("login");
			});
		};

		$scope.goToSearch = function() {
			var criteria = {
				published: true,
				place: {
					country: "FR",
					location: {
						latitude: 46.227638,
						longitude: 2.213749000000007
					},
					name: "France",
					place_type: "country"
				}
			};

			$timeout(function() {
				SharedCriteriaService.prepForCriteriaBroadcast(criteria);
				$state.go("allraces");
			}, 1000);
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