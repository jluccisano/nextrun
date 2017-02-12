"use strict";

angular.module("nextrunApp.race").controller("MyRacesController",
	function(
		$scope,
		$location,
		$modal,
		RaceService,
		AlertService,
		MetaService) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.totalItems = 0;
		$scope.races = [];

		$scope.init = function() {
			RaceService.find($scope.currentPage).then(
				function(response) {
					if (response.races && response.races.length > 0) {
						$scope.races = response.races;
						$scope.totalItems = $scope.races.length;
					} else {
						$scope.totalItems = 0;
						$scope.races = [];
					}
					MetaService.ready("title.myRaces", $location.path, "message.myRaces.description");
				});
		};

		$scope.addNewRace = function() {
			$location.path("/races/create");
		};

		$scope.publish = function(race, value) {
			RaceService.publish(race._id, value).then(
				function() {
					AlertService.add("success", "message.publish.successfully", 3000);
					$scope.init();
				});
		};

		$scope.openDeleteConfirmation = function(race) {
			$scope.modalInstance = $modal.open({
				templateUrl: "partials/race/deleteconfirmation",
				controller: "DeleteConfirmationModalController",
				resolve: {
					race: function() {
						return race;
					}
				}
			});
			$scope.modalInstance.result.then(function() {
				$scope.init();
			});
		};

		$scope.pageChanged = function() {
			$scope.init();
		};

		$scope.init();
	});