"use strict";

angular.module("nextrunApp.race").controller("CreateRaceController",
	function(
		$rootScope,
		$scope,
		$modal,
		RaceService,
		notificationService,
		RaceTypeEnum,
		MetaService,
		gettextCatalog) {

		$scope.gettextCatalog = gettextCatalog;

		$scope.race = {};

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.types = RaceTypeEnum.getValues();

		$scope.accountExists = true;

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

			RaceService.create(data).then(function(response) {
				notificationService.success(gettextCatalog.getString("La manifestation a bien été créée"));
				$scope.openRedirectionModal(response.data.raceId);
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

		MetaService.ready("Ajouter une manifestation");

	});