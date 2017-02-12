angular.module('nextrunApp').controller('HomeCtrl', ['$scope', '$http', '$location', 'ContactServices', 'Alert', 'mySharedService', '$rootScope', 'RaceServices', 'RouteFactory',
	function($scope, $http, $location, ContactServices, Alert, sharedService, $rootScope, RaceServices, RouteFactory) {
		'use strict';

		$scope.fulltext = undefined;
		$scope.names = [];

		$scope.contact = {};

		$scope.region = REGIONS.ALL.value;
		$scope.listOfRegions = REGIONS.enums;
		$scope.listOfTypes = TYPE_OF_RACES.enums;
		$scope.currentTypesSelected = [];

		$scope.map = {
			isVisible: false,
			editMode: true,
			segments: [],
			zoom: 6,
			fit: true,
			markers: [],
			polylines: [],
			center: {
				latitude: 46.52863469527167,
				longitude: 2.43896484375,
			},
			options: {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP,
						google.maps.MapTypeId.HYBRID,
						google.maps.MapTypeId.SATELLITE
					]
				},
				disableDoubleClickZoom: true,
				scrollwheel: true,
				draggableCursor: "crosshair",
				streetViewControl: false,
				zoomControl: true
			},
			clusterOptions: {
				gridSize: 60,
				ignoreHidden: true,
				minimumClusterSize: 2
			},
			doClusterMarkers: true
		};


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

		$scope.getRegion = function(region) {
			return region.name;
		};

		$scope.getType = function(type) {
			return type.i18n;
		};

		$scope.submit = function() {

			$location.path("/races/search");

			setTimeout(function() {
				sharedService.prepForBroadcast($scope.fulltext, $scope.region, $scope.currentTypesSelected);
			}, 1000);

		};



		$scope.autocomplete = function(query_string) {

			var criteria = {
				fulltext: (query_string !== undefined) ? query_string : "",
				region: undefined
			};

			return $http({
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				url: '/api/races/autocomplete',
				data: {
					criteria: criteria
				}
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
					sharedService.prepForBroadcast($scope.fulltext, $scope.region, $scope.currentTypesSelected);
				}, 1000);
			}
		};

		$scope.getRaces = function() {
			var criteria = {
				fulltext: "",
				page: 1,
				size: 25,
				sort: {
					"date": 1
				},
				types: [],
				departments: [],
				region: undefined
			};

			RaceServices.findAll(
				function(response) {

					if (response.races.length > 0) {

						$scope.emptyResults = false;

						$scope.map.markers = RouteFactory.convertRacesLocationToMarkers(response.races);

						_.each($scope.map.markers, function(marker) {
							marker.closeClick = function() {
								marker.showWindow = false;
								$scope.$apply();
							};
							marker.onClicked = function() {
								$scope.onMarkerClicked(marker);
							};
						});

					} else {

						$scope.emptyResults = true;

					}

				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		}

		$scope.onMarkerClicked = function(marker) {
			marker.showWindow = true;
			$scope.$apply();
		}



		$scope.getRaces();

	}
]);