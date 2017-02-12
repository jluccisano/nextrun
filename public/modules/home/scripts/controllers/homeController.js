"use strict";

angular.module("nextrunApp.home").controller("HomeController",
	function(
		$scope,
		$location,
		$translate,
		$translatePartialLoader,
		$filter,
		ContactService,
		AlertService,
		SharedCriteriaService,
		RaceService,
		RouteService,
		RegionEnum,
		RaceTypeEnum,
		MetaService) {

		var initCriteria = function() {
			$scope.criteria = {
				sort: "_score",
				size: 20,
				from: 0,
				fulltext: "",
				departments: [],
				region: RegionEnum.REGIONS.ALL.value,
				types: [],
				dateRanges: [{
					startDate: moment(),
					endDate: moment().add("days", 179)
				}],
				location: {},
				searchAround: true,
				distance: "15"
			};
		};

		var initContact = function() {
			$scope.contact = {};
		};

		var initAutocomplete = function() {
			$scope.autocomplete = {
				options: {
					country: "fr",
					types: "(cities)"
				}
			};
		};

		initCriteria();
		initAutocomplete();
		initContact();

		$scope.listOfTypes = RaceTypeEnum.values;

		$scope.types = [{
			name: "Athlète"
		}, {
			name: "Organisateur"
		}, {
			name: "Autre"
		}];

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


		$scope.submit = function(contact) {
			ContactService.addContact(contact).then(
				function() {
					AlertService.add("success", $filter("translate")("message.addContact.successfully"), 3000);
				});
		};

		$scope.goToNewRace = function() {
			$location.path("/races/home");
		};

		$scope.getRegion = function(region) {
			return region.name;
		};

		$scope.getType = function(type) {
			return type.i18n;
		};

		$scope.submitSearchWithCriteria = function() {
			$location.path("/races/search");
			setTimeout(function() {
				SharedCriteriaService.prepForCriteriaBroadcast($scope.criteria);
			}, 1000);
		};

		$scope.suggest = function(queryString) {

			var criteria = {
				fulltext: (queryString !== undefined) ? queryString : "",
				region: undefined
			};

			return RaceService.suggest(criteria).then(function(response) {

				$scope.names = [];

				var races = response.hits.hits;
				//push the current query at first

				var queryFullText = {
					fullname: queryString,
					id: undefined
				};

				$scope.names.push(queryFullText);

				for (var i = 0; i < races.length; i++) {

					var name = {
						fullname: races[i].fields.partial1[0].name,
						id: races[i].fields.partial1[0]._id
					};

					$scope.names.push(name);
				}

				return $scope.names;
			});
		};

		$scope.onSelect = function($item) {
			if ($scope.names.length > 0 && $item !== $scope.names[0]) {
				$location.path("/races/view/" + $item.id);
			} else {
				$location.path("/races/search");
				setTimeout(function() {
					SharedCriteriaService.prepForCriteriaBroadcast($scope.criteria);
				}, 1000);
			}
		};

		$scope.getRaces = function() {
			
			RaceService.findAll().then(
				function(response) {

					if (response.races.length > 0) {

						$scope.emptyResults = false;

						$scope.map.markers = RouteService.convertRacesLocationToMarkers(response.races);

						_.each($scope.map.markers, function(marker) {
							marker.closeClick = function() {
								marker.showWindow = false;
								$scope.$apply();
							};
							marker.onClicked = function() {
								$scope.onMarkerClicked(marker);
							};
						});

						MetaService.ready($filter("translate")("title.home"), $location.path(), $filter("translate")("message.home.description"));

					} else {
						$scope.emptyResults = true;
					}
				});
		};

		$scope.onMarkerClicked = function(marker) {
			marker.showWindow = true;
			$scope.$apply();
		};

		$scope.getRaces();

	});