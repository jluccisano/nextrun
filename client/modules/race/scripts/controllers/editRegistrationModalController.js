"use strict";

angular.module("nextrunApp.race").controller("EditRegistrationModalController", function(
	$scope,
	$modalInstance,
	registration) {

	$scope.tmpRegistration = {};

	$scope.init = function() {
		$scope.registration = angular.copy(registration);
		angular.copy($scope.registration, $scope.tmpRegistration);
	};

	$scope.addOption = function() {

		var event = {
			title: "",
			price: 0,
			places: 0,
			dateLimit: ""
		};

		if (!$scope.registration.options) {
			$scope.registration.options = [];
		}

		$scope.registration.options.push(event);
	};

	$scope.deleteOption = function(event) {
		var options = $scope.registration.options;
		var index = options.indexOf(event);
		if (index !== -1) {
			options.splice(index, 1);
		}
	};

	$scope.submit = function() {
		$modalInstance.close($scope.registration);
	};

	$scope.cancel = function() {
		angular.copy($scope.tmpRegistration, $scope.registration);
		$modalInstance.dismiss("cancel");
	};

	$scope.init();
});