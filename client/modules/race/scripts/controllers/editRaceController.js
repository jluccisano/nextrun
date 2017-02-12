"use strict";

angular.module("nextrunApp.race").controller("EditRaceController",
	function(
		$scope,
		$location,
		$routeParams,
		$modal,
		$filter,
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

		$scope.editMode = true;
		$scope.active = "general";
		$scope.status = {
			open: true
		};

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
				$scope.selection = $scope.routesViewModel[0].getType() + 0;
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

		$scope.editRichTextEditor = function(model, field) {
			$scope.modalInstance = RichTextEditorService.openRichTextEditorModal(model);
			
			$scope.modalInstance.result.then(function(data) {
				if (!angular.equals(data, model)) {
					var params = {};
					params.fields = {};
					params.fields[field] = data;
					$scope.update(params);
				}
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

			$scope.modalInstance.result.then(function(route) {
				//if (!angular.equals(route.data, $scope.routesViewModel[$index].data)) {

				var fields = {};
				fields["routes"] = route.data;

				var query = {};
				query = {"routes.type": route.getType()};

				$scope.update({
					query: query,
					fields: fields
				});
				//}
			});
		};

		$scope.update = function(data) {
			RaceService.update($scope.raceId, data).then(
				function() {
					$scope.init();
					AlertService.add("success", gettextCatalog.getString("Votre manifestation a bien été mise à jour"), 3000);
				});
		}

		$scope.editRegistration = function() {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/editRegistrationModal",
				controller: "EditRegistrationModalController",
				size: "lg",
				backdrop: false,
				resolve: {
					registration: function() {
						return $scope.race.registration;
					}
				}
			});

			$scope.modalInstance.result.then(function(data) {
				if (!angular.equals(data, $scope.race.registration)) {
					$scope.update({
						fields: {
							"registration": data
						}
					});
				}
			});
		};

		$scope.editSchedule = function() {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/editScheduleModal",
				controller: "EditScheduleModalController",
				size: "lg",
				backdrop: false,
				resolve: {
					schedule: function() {
						return $scope.race.schedule;
					}
				}
			});

			$scope.modalInstance.result.then(function(data) {
				if (!angular.equals(data, $scope.race.schedule)) {
					$scope.update({
						fields: {
							"schedule": data
						}
					});
				}
			});
		};

		$scope.setSelection = function(route, index) {
			$scope.selection = route.getType() + index;
			$scope.active = route.getType() + index;
		};
		$scope.init();
	});