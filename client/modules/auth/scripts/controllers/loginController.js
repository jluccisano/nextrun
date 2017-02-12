"use strict";

angular.module("nextrunApp.auth").controller("LoginController",
	function(
		$rootScope,
		$scope,
		$state,
		$modal,
		AuthService,
		MetaService) {

		$scope.user = {};

		$scope.signup = function() {
			$state.go("signup");
		};

		$scope.submit = function() {
			AuthService.login({
				email: $scope.user.email,
				password: $scope.user.password
			}).then(function() {
				AuthService.redirectToAttemptedUrl();
			});
		};

		$scope.open = function() {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/auth/forgotpasswordModal",
				controller: "ForgotPasswordModalController"
			});

			$scope.modalInstance.result.then(function() {
				$state.go("login");
			});
		};

		MetaService.ready("Se connecter");

	});