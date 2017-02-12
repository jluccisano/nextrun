"use strict";

angular.module("nextrunApp.race").controller("EditRaceController",
	function(
		$scope,
		$location,
		$routeParams,
		$modal,
		RaceService,
		AlertService,
		AuthService,
		RaceTypeEnum,
		RouteService,
		FileReaderService,
		MetaService,
		GpxService,
		gettextCatalog) {

		$scope.activePanel = 1;

		$scope.gettextCatalog = gettextCatalog;

		/** init google maps service **/
		google.maps.visualRefresh = true;

		$scope.navType = "pills";

		$scope.types = RaceTypeEnum.getValues();

		$scope.routesViewModel = [];

		$scope.cursorMarker = {
			id: 1
		};

		$scope.location = {
			details: {},
			name: ""
		};

		$scope.currentRaceType = {};

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.raceId = $routeParams.raceId;

		$scope.init = function() {
			RaceService.retrieve($scope.raceId).then(function(response) {

				$scope.race = response.data.race;

				$scope.routesViewModel = RouteService.createRoutesViewModel($scope, $scope.race);

			}).finally(function() {
				MetaService.ready(gettextCatalog.getString("Editer une manifestation"), $location.path, gettextCatalog.getString("Editer une manifestation"));
			});
		};

		$scope.onClickMap = function(route, destinationLatlng) {
			RouteService.createNewSegment(route, destinationLatlng);
		};

		$scope.delete = function(route) {
			RouteService.resetRoute(route);
		};

		$scope.undo = function(route) {
			RouteService.deleteLastSegment(route);
		};

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.cancel = function() {
			$location.path("/myraces");
		};

		$scope.submit = function() {

			$scope.race.routes = [];

			_.each($scope.routesViewModel, function(route) {
				$scope.race.routes.push(route.data);
			});

			var data = {
				race: $scope.race
			};

			RaceService.update($scope.raceId, data).then(
				function() {
					AlertService.add("success", gettextCatalog.getString("Votre manifestation a bien été mise à jour"), 3000);
					$location.path("/myraces");
				});
		};

		$scope.openChangeTypeConfirmation = function() {

			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/changetypeconfirmationModal",
				controller: "ChangeTypeConfirmationController"
			});

			$scope.modalInstance.result.then(function() {
				$scope.race.routes = [];
				$scope.changeType();
				$scope.currentRaceType = $scope.race.type;
				$scope.distances = $scope.race.type.distances;
			}, function() {
				$scope.race.type = $scope.currentRaceType;
			});
		};

		$scope.changeType = function() {

			//var raceType = RaceTypeEnum.getRaceTypeByName($scope.race.type.name);

			//_.each(raceType.routes, function(routeType, index) {

			//var route = RouteHelperService.generateRoute($scope, undefined, routeType);

			//$scope.race.routes[index] = route;
			//$scope.race.routes[0].isVisible = true;
			//});

		};

		$scope.getFile = function(route, file) {
			FileReaderService.readAsDataUrl(file, $scope).then(function(result) {
				try {
					route = GpxService.convertGPXtoRoute($scope, route.routeType, result);
				} catch (ex) {
					AlertService.add("danger", ex.message, 3000);
				} finally {

				}
			});
		};

		$scope.centerToLocation = function(route, details) {

			if (details && details.location) {
				var center = {
					latitude: details.location.lat,
					longitude: details.location.lon
				};

				route.setCenter(center);
			}
		};

		$scope.init();

	});