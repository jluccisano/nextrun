"use strict";

angular.module("nextrunApp.auth").controller("SignupController",
	function(
		$scope,
		$location,
		AuthService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.register({
				user: $scope.user
			}).then(function() {
				notificationService.success(gettextCatalog.getString("Votre compte a bien été créé"));
				$location.path("/");
			});
		};

		MetaService.ready(gettextCatalog.getString("S'inscrire"), $location.path(), gettextCatalog.getString("S'inscrire"));

	});