"use strict";

angular.module("nextrunApp.workout").controller("WorkoutFeedbackModalController",
	function(
		$scope,
		$modalInstance,
		notificationService,
		ContactService,
		workoutId,
		gettextCatalog) {

		$scope.feedback = {};

		$scope.types = [{
			name: gettextCatalog.getString("Bug")
		}, {
			name: gettextCatalog.getString("Information erronée")
		}, {
			name: gettextCatalog.getString("Dupliquer")
		}, {
			name: gettextCatalog.getString("Autre")
		}];

		$scope.feedback.workoutId = workoutId;

		$scope.submit = function(feedback) {
			ContactService.sendFeedback({
				feedback: feedback
			}).then(function() {
				notificationService.success(gettextCatalog.getString("Votre message nous a bien été transmis"));
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};

	});