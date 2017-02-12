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
		MetaService,
		gettextCatalog,
		GmapsApiService,
		RichTextEditorService,
		RouteUtilsService,
		RouteHelperService) {


		$scope.activePanel = 1;
		$scope.gettextCatalog = gettextCatalog;

		/** init google maps service **/
		//google.maps.visualRefresh = true;

		$scope.navType = "pills";
		$scope.types = RaceTypeEnum.getValues();
		$scope.routesViewModel = [];
		$scope.choices = ["oui", "non"];
		$scope.cursorMarker = {
			id: 1
		};

		$scope.currentRaceType = {};

		$scope.raceId = $routeParams.raceId;

		$scope.init = function() {
			RaceService.retrieve($scope.raceId).then(function(response) {
				$scope.race = response.data.race;
				$scope.routesViewModel = RouteService.createRoutesViewModel($scope.race, RouteHelperService.getChartConfig($scope), RouteHelperService.getGmapsConfig());
			}).
			finally(function() {
				MetaService.ready(gettextCatalog.getString("Editer une manifestation"), $location.path, gettextCatalog.getString("Editer une manifestation"));
			});
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
				templateUrl: "partials/race/changeTypeConfirmationModal",
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

		/* $scope.exportGPX = function(route) {

            var gpx = GpxService.convertRouteToGPX(route, "export");

            var blob = new Blob([gpx], {
                type: "text/xml"
            });
            return blob;
        };*/



		$scope.computeLocation = function(address) {
			GmapsApiService.getLocation(address).then(function(result) {
				if (result.success) {
					$scope.race.plan.location = result.location;
				}
			}, function(error) {
				if (error.message) {
					AlertService.add("danger", error.message, 3000);
				}
			});
		};

		$scope.editMoreInformation = function(model) {
			$scope.modalInstance = RichTextEditorService.openRichTextEditorModal(model.moreInformation);
			$scope.modalInstance.result.then(function(moreInformation) {
				model.moreInformation = moreInformation;	
			});
		};

		$scope.editRoute = function(routeViewModel, $index) {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/editRoute",
				controller: "EditRouteController",
				windowClass: "modal-fullscreen",
				backdrop: false,
				resolve: {
					race: function() {
						return $scope.race;
					},
					routeDataModel: function() {
						return $scope.routesViewModel[$index].data;
					}
				}
			});

			$scope.modalInstance.result.then(function(result) {
				$scope.routesViewModel[$index] = result;
			});
		}
		$scope.init();
	});