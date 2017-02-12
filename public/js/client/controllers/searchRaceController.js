angular.module('nextrunApp').controller('SearchRaceCtrl', ['$scope', '$location', '$routeParams', 'RaceServices',
	function($scope, $location, $routeParams, RaceServices) {
		'use strict';

		$scope.currentPage = 1;
		$scope.maxSize = 5;

		$scope.department = $routeParams.department;

		$scope.init = function() {
			RaceServices.search($scope.department,
				function(response) {

					$scope.events = response.races;

					//$scope.totalItems = $scope.races.length;
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.getDate = function(dateString) {
			if (dateString) {
				return moment(new Date(dateString)).format("DD MMMM YYYY");
			}
			return '-';
		};

		$scope.init();
	}
]);