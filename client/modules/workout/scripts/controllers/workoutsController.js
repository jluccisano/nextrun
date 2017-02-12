"use strict";

angular.module("nextrunApp.workout").controller("WorkoutsController",
	function(
		$scope,
		$state,
		$modal,
		$stateParams,
		WorkoutService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.workouts = [];

		$scope.init = function() {

			var promise;

			if($stateParams.id) {
				promise = WorkoutService.find($stateParams.id, $scope.currentPage);
			} else {
				promise = WorkoutService.findAll($scope.currentPage);
			}
			
			promise.then(function(response) {
				if (response.data && response.data.items && response.data.items.length > 0) {
					$scope.workouts = response.data.items;
					$scope.totalItems = response.data.total;
				} else {
					$scope.totalItems = 0;
					$scope.workouts = [];
				}
			}).
			finally(function() {
				MetaService.ready("Mes sorties", "Retrouvez la liste de vos sorties");
			});
		};

		$scope.addNewWorkout = function() {
			$cookieStore.remove("workout");
			$state.go("newWorkout");
		};


		$scope.openDeleteConfirmation = function(workout) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer cette sortie ?"),
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
			}).get().on('pnotify.confirm', function() {
				WorkoutService.delete(workout._id).then(function() {
					notificationService.success(gettextCatalog.getString("La sortie a bien été supprimé"));
					$scope.init();
				});
			});
		};

		$scope.pageChanged = function() {
			$scope.init();
		};

		$scope.init();
	});