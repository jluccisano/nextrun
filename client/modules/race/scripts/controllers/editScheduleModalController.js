"use strict";

angular.module("nextrunApp.race").controller("EditScheduleModalController", function(
	$scope,
	$modalInstance,
	schedule) {

	$scope.tmpSchedule = {};

	$scope.init = function() {
		$scope.schedule = angular.copy(schedule);
		angular.copy($scope.schedule, $scope.tmpSchedule);

		if ($scope.schedule.events || $scope.schedule.events.length === 0) {
			var startEvent = {
				name: "Départ",
				date: undefined,
				description: ""
			};

			$scope.schedule.events.push(startEvent);
		}

	};

	$scope.addEvent = function() {

		var event = {
			name: "",
			date: undefined,
			description: ""
		};

		if (!$scope.schedule.events) {
			$scope.schedule.events = [];
		}

		$scope.schedule.events.push(event);
	};

	$scope.deleteEvent = function(event) {
		var events = $scope.schedule.events;
		var index = events.indexOf(event);
		if (index !== -1) {
			events.splice(index, 1);
		}
	};

	$scope.submit = function() {
		$modalInstance.close($scope.schedule);
	};

	$scope.cancel = function() {
		angular.copy($scope.tmpSchedule, $scope.schedule);
		$modalInstance.dismiss("cancel");
	};

	$scope.init();
});