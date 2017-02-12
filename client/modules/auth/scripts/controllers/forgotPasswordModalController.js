"use strict";

angular.module("nextrunApp.auth").controller("ForgotPasswordModalController",
	function(
		$scope, 
		$modalInstance,
		AuthService, 
		notificationService,
		gettextCatalog) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.forgotPassword({
				user: $scope.user
			}).then(function() {
				notificationService.success(gettextCatalog.getString("Un email vous a été envoyé"));
				$modalInstance.close();
			}, function() {
				$modalInstance.close();
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss("cancel");
		};
	
	});