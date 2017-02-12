angular.module('nextrunApp').controller('CreateRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth',
	function($scope, $location, RaceServices, Alert, Auth) {
		'use strict';
		$scope.departments = DEPARTMENTS.enums;
		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.value.distances;
		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};


		$scope.getDepartment = function(department) {
			return department.code + ' - ' + department.name;
		};


		$scope.submit = function(race) {

			var data = {
				race: race
			};

			RaceServices.create(data,
				function(res) {
					Alert.add("success", "Votre nouvelle manifestation a bien été créé", 3000);
					$location.path('/myraces');
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};
	}
]);