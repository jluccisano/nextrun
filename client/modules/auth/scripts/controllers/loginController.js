"use strict";

angular.module("nextrunApp.auth").controller("LoginController",
	function(
		$scope,
		$location,
		$modal,
		$translate,
		$translatePartialLoader,
		$filter,
		AuthService,
		MetaService) {

		$translatePartialLoader.addPart("auth");

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
				templateUrl: "partials/auth/forgotpassword",
				controller: "ForgotPasswordModalController"
			});

			$scope.modalInstance.result.then(function() {
				$location.path("/login");
			});
		};

		MetaService.ready($filter("translate")("title.login"), $location.path(), $filter("translate")("message.login.description"));

	});