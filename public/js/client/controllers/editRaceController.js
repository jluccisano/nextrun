angular.module('nextrunApp').controller('EditRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$routeParams',
	function($scope, $location, RaceServices, Alert, Aut, $routeParams) {
		'use strict';
				
		$scope.departments = DEPARTMENTS.enums;
		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];

		$scope.raceId = $routeParams.raceId;


		$scope.init = function() {
			RaceServices.retrieve($scope.raceId,
				function(response) {

					$scope.race = response.race;


				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.value.distances;
		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$scope.submit = function(race) {

			var data = {
				race: race
			};

			RaceServices.update(data,
				function(res) {
					Alert.add("success", "Votre manifestation a bien été modifiée", 3000);
					$location.path('/myraces');
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