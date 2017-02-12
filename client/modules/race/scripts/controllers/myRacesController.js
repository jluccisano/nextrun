"use strict";

angular.module("nextrunApp.race").controller("MyRacesController",
	function(
		$scope,
		$location,
		$modal,
		$translate,
		$translatePartialLoader,
		$filter,
		RaceService,
		AlertService,
		MetaService) {

		$translatePartialLoader.addPart("auth");

		$scope.currentPage = 1;
		$scope.maxSize = 5;

		$scope.init = function() {
			RaceService.find($scope.currentPage).then(
				function(response) {
					$scope.races = response.races;
					$scope.totalItems = $scope.races.length;
					MetaService.ready($filter("translate")("title.myRaces"), $location.path, $filter("translate")("message.myRaces.description"));
				});
		};

		$scope.addNewRace = function() {
			$location.path("/races/create");
		};

		$scope.publish = function(race, value) {
			RaceService.publish(race._id, value).then(
				function() {
					AlertService.add("success", $filter("translate")("message.publish.successfully"), 3000);
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

		$scope.init();
	});