"use strict";

angular.module("nextrunApp.race").controller("CreateRaceController",
	function(
		$scope, 
		$location, 
		$modal,
		RaceService, 
		AlertService, 
		AuthService,  
		RaceTypeEnum,
		MetaService,
		gettextCatalog) {

		$scope.race = {};
		$scope.user = {};

		$scope.tabs = [{
			active: true,
			disabled: false
		}, {
			active: false,
			disabled: true
		}];

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.types = RaceTypeEnum.values;
		$scope.distances = [];

		$scope.accountExists = true;

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.distances;
		};

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.getType = function(type) {
			return type.i18n;
		};

		$scope.getDistanceType = function(distanceType) {
			return distanceType.i18n;
		};

		$scope.submit = function() {
			var data = {
				race: $scope.race
			};

			if ($scope.isLoggedIn()) {
				RaceService.create(data).then(
					function(res) {
						AlertService.add("success", gettextCatalog.getString("La manifestation a bien été créée"), 3000);
						$scope.openRedirectionModal(res.raceId);
					});
			} else {
				$scope.tabs = [{
					active: false,
					disabled: false
				}, {
					active: true,
					disabled: false
				}];
			}
		};

		$scope.login = function() {
			AuthService.login({
				email: $scope.user.email,
				password: $scope.user.password
			}).then(function() {
				$scope.submit();
			});
		};

		$scope.signup = function() {
			AuthService.register({
				user: $scope.newuser
			}).then(function() {
				$scope.submit();
			});
		};

		$scope.openRedirectionModal = function(raceId) {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/redirectionModal",
				controller: "RedirectionModalController",
				resolve: {
					raceId: function() {
						return raceId;
					}
				}
			});
		};

		$scope.openForgotPasswordModal = function() {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/auth/forgotpasswordModal",
				controller: "ForgotPasswordModalController"
			});
		};

		MetaService.ready(gettextCatalog.getString("Ajouter une manifestation"), $location.path, gettextCatalog.getString("Ajouter une manifestation"));

	});