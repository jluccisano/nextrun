"use strict";

angular.module("nextrunApp.race").controller("MyRacesController",
	function(
		$scope,
		$state,
		$modal,
		RaceService,
		notificationService,
		MetaService,
		gettextCatalog) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.races = [];

		$scope.init = function() {
			RaceService.find($scope.currentPage).then(
				function(response) {
					if (response.data && response.data.races && response.data.races.length > 0) {
						$scope.races = response.data.races;
						$scope.totalItems = $scope.races.length;
					} else {
						$scope.totalItems = 0;
						$scope.races = [];
					}
				}).finally(function() {
				MetaService.ready("Mes manifestations");
			});
		};

		$scope.addNewRace = function() {
			$state.go("create");
		};

		$scope.publish = function(race, value) {
			RaceService.publish(race._id, value).then(
				function() {
					notificationService.success(gettextCatalog.getString("Votre manifestation a bien été publiée"));
					$scope.init();
				});
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