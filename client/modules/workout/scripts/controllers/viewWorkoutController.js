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
		RouteService) {

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

			promises.push(RouteService.retrieve($scope.workout.routeId));


			$q.all(promises).then(function(routes) {
				angular.forEach(routes, function(response) {
					if (angular.isObject(response.data) && response.data._id) {
						var routeViewModel = RouteBuilderService.createRouteViewModel(response.data, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig(), false);
						routeViewModel.setCenter(RouteUtilsService.getCenter($scope.workout));
						$scope.routesViewModel.push(routeViewModel);
					}
				});

				if ($scope.routesViewModel.length > 0) {
					$scope.selection = $scope.routesViewModel[0].getType() + 0;
					$scope.routesViewModel[0].setVisible(true);
				}
			});
		};

		$scope.retrieveParticipant = function() {
			var participantId = $stateParams.participantId;
			if (participantId) {
				angular.forEach($scope.workout.participants, function(participant){
					if(angular.equals(participant._id, participantId)) {
						$scope.participant = participant;
					}
				});
			}
		};

		$scope.updateParticipant = function(participant) {

			if (!participant.willBePresent) {
				WorkoutService.unjoin($scope.workout._id, participant._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("Votre réponse a bien été prise en compte"));
						$scope.init();
					});
			} else {
				WorkoutService.join($scope.workout._id, participant._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("Votre réponse a bien été prise en compte"));
						$scope.init();
					});
			}

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


		$scope.editRoute = function(routeViewModel) {
			$state.go("editWorkoutRoute", {
				id: routeViewModel.getId(),
				workoutId: $scope.workout._id
			});
		};

		$scope.openDeleteConfirmation = function(routeViewModel) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce sortie ?"),
				hide: false,
				confirm: {
					confirm: true
				},
				buttons: {
					closer: false,
					sticker: false
				},
				history: {
					history: false
				}
			}).get().on("pnotify.confirm", function() {
				RouteService.delete(routeViewModel.data._id).then(function() {
					notificationService.success(gettextCatalog.getString("Le sortie a bien été supprimée"));
					$scope.init();
				});
			});
		};

		$scope.update = function(data) {
			WorkoutService.update($scope.workoutId, data).then(
				function() {
					$scope.init();
					notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
				});
		};

		$scope.setSelection = function(route, index) {
			$scope.selection = route.getType() + index;
			$scope.active = route.getType() + index;
			$scope.isCollapsed = true;
		};

		$scope.init();
	});