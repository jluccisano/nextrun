"use strict";

angular.module("nextrunApp.race").controller("RedirectionModalController",
	function(
		$scope,
		$modalInstance,
		$location,
		raceId) {

		$scope.raceId = raceId;

		$scope.goToEdit = function() {
			$location.path("/races/edit/" + $scope.raceId);
			$modalInstance.close();
		};

		$scope.goToMyRaces = function() {
			$location.path("/myraces");
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	});