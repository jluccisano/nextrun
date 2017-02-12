angular.module('nextrunApp').controller('ViewRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$routeParams', 'RouteFactory', '$window',
	function($scope, $location, RaceServices, Alert, Auth, $routeParams, RouteFactory, window) {
		'use strict';

		google.maps.visualRefresh = true;

		$scope.Math = window.Math;

		$scope.raceId = $routeParams.raceId;
		$scope.cursorMarker = {};

		$scope.onChangeTab = function(route) {
			route.isVisible = true;
		};

		$scope.getDate = function(dateString) {
			return moment(new Date(dateString)).format("DD MMMM YYYY");
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
							editMode: false,
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

													}

												}
											},
											events: {
												mouseOut: function() {}
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

						if (route.elevationPoints.length > 0) {
							route.chartConfig.series[0].data = RouteFactory.rebuildElevationChart(route.elevationPoints);
						}

						if (route.segments.length > 0) {
							route.markers = RouteFactory.rebuildMarkers(route.segments, false);
							route.polylines = RouteFactory.rebuildPolylines(route.segments);
							route.bounds = RouteFactory.setBounds(route);
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


		$scope.init();

	}
]);