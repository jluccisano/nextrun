"use strict";

angular.module("nextrunApp.race").controller("ChangeTypeConfirmationModalController",
	function(
		$scope,
		$modalInstance) {

		$scope.continue = function() {
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	});