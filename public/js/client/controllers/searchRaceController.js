angular.module('nextrunApp').controller('SearchRaceCtrl', ['$scope', '$location', '$routeParams',
	function($scope, $location, $routeParams) {
		'use strict';

		$scope.currentPage = 1;
		$scope.maxSize = 5;

		$scope.department = $routeParams.department;

		$scope.init = function() {
			RaceServices.search($scope.department,
				function(response) {

					$scope.races = response.races;

					$scope.totalItems = $scope.races.length;
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.init();
	}
]);