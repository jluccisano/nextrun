angular.module('nextrunApp').controller('ViewRaceCtrl', ['$rootScope', '$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$routeParams', 'RouteFactory', '$window', '$modal', 'sharedMetaService',
	function($rootScope, $scope, $location, RaceServices, Alert, Auth, $routeParams, RouteFactory, window, $modal, sharedMetaService) {
		'use strict';

		google.maps.visualRefresh = true;

		$scope.loading = false;

		$scope.Math = window.Math;

		$scope.raceId = $routeParams.raceId;
		$scope.cursorMarker = {};

		$scope.navType = "pills";

		$scope.addHttp = function(url) {
			if (!url.match(/^[a-zA-Z]+:\/\//)) {
				url = 'http://' + url;
			}
			return url;
		}

		$scope.onChangeTab = function(route) {
			route.isVisible = true;
		};

		$scope.onChangeOrganisationTab = function() {
			$scope.isVisible = true;
		};

		$scope.getDate = function(dateString) {
			if (dateString) {
				return moment(new Date(dateString)).format("DD MMMM YYYY");
			}
			return null;
		};


		$scope.getHour = function(dateString) {
			if (dateString) {
				return moment(new Date(dateString)).format("HH:mm");
			}
			return null;
		};

		$scope.init = function() {

			$scope.loading = true;

			RaceServices.retrieve($scope.raceId,
				function(response) {

					$scope.race = response.race;

					var raceType = getRaceTypeByName(TYPE_OF_RACES, $scope.race.type.name);

					_.each(raceType.routes, function(routeType, index) {

						var currentRoute = null;

						if (typeof $scope.race.routes[index] !== 'undefined') {
							currentRoute = $scope.race.routes[index];
						}

						var route = {
							id: index,
							isVisible: false,
							editMode: false,
							segments: (currentRoute && currentRoute.segments.length > 0) ? currentRoute.segments : [],
							description: (currentRoute) ? currentRoute.description : "",
							distance: (currentRoute) ? currentRoute.distance : 0,
							descendant: (currentRoute) ? currentRoute.descendant : 0,
							ascendant: (currentRoute) ? currentRoute.ascendant : 0,
							minElevation: (currentRoute) ? currentRoute.minElevation : 0,
							maxElevation: (currentRoute) ? currentRoute.maxElevation : 0,
							elevationPoints: (currentRoute && currentRoute.elevationPoints.length > 0) ? currentRoute.elevationPoints : [],
							type: routeType.i18n,
							zoom: 13,
							fit: true,
							markers: [],
							polylines: [],
							center: {
								latitude: 46.52863469527167,
								longitude: 2.43896484375,
							},
							options: {
								mapTypeId: google.maps.MapTypeId.TERRAIN,
								mapTypeControlOptions: {
									mapTypeIds: [google.maps.MapTypeId.ROADMAP,
										google.maps.MapTypeId.HYBRID,
										google.maps.MapTypeId.SATELLITE,
										google.maps.MapTypeId.TERRAIN
									],
									style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
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
										zoomType: 'xy',
										height: 300,
										type: 'area'
									},
									plotOptions: {
										series: {
											turboThreshold: 0,
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
										shared: false,
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
										valueDecimals: 0,
										crosshairs: true
									}
								},
								series: [{
									name: "< 5%",
									data: [],
									color: '#428bca',
									enableMouseTracking: true,
									fillOpacity: 0.8,
									lineColor: '#303030'
								}, {
									name: "< 7%",
									data: [],
									color: '#feb63e',
									enableMouseTracking: false,
									fillOpacity: 0.8,
									lineColor: '#303030'
								}, {
									name: "< 10% ",
									data: [],
									color: '#ff7638',
									enableMouseTracking: false,
									fillOpacity: 0.8,
									lineColor: '#303030'
								}, {
									name: "< 15% ",
									data: [],
									color: '#a81a10',
									enableMouseTracking: false,
									fillOpacity: 0.8,
									lineColor: '#303030'
								}, {
									name: "> 15% ",
									data: [],
									color: '#451e0f ',
									enableMouseTracking: false,
									fillOpacity: 0.8,
									lineColor: '#303030'
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
							RouteFactory.rebuildElevationChart(route);
						}

						if (route.segments.length > 0) {
							route.markers = RouteFactory.rebuildMarkers(route.segments, false);
							route.polylines = RouteFactory.drawPolylines(route.segments);
						}

						if (route.segments.length === 0) {
							if ('undefined' !== $scope.race.pin.location) {
								route.center = {
									latitude: $scope.race.pin.location.lat,
									longitude: $scope.race.pin.location.lon
								};
							} else {
								route.center = $scope.race.pin.department.center;
							}
						}

						$scope.race.routes[index] = route;


					});

					$scope.race.routes[0].isVisible = true;

					$scope.isVisible = false;

					$scope.options = {
						map: {
							center: new google.maps.LatLng($scope.race.plan.address.latlng.lat, $scope.race.plan.address.latlng.lng),
							zoom: 6,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						}
					};

					$scope.addressMarkers = [{
						id: 0,
						location: {
							lat: $scope.race.plan.address.latlng.lat,
							lng: $scope.race.plan.address.latlng.lng
						}

					}];

					$scope.loading = false;

					setTimeout(function() {
						sharedMetaService.prepForMetaBroadcast($scope.race.name, $location.path(), $scope.generateRaceDescription());
					}, 1000);

					$scope.ready();
				},
				function(error) {

					$scope.loading = false;

					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.generateRaceDescription = function() {
			return $scope.race.name + ' , date: ' + $scope.getDate($scope.race.date) + ' , type: ' + $scope.race.type.i18n + ' , distance: ' + $scope.race.distanceType.name;
		}

		$scope.openFeedbackModal = function(raceId) {

			var modalInstance = $modal.open({
				templateUrl: 'partials/feedback',
				controller: 'FeedbackCtrl',
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


		$scope.init();

	}
]);

angular.module('nextrunApp').controller('FeedbackCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location', 'ContactServices', 'raceId',
	function($scope, $modalInstance, Auth, Alert, $location, ContactServices, raceId) {

		$scope.feedback = {};

		$scope.types = [{
			name: 'Bug'
		}, {
			name: 'Information erronée'
		}, {
			name: 'Dupliquer'
		}, {
			name: 'Autre'
		}];

		$scope.feedback.raceId = raceId;

		$scope.submit = function(feedback) {
			ContactServices.sendFeedback({
					feedback: feedback
				},
				function(response) {
					Alert.add("success", "Votre message a bien été envoyé", 3000);
					$modalInstance.close();
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