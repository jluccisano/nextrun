"use strict";

angular.module("nextrunApp.race").controller("FeedbackModalController",
	function(
		$scope,
		$modalInstance,
		AlertService,
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
				AlertService.add("success", gettextCatalog.getString("Votre message nous a bien été transmis"), 3000);
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};

	});