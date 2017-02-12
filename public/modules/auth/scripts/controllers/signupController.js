"use strict";

angular.module("nextrunApp.auth").controller("SignupController",
	function(
		$scope,
		$location,
		$translate,
		$translatePartialLoader,
		$filter,
		AuthService,
		AlertService,
		MetaService) {

		$translatePartialLoader.addPart("auth");

		$scope.user = {};

		$scope.submit = function() {
			AuthService.register({
				user: $scope.user
			}).then(function() {
				AlertService.add("success", $filter("translate")("message.signup.successfully"), 3000);
				$location.path("/");
			});
		};

		MetaService.ready($filter("translate")("title.signup"), $location.path(), $filter("translate")("message.signup.description"));

	});