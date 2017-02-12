"use strict";

angular.module("nextrunApp.race").controller("EditRaceController",
	function(
		$scope,
		$state,
		$modal,
		$filter,
		RaceService,
		notificationService,
		AuthService,
		RaceTypeEnum,
		RouteBuilderService,
		MetaService,
		gettextCatalog,
		GmapsApiService,
		RichTextEditorService,
		RouteUtilsService,
		RouteHelperService,
		raceId) {

		$scope.selection ="";

		$scope.isCollapsed = false;

		$scope.editMode = true;
		$scope.active = "general";

		$scope.activePanel = 1;
		$scope.gettextCatalog = gettextCatalog;

		/** init google maps service **/
		//google.maps.visualRefresh = true;

		$scope.navType = "pills";
		$scope.routesViewModel = [];
		$scope.choices = ["oui", "non"];
		$scope.cursorMarker = {
			id: 1
		};

		$scope.currentRaceType = {};

		$scope.raceId = raceId;

		$scope.init = function() {
			RaceService.retrieve($scope.raceId).then(function(response) {
				$scope.race = response.data.race;
				$scope.routesViewModel = RouteBuilderService.createRoutesViewModel($scope.race, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig());

				if (!$scope.selection) {
					$scope.selection = $scope.routesViewModel[0].getType() + 0;
				}

			}).
			finally(function() {
				MetaService.ready("Editer une manifestation");
			});
		};

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.cancel = function() {
			$state.go("myraces");
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

			$scope.modalInstance.result.then(function(routeDataModel) {
				/*if (!angular.equals(routeDataModel, $scope.routesViewModel[$index].data)) {*/

				var fields = {};
				fields["routes.$"] = routeDataModel;

				var query = {};
				query = {
					"routes._id": routeDataModel._id
				};

				$scope.update({
					query: query,
					fields: fields
				});

				$scope.selection = $scope.setSelection(routeViewModel, $index);
				/*}*/
			});
		};

		$scope.update = function(data) {
			RaceService.update($scope.raceId, data).then(
				function() {
					$scope.init();
					notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
				});
		};

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
					$scope.selection = "registration";
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
					$scope.selection = "schedule";
					$scope.active = "schedule";
				}
			});
		};

		$scope.setSelection = function(route, index) {
			$scope.selection = route.getType() + index;
			$scope.active = route.getType() + index;
			$scope.isCollapsed = true;
		};

		$scope.init();
	});