nextrunControllers.controller('CreateRaceCtrl', ['$scope','$location', 'RaceServices', 'Alert', 'Auth',
	function($scope, $location, RaceServices, Alert, Auth) {

		$scope.departments = DEPARTMENTS.enums;
		$scope.types = TYPE_OF_RACES.enums;

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.value.distances;
		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$scope.submit = function(race) {

			data = { race: race, user: Auth.user };

			RaceServices.create(data,
				function(res) {
					Alert.add("success", "Votre nouvelle manifestation a bien été créé", 3000);
				},
				function(error) {
					_.each(error.message, function(message){
						Alert.add("danger", message, 3000);
					});
			});
		};
	}
]);