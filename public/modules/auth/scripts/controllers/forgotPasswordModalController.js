"use strict";

angular.module("nextrunApp.auth").controller("ForgotPasswordModalController",
	function(
		$scope, 
		$modalInstance, 
		$translate, 
		$filter,
		AuthService, 
		AlertService) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.forgotPassword({
				user: $scope.user
			}).then(function() {
				AlertService.add("success", $filter("translate")("message.email.send.successfully"), 3000);
				$modalInstance.close();
			}, function() {
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	
	});