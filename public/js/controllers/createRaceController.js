angular.module('nextrunApp').controller('CreateRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$modal',
	function($scope, $location, RaceServices, Alert, Auth, $modal) {
		'use strict';

		$scope.race = {};

		$scope.tabs = [{
			active: true,
			disabled: false
		}, {
			active: false,
			disabled: true
		}];

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];

		$scope.accountExists = true;

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.distances;
		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$scope.getType = function(type) {
			return type.i18n;
		};

		$scope.getDistanceType = function(distanceType) {
			return distanceType.i18n;
		};

		$scope.submit = function() {

			var data = {
				race: $scope.race
			};

			if ($scope.isLoggedIn()) {
				RaceServices.create(data,
					function(res) {
						Alert.add("success", "Votre nouvelle manifestation a bien été créé", 3000);
						$scope.openRedirectionModal(res.raceId);

					},
					function(error) {
						_.each(error.message, function(message) {
							Alert.add("danger", message, 3000);
						});
					});
			} else {

				$scope.tabs = [{
					active: false,
					disabled: false
				}, {
					active: true,
					disabled: false
				}];

			}



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

		$scope.login = function() {

			Auth.login({
					email: $scope.user.email,
					password: $scope.user.password
				},
				function(res) {
					$scope.submit();
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.open = function() {

			var modalInstance = $modal.open({
				templateUrl: 'partials/forgotpassword',
				controller: 'ForgotPasswordCtrl'
			});
		};

		$scope.signup = function() {

			Auth.register({
					user: $scope.newuser
				},
				function(res) {
					$scope.submit();
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};


	}
]);

angular.module('nextrunApp').controller('RedirectionCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location', 'RaceServices', 'raceId',
	function($scope, $modalInstance, Auth, Alert, $location, RaceServices, raceId) {

		$scope.raceId = raceId;


		$scope.goToEdit = function() {
			$location.path('/races/edit/' + $scope.raceId);
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

angular.module('nextrunApp').controller('ForgotPasswordCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location',
	function($scope, $modalInstance, Auth, Alert, $location) {

		$scope.user = {};

		$scope.submit = function() {

			Auth.forgotpassword({
					user: $scope.user
				},
				function(res) {
					Alert.add("success", "Un email vient de vous être envoyé", 3000);
					$modalInstance.close();
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
					$modalInstance.close();
				});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);