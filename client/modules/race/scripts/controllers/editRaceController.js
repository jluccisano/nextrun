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
		RouteUtilsService,
		MetaService,
		GpxService,
		gettextCatalog) {

		$scope.activePanel = 1;

		$scope.gettextCatalog = gettextCatalog;

		/** init google maps service **/
		google.maps.visualRefresh = true;

		$scope.navType = "pills";
		$scope.saving = false;
		$scope.loading = false;
		$scope.pending = false;

		$scope.types = RaceTypeEnum.getValues();

		$scope.routesViewModel = [];

		$scope.cursorMarker = {};
		$scope.currentRaceType = {};

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.raceId = $routeParams.raceId;

		$scope.init = function() {

			$scope.loading = true;

			RaceService.retrieve($scope.raceId).then(function(response) {

				$scope.race = response.race;

				if ($scope.race) {

					var raceType = RaceTypeEnum.getRaceTypeByName($scope.race.type);

					_.each(raceType.routes, function(routeType, index) {

						var currentRoute;

						if (!_.isUndefined($scope.race.routes[index])) {
							currentRoute = $scope.race.routes[index];
						} else {
							currentRoute = {
								type: routeType,
								segments: [],
								elevationPoints: []
							};
						}

						var center = RouteUtilsService.setCenter($scope, currentRoute);

						var route = new routeBuilder.Route(currentRoute,
							RouteHelperService.getChartConfig($scope),
							RouteHelperService.getGmapsConfig(), center);

						route.addClickListener($scope.onClickMap);

						//$scope.race.routes[index] = route;
						$scope.routesViewModel.push(route);

					});

					//$scope.race.routes[0].setVisible(true);
					$scope.routesViewModel[0].setVisible(true);

				}

			}).finally(function() {
				$scope.loading = false;
				MetaService.ready(gettextCatalog.getString("Editer une manifestation"), $location.path, gettextCatalog.getString("Editer une manifestation"));
			});
		};

		$scope.onClickMap = function(route, destinationLatlng) {
			RouteService.createNewSegment(route, destinationLatlng);
		};

		$scope.getTypeLabelName = function(type) {
			return gettextCatalog.getString(type.name);
		};

		$scope.delete = function(route) {
			RouteService.deleteRoute(route);
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
			})

			var data = {
				race: $scope.race
			};

			$scope.saving = true;

			RaceService.update($scope.raceId, data).then(
				function() {
					AlertService.add("success", gettextCatalog.getString("Votre manifestation a bien été mise à jour"), 3000);
					$scope.saving = false;
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