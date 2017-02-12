nextrunControllers.controller('MyRacesCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$modal',
	function($scope, $location, RaceServices, Alert, Auth, $modal) {
		'use strict';
		$scope.currentPage = 1;
		$scope.maxSize = 5;


		RaceServices.find(Auth.user.id, $scope.currentPage,
			function(response) {

				$scope.races = response.races;

				$scope.totalItems = $scope.races.length;

			},
			function(error) {
				_.each(error.message, function(message) {
					Alert.add("danger", message, 3000);
				});
			});

		$scope.getDate = function(dateString) {
			return moment(new Date(dateString)).format("DD/MM/YYYY HH:MM");
		};

		$scope.addNewRace = function() {
			$location.path('/races/create');
		};

		$scope.openDeleteConfirmation = function(race) {

			var modalInstance = $modal.open({
				templateUrl: 'partials/deleteconfirmation',
				controller: 'DeleteConfirmationCtrl',
				resolve: {
					race: function() {
						return race;
					}
				}
			});
		};
	}
]);

nextrunControllers.controller('DeleteConfirmationCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location', 'RaceServices', 'race',
	function($scope, $modalInstance, Auth, Alert, $location, RaceServices, race) {

		$scope.race = race;

		$scope.submit = function() {

		};

		$scope.deleteRace = function() {

			RaceServices.delete($scope.race._id,
				function(response) {

				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};


		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);