"use strict";

angular.module("nextrunApp.auth").controller("ForgotPasswordModalController",
	function(
		$scope, 
		$modalInstance,
		AuthService, 
		AlertService) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.forgotPassword({
				user: $scope.user
			}).then(function() {
				AlertService.add("success", "message.email.send.successfully", 3000);
				$modalInstance.close();
			}, function() {
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	
	});