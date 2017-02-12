"use strict";

angular.module("nextrunApp.auth").controller("SignupController",
	function(
		$scope,
		$location,
		AuthService,
		AlertService,
		MetaService) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.register({
				user: $scope.user
			}).then(function() {
				AlertService.add("success", "message.signup.successfully", 3000);
				$location.path("/");
			});
		};

		MetaService.ready("title.signup", $location.path(), "message.signup.description");

	});