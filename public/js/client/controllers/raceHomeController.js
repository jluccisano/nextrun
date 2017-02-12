angular.module('nextrunApp').controller('RaceHomeCtrl', ['$scope', '$location',
	function($scope, $location) {
		'use strict';

		$scope.createNewRace = function() {
			$location.path('/races/create');
		}
	}
]);