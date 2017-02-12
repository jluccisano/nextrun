nextrunControllers.controller('MyRacesCtrl', ['$scope','$location', 'RaceServices', 'Alert', 'Auth',
	function($scope, $location, RaceServices, Alert, Auth) {

		$scope.currentPage = 1;
		$scope.maxSize = 5;


		RaceServices.find(Auth.user.id, $scope.currentPage,
			function(response) {

				$scope.races = response.races;

				$scope.totalItems = races.length;
				
			},
			function(error) {
				_.each(error.message, function(message){
					Alert.add("danger", message, 3000);
				});
		});


		$scope.addNewRace = function() {
			$location.path('/races/create');
		};

		$scope.deleteRace = function() {
			RaceServices.find(
				function(response) {

				},
				function(error) {
					_.each(error.message, function(message){
						Alert.add("danger", message, 3000);
					});
			});
		};

		
	}
]);