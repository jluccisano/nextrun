"use strict";

angular.module("nextrunApp.home").controller("ContactController",
	function(
		$scope,
		$state,
		notificationService,
		ContactService,
		gettextCatalog,
		MetaService) {

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

		$scope.submit = function(feedback) {
			ContactService.sendFeedback({
				feedback: feedback
			}).then(function() {
				notificationService.success(gettextCatalog.getString("Votre message nous a bien été transmis"));
				$state.go("home");
			});
		};

		MetaService.ready("Contact", "Un bug, une idée, une amélioration, n'hésitez pas à nous en faire part.");
	});