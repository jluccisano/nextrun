"use strict";

angular.module("nextrunApp.race").controller("RacesController",
	function(
		$scope,
		$state,
		$modal,
		$stateParams,
		$cookieStore,
		RaceService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.races = [];

		$scope.init = function() {

			var promise;

			if($stateParams.id) {
				promise = RaceService.find($stateParams.id, $scope.currentPage);
			} else {
				promise = RaceService.findAll($scope.currentPage);
			}
			
			promise.then(
				function(response) {
					if (response.data && response.data.items && response.data.items.length > 0) {
						$scope.races = response.data.items;
						$scope.totalItems = response.data.total;
					} else {
						$scope.totalItems = 0;
						$scope.races = [];
					}
				}).finally(function() {
				MetaService.ready("Mes manifestations");
			});
		};

		$scope.addNewRace = function() {
			$cookieStore.remove("race");
			$state.go("newRace");
		};

		$scope.publish = function(race) {

			if (!race.published) {
				RaceService.unpublish(race._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("Votre manifestation a bien été retiré	"));
						$scope.init();
					});
			} else {
				RaceService.publish(race._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("Votre manifestation a bien été publiée"));
						$scope.init();
					});
			}

		};

		$scope.openDeleteConfirmation = function(race) {
			notificationService.notify({
				title: gettextCatalog.getString("Confirmation requise"),
				text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer cette manifestation ?"),
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
				RaceService.delete(race._id).then(
					function() {
						notificationService.success(gettextCatalog.getString("La manifestation a bien été supprimée"));
						$scope.init();
					});
			});
		};

		$scope.pageChanged = function() {
			$scope.init();
		};

		$scope.init();
	});