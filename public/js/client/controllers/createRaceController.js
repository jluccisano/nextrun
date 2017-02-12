angular.module('nextrunApp').controller('CreateRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth','$modal',
	function($scope, $location, RaceServices, Alert, Auth, $modal) {
		'use strict';
		$scope.departments = DEPARTMENTS.enums;
		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.distances;
		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};


		$scope.getDepartment = function(department) {
			return department.code + ' - ' + department.name;
		};

		$scope.getType = function(type) {
			return type.name;
		};

		$scope.getDistanceType = function(distanceType) {
			return distanceType.name;
		};


		$scope.submit = function(race) {

			var data = {
				race: race
			};

			RaceServices.create(data,
				function(res) {
					Alert.add("success", "Votre nouvelle manifestation a bien été créé", 3000);
					//$location.path('/myraces');

					$scope.openRedirectionModal(res.raceId);

				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
			});

			//TODO popup
		};

		$scope.openRedirectionModal = function(raceId) {

			var modalInstance = $modal.open({
				templateUrl: 'partials/redirection',
				controller: 'RedirectionCtrl',
				resolve: {
					raceId: function() {
						return raceId;
					}
				}
			});

			modalInstance.result.then(function() {

			}, function() {

			});
		};
	}
]);

angular.module('nextrunApp').controller('RedirectionCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location', 'RaceServices', 'raceId',
	function($scope, $modalInstance, Auth, Alert, $location, RaceServices, raceId) {

		$scope.raceId = raceId;


		$scope.goToEdit = function() {
			$location.path('/races/edit/'+$scope.raceId);
			$modalInstance.close();
		};

		$scope.goToMyRaces = function() {
			$location.path('/myraces');
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);