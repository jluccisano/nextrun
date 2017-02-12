"use strict";

angular.module("nextrunApp.auth").controller("SignupController",
	function(
		$scope,
		$state,
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
				$state.go("home");
			});
		};

		MetaService.ready("S'inscrire", "Inscrivez-vous c'est totalement gratuit !");

	});