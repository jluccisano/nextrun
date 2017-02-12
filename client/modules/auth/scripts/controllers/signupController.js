"use strict";

angular.module("nextrunApp.auth").controller("SignupController",
	function(
		$scope,
		$location,
		AuthService,
		AlertService,
		MetaService,
		gettextCatalog) {

		$scope.user = {};

		$scope.submit = function() {
			AuthService.register({
				user: $scope.user
			}).then(function() {
				AlertService.add("success", gettextCatalog.getString("Votre compte a bien été créé"), 3000);
				$location.path("/");
			});
		};

		MetaService.ready(gettextCatalog.getString("S'inscrire"), $location.path(), gettextCatalog.getString("S'inscrire"));

	});