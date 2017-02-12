"use strict";

angular.module("nextrunApp.workout").controller("ViewWorkoutController",
	function(
		$scope,
		$state,
		$modal,
		$filter,
		$q,
		$timeout,
		$stateParams,
		WorkoutService,
		notificationService,
		AuthService,
		RouteBuilderService,
		MetaService,
		gettextCatalog,
		GmapsApiService,
		RichTextEditorService,
		RouteUtilsService,
		RouteHelperService,
		workoutId,
		RouteService,
		GpxService) {

		$scope.selection = "";

		$scope.isCollapsed = false;

		$scope.editMode = false;
		$scope.active = "general";

		$scope.activePanel = 1;
		$scope.gettextCatalog = gettextCatalog;

		$scope.navType = "pills";
		$scope.routesViewModel = [];
		$scope.choices = ["oui", "non"];
		$scope.cursorMarker = {
			id: 1
		};



		$scope.workoutId = workoutId;


		$scope.retrieveRoutes = function() {
			var promises = [];
			$scope.routesViewModel = [];

			if ($scope.workout.routeId) {
				promises.push(RouteService.retrieve($scope.workout.routeId));
			}

			$q.all(promises).then(function(routes) {
				angular.forEach(routes, function(response) {
					if (angular.isObject(response.data) && response.data._id) {
						var routeViewModel = RouteBuilderService.createRouteViewModel(response.data, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig(), false);
						routeViewModel.setCenter(RouteUtilsService.getCenter($scope.workout));
						$scope.routesViewModel.push(routeViewModel);
					}
				});

				if ($scope.routesViewModel.length > 0 && !$scope.selection) {
					$scope.selection = $scope.routesViewModel[0].getType() + 0;
					$scope.routesViewModel[0].setVisible(true);
				}
			});
		};

		$scope.retrieveParticipant = function() {
			var participantId = $stateParams.participantId;
			if (participantId) {
				angular.forEach($scope.workout.participants, function(theParticipant) {
					if (angular.equals(theParticipant._id, participantId)) {
						$scope.participant = theParticipant;
					}
				});
			}
		};

		$scope.updateParticipant = function(participant) {
			WorkoutService.updateParticipant($scope.workout._id, participant).then(
				function() {
					notificationService.success(gettextCatalog.getString("Votre réponse a bien été prise en compte"));
					$state.go("viewWorkoutParticipantWithSelection", {
						id: $scope.workout._id,
						participantId: participant._id,
						selection: "general"
					}, true);
				});
		};

		$scope.init = function() {

			$scope.state = $state.current.name;

			WorkoutService.retrieve($scope.workoutId).then(function(response) {
				$scope.workout = response.data;
				$scope.retrieveRoutes();
				$scope.retrieveParticipant();
			}).
			finally(function() {
				MetaService.ready($scope.workout.name, $scope.generateWorkoutDescription());
			});


		};

		$scope.isLoggedIn = function() {
			return AuthService.isLoggedIn();
		};

		$scope.cancel = function() {
			$state.go("myworkouts");
		};


		$scope.setSelection = function(route, index) {
			$scope.selection = route.getType() + index;
			$scope.active = route.getType() + index;
			$scope.isCollapsed = true;
		};

		$scope.initSelection = function(selection) {
			if (selection) {
				$scope.selection = selection;
				$scope.active = selection;
				if (selection !== "general") {
					$scope.isCollapsed = false;
				} else {
					$scope.isCollapsed = true;

				}
			} else {
				$scope.selection = undefined;
				$scope.isCollapsed = false;
			}
		};

		$scope.openFeedbackModal = function() {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/workout/templates/feedbackModal",
				controller: "WorkoutFeedbackModalController",
				resolve: {
					workoutId: function() {
						return $scope.workoutId;
					}
				}
			});
		};

		$scope.exportGPX = function(route) {
			var gpx = GpxService.convertRouteToGPX(route, "export");
			var blob = new Blob([gpx], {
				type: "text/xml"
			});
			return blob;
		};

		$scope.init();
	});