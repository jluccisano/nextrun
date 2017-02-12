"use strict";

angular.module("nextrunApp.auth").controller("LoginController",
	function(
		$scope,
		$location,
		$modal,
		AuthService,
		MetaService) {

		$scope.user = {};

		$scope.signup = function() {
			$location.path("/signup");
		};

		$scope.submit = function() {
			AuthService.login({
				email: $scope.user.email,
				password: $scope.user.password
			}).then(function() {
				$location.path("/myraces");
			});
		};

		$scope.open = function() {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/auth/forgotpasswordModal",
				controller: "ForgotPasswordModalController"
			});

			$scope.modalInstance.result.then(function() {
				$location.path("/login");
			});
		};

		MetaService.ready("Se connecter", $location.path(), "Se connecter");

	});