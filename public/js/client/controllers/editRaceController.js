angular.module('nextrunApp').controller('EditRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$routeParams', '$log', 'RouteFactory', '$window',

	function($scope, $location, RaceServices, Alert, Aut, $routeParams, $log, RouteFactory, window) {
		'use strict';

		$scope.Math = window.Math;

		/** init google maps service **/
		google.maps.visualRefresh = true;

		$scope.departments = DEPARTMENTS.enums;
		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];
		$scope.cursorMarker = {};

		$scope.raceId = $routeParams.raceId;

		$scope.onChangeTab = function(route) {
			route.isVisible = true;
		};

		$scope.getDepartment = function(department) {
			return department.code + ' - ' + department.name;
		};


		$scope.init = function() {
			RaceServices.retrieve($scope.raceId,
				function(response) {

					$scope.race = response.race;

					var raceType = getRaceTypeByName(TYPE_OF_RACES, $scope.race.type);

					_.each(raceType.routes, function(routeType, index) {

						var currentRoute = null;

						if (typeof $scope.race.routes[index] !== 'undefined') {
							currentRoute = $scope.race.routes[index];
						}

						var route = {
							isVisible: false,
							editMode: true,
							segments: (currentRoute && currentRoute.segments.length > 0) ? currentRoute.segments : [],
							distance: (currentRoute) ? currentRoute.distance : 0,
							descendant: (currentRoute) ? currentRoute.descendant : 0,
							ascendant: (currentRoute) ? currentRoute.ascendant : 0,
							minElevation: (currentRoute) ? currentRoute.minElevation : 0,
							maxElevation: (currentRoute) ? currentRoute.maxElevation : 0,
							elevationPoints: (currentRoute && currentRoute.elevationPoints.length > 0) ? currentRoute.elevationPoints : [],
							type: routeType.i18n,
							stayOnTheRoad: true,
							travelMode: google.maps.TravelMode.DRIVING,
							zoom: 13,
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
							events: {},
							chart: {
								series: [{
									data: []
								}]
							},
							chartConfig: {
								loading: false,
								options: {
									chart: {
										type: 'area'
									},
									plotOptions: {
										series: {
											marker: {
												enabled: false
											},
											point: {
												events: {
													mouseOver: function() {

														var icon = new google.maps.MarkerImage("../../../img/segment.png",
															new google.maps.Size(32, 32),
															new google.maps.Point(0, 0),
															new google.maps.Point(8, 8),
															new google.maps.Size(16, 16)
														);

														var cursorMarker = {
															latitude: this.latlng.mb,
															longitude: this.latlng.nb,
															icon: icon,
															title: "hello"
														}

														$scope.cursorMarker = cursorMarker;
														$scope.$apply();

													},
													mouseOut: function() {
														$scope.cursorMarker = {};
														$scope.$apply();
													}

												}
											},
											events: {
												mouseOut: function() {
													$scope.cursorMarker = {};
													$scope.$apply();
												}
											}
										},
										column: {
											colorByPoint: true
										}
									},
									tooltip: {
										shared: true,
										useHTML: true,
										headerFormat: '<table>',
										pointFormat: '<tr>' +
											'<td>Distance: </td>' +
											'<td style="text-align: right"><b>{point.x} Km</b></td>' +
											'</tr>' +
											'<tr>' +
											'<td>Altitude: </td>' +
											'<td style="text-align: right"><b>{point.y} m</b></td>' +
											'</tr>' +
											'<tr>' +
											'<td>Pente: </td>' +
											'<td style="text-align: right"><b>{point.grade} %</b></td>' +
											'</tr>',
										footerFormat: '</table>',
										valueDecimals: 0
									}
								},
								series: [{
									name: "Altitude (m)",
									data: []
								}],
								xAxis: {
									title: {
										text: 'Distance (km)',
										align: 'middle'
									}
								},
								yAxis: {
									title: {
										text: 'Altitude (m)',
										align: 'middle'
									}
								},
								title: {
									text: ''
								}
							}
						};

						route.events = {
							click: function(mapModel, eventName, originalEventArgs) {
								RouteFactory.onClickMap($scope, route, originalEventArgs[0].latLng, google.maps.TravelMode.DRIVING);
							}
						}

						if (route.elevationPoints.length > 0) {
							route.chartConfig.series[0].data = RouteFactory.rebuildElevationChart(route.elevationPoints);
						}

						if (route.segments.length > 0) {
							route.markers = RouteFactory.rebuildMarkers(route.segments, true);
							route.polylines = RouteFactory.rebuildPolylines(route.segments);
						}



						$scope.race.routes[index] = route;
						$scope.race.routes[0].isVisible = true;

					});
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.delete = function(route) {
			RouteFactory.delete(route);
		};

		$scope.undo = function(route) {
			RouteFactory.undo(route);
		};

		$scope.onChange = function() {
			$scope.distances = $scope.race.type.value.distances;
		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$scope.submit = function(race) {

			var data = {
				race: $scope.race
			};

			RaceServices.update($scope.raceId, data,
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