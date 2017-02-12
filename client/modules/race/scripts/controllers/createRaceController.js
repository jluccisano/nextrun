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

		$scope.gettextCatalog = gettextCatalog;

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

		$scope.types = RaceTypeEnum.getValues();

		$scope.accountExists = true;

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.initRouteDataModel = function() {
			var raceType = RaceTypeEnum.getRaceTypeByName($scope.race.type);

			$scope.race.routes = [];

			_.each(raceType.routes, function(routeType) {

				$scope.race.routes.push({
					type: routeType,
					segments: [],
					elevationPoints: []
				});

			});
		};

		$scope.submit = function() {
			$scope.initRouteDataModel();

			var data = {
				race: $scope.race
			};


			if ($scope.isLoggedIn()) {
				RaceService.create(data).then(
					function(response) {
						AlertService.add("success", gettextCatalog.getString("La manifestation a bien été créée"), 3000);
						$scope.openRedirectionModal(response.data.raceId);
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

		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = true;
		};

		MetaService.ready(gettextCatalog.getString("Ajouter une manifestation"), $location.path, gettextCatalog.getString("Ajouter une manifestation"));

	});