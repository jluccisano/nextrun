"use strict";

angular.module("nextrunApp.race").controller("FeedbackModalController",
	function(
		$scope,
		$modalInstance,
		AlertService,
		ContactService,
		raceId) {

		$scope.feedback = {};

		$scope.types = [{
			name: "Bug"
		}, {
			name: "Information erronée"
		}, {
			name: "Dupliquer"
		}, {
			name: "Autre"
		}];

		$scope.feedback.raceId = raceId;

		$scope.submit = function(feedback) {
			ContactService.sendFeedback({
				feedback: feedback
			}).then(function() {
				AlertService.add("success", "message.sendFeedback.successfully", 3000);
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};

	});