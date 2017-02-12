"use strict";

angular.module("nextrunApp.race").controller("RedirectionModalController",
	function(
		$scope,
		$modalInstance,
		$state,
		raceId) {

		$scope.raceId = raceId;

		$scope.goToEdit = function() {
			$state.go("edit", {id: $scope.raceId});
			$modalInstance.close();
		};

		$scope.goToMyRaces = function() {
			$state.go("myraces");
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	});