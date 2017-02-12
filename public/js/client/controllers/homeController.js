angular.module('nextrunApp').controller('HomeCtrl', ['$scope', '$http', '$location', 'ContactServices', 'Alert', 'mySharedService', '$rootScope',
	function($scope, $http, $location, ContactServices, Alert, sharedService, $rootScope) {
		'use strict';

		$scope.fulltext = undefined;
		$scope.names = [];

		$scope.contact = {};


		$scope.types = [{
			name: 'Athlète'
		}, {
			name: 'Organisateur'
		}, {
			name: 'Autre'
		}];

		$scope.submit = function(contact) {

			ContactServices.addContact(contact,
				function(res) {
					Alert.add("success", "Merci à bientôt", 3000);
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.goToNewRace = function() {
			$location.path("/races/home")
		}


		$scope.autocomplete = function(query_string) {
			return $http({
				method: 'GET',
				url: '/api/races/autocomplete/' + query_string
			}).
			then(function(response) {

				$scope.names = [];

				var races = response.data.races;
				//push the current query at first

				var query_fulltext = {
					fullname: query_string,
					id: undefined
				}
				$scope.names.push(query_fulltext);


				for (var i = 0; i < races.length; i++) {

					var name = {
						fullname: races[i].name,
						id: races[i]._id
					}
					$scope.names.push(name);
				}

				return $scope.names;
			});
		};

		$scope.onSelect = function($item) {
			if ($scope.names.length > 0 && $item !== $scope.names[0]) {

				$location.path("/races/view/" + $item.id)

			} else {

				$location.path("/races/search");

				setTimeout(function() {
					sharedService.prepForBroadcast($scope.fulltext);
				}, 1000);
			}
		};

	}
]);