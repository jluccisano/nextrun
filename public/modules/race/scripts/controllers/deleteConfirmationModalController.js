"use strict";

angular.module("nextrunApp.race").controller("DeleteConfirmationModalController",
	function(
		$scope,
		$modalInstance,
		$translate,
		$translatePartialLoader,
		$filter,
		AlertService,
		RaceService,
		race) {

		$scope.race = race;

		$scope.deleteRace = function() {
			RaceService.delete($scope.race._id).then(
				function() {
					AlertService.add("success", $filter("translate")("message.delete.successfully"), 3000);
					$modalInstance.close();
				});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};

	});