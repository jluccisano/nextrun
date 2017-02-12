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
		RouteHelperService,
		TextAngularConfig,
		MetaService,
		GpxService) {

		/** init google maps service **/
		google.maps.visualRefresh = true;

		$scope.navType = "pills";
		$scope.saving = false;
		$scope.loading = false;
		$scope.pending = false;


		$scope.types = RaceTypeEnum.values;
		$scope.distances = [];
		$scope.cursorMarker = {};
		$scope.currentRaceType = {};

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.raceId = $routeParams.raceId;

		$scope.textAngularOpts = TextAngularConfig;

		$scope.getType = function(type) {
			return type.i18n;
		};

		$scope.getDistanceType = function(distanceType) {
			return distanceType.i18n;
		};

		$scope.init = function() {

			$scope.loading = true;

			RaceService.retrieve($scope.raceId).then(function(response) {

					$scope.race = response.race;

					var raceType = RaceTypeEnum.getRaceTypeByName($scope.race.type.name);

					_.each(raceType.routes, function(routeType, index) {

						var currentRoute = null;

						if (!_.isUndefined($scope.race.routes[index])) {
							currentRoute = $scope.race.routes[index];
						}

						var route = RouteHelperService.generateRoute($scope, currentRoute, routeType);

						$scope.race.routes[index] = route;
						$scope.race.routes[0].isVisible = true;
					});

					$scope.race.type = raceType;
					$scope.currentRaceType = raceType;
					$scope.distances = $scope.race.type.distances;

					_.each($scope.race.type.distances, function(distanceType) {
						if ($scope.race.distanceType.name === distanceType.name) {
							$scope.race.distanceType = distanceType;
						}
					});

					$scope.loading = false;

					MetaService.ready("title.editRace", $location.path, "message.editRace.description");

				}).then(function() {
					$scope.loading = false;
				});
		};

		$scope.delete = function(route) {
			RouteService.delete(route);
		};

		$scope.undo = function(route) {
			RouteService.undo(route);
		};

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.cancel = function() {
			$location.path("/myraces");
		};

		$scope.submit = function() {

			var data = {
				race: $scope.race
			};

			$scope.saving = true;

			RaceService.update($scope.raceId, data).then(
				function() {
					AlertService.add("success", "message.update.successfully", 3000);
					$scope.saving = false;
					$location.path("/myraces");
				});
		};

		$scope.openChangeTypeConfirmation = function() {

			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/changetypeconfirmation",
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

			var raceType = RaceTypeEnum.getRaceTypeByName($scope.race.type.name);

			_.each(raceType.routes, function(routeType, index) {

				var route = RouteHelperService.generateRoute($scope, undefined, routeType);

				$scope.race.routes[index] = route;
				$scope.race.routes[0].isVisible = true;
			});

		};

		$scope.getFile = function(route, file) {

			$scope.pending = true;

			FileReaderService.readAsDataUrl(file, $scope).then(function(result) {

					//reinit route
	
					try {
						route = GpxService.convertGPXtoRoute($scope, result);
						route = RouteHelperService.generateRoute($scope, undefined, route.routeType);

						if (route.segments.length > 0) {
							route.markers = RouteService.rebuildMarkers(route.segments, true);
							route.polylines = RouteService.rebuildPolylines(route.segments);
						}

						$scope.$apply();

					} catch (ex) {
						AlertService.add("danger", ex.message, 3000);
					} finally {
						$scope.pending = false;
					}
				});
		};

		$scope.init();

	});