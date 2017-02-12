"use strict";

angular.module("nextrunApp.auth").controller("ForgotPasswordModalController",
	function(
		$scope, 
		$modalInstance,
		AuthService, 
		AlertService,
		gettextCatalog) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.forgotPassword({
				user: $scope.user
			}).then(function() {
				AlertService.add("success", gettextCatalog.getString("Un email vous a été envoyé"), 3000);
				$modalInstance.close();
			}, function() {
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	
	});