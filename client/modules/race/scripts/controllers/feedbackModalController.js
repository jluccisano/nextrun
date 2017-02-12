"use strict";

angular.module("nextrunApp.race").controller("FeedbackModalController",
	function(
		$scope,
		$modalInstance,
		notificationService,
		ContactService,
		raceId,
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

		$scope.feedback.raceId = raceId;

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