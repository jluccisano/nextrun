angular.module('nextrunApp').controller('EditRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$routeParams', '$log', 'RouteFactory', '$window', '$modal', 'fileReader',

	function($scope, $location, RaceServices, Alert, Aut, $routeParams, $log, RouteFactory, window, $modal, fileReader) {
		'use strict';
		$scope.Math = window.Math;

		/** init google maps service **/
		google.maps.visualRefresh = true;

		$scope.navType = "pills";
		$scope.saving = false;
		$scope.loading = false;
		$scope.pending = false;


		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];
		$scope.cursorMarker = {};
		$scope.currentRaceType = {};

		$scope.options = {
			country: "fr",
			types: "(cities)"
		};

		$scope.raceId = $routeParams.raceId;

		$scope.textAngularOpts = {
			textAngularEditors: {
				demo1: {
					toolbar: [{
						icon: "<i class='icon-code'></i>",
						name: "html",
						title: "Toggle Html"
					}, {
						icon: "h1",
						name: "h1",
						title: "H1"
					}, {
						icon: "h2",
						name: "h2",
						title: "H2"
					}, {
						icon: "pre",
						name: "pre",
						title: "Pre"
					}, {
						icon: "<i class='icon-bold'></i>",
						name: "b",
						title: "Bold"
					}, {
						icon: "<i class='icon-italic'></i>",
						name: "i",
						title: "Italics"
					}, {
						icon: "p",
						name: "p",
						title: "Paragraph"
					}, {
						icon: "<i class='icon-list-ul'></i>",
						name: "ul",
						title: "Unordered List"
					}, {
						icon: "<i class='icon-list-ol'></i>",
						name: "ol",
						title: "Ordered List"
					}, {
						icon: "<i class='icon-rotate-right'></i>",
						name: "redo",
						title: "Redo"
					}, {
						icon: "<i class='icon-undo'></i>",
						name: "undo",
						title: "Undo"
					}, {
						icon: "<i class='icon-ban-circle'></i>",
						name: "clear",
						title: "Clear"
					}, {
						icon: "<i class='icon-file'></i>",
						name: "insertImage",
						title: "Insert Image"
					}, {
						icon: "<i class='icon-html5'></i>",
						name: "insertHtml",
						title: "Insert Html"
					}, {
						icon: "<i class='icon-link'></i>",
						name: "createLink",
						title: "Create Link"
					}],
					html: "<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn't Use an iFrame</li><li>Works with Firefox, Chrome, and IE10+</li></ol><p><b>Code at GitHub:</b> <a href='https://github.com/fraywing/textAngular'>Here</a> </p>",
					disableStyle: false,
					theme: {
						editor: {
							"font-family": "Roboto",
							"font-size": "1.2em",
							"border-radius": "4px",
							"padding": "11px",
							"background": "white",
							"border": "1px solid rgba(2,2,2,0.1)"
						},
						insertFormBtn: {
							"background": "red",
							"color": "white",
							"padding": "2px 3px",
							"font-size": "15px",
							"margin-top": "4px",
							"border-radius": "4px",
							"font-family": "Roboto",
							"border": "2px solid red"
						}
					}
				}

			}
		};


		$scope.onChangeTab = function(route) {
			route.isVisible = true;
		};

		$scope.getType = function(type) {
			return type.i18n;
		};

		$scope.getDistanceType = function(distanceType) {
			return distanceType.i18n;
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
							travelMode: google.maps.TravelMode.WALKING,
							zoom: 14,
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
								}, ]
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

						route.events = {
							click: function(mapModel, eventName, originalEventArgs) {
								RouteFactory.onClickMap($scope, route, originalEventArgs[0].latLng, google.maps.TravelMode.DRIVING);
							}
						}

						if (route.elevationPoints.length > 0) {
							RouteFactory.rebuildElevationChart(route);
						}

						if (route.segments.length > 0) {
							route.markers = RouteFactory.rebuildMarkers(route.segments, true);
							route.polylines = RouteFactory.rebuildPolylines(route.segments);
						}



						if (route.segments.length === 0) {

							if ('undefined' !== typeof $scope.race.pin.location) {
								route.center = {
									latitude: $scope.race.pin.location.lat,
									longitude: $scope.race.pin.location.lon
								}
							} else {
								route.center = $scope.race.pin.department.center;
							}

						}

						$scope.race.routes[index] = route;
						$scope.race.routes[0].isVisible = true;



					});

					$scope.race.type = raceType;
					$scope.currentRaceType = raceType;
					$scope.distances = $scope.race.type.distances;


					_.each($scope.race.type.distances, function(distanceType) {
						if ($scope.race.distanceType.name === distanceType.name) {
							$scope.race.distanceType = distanceType;
						}
					});

					$scope.loading = false;

					$scope.ready();

				},
				function(error) {

					$scope.loading = false;

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
			$scope.openChangeTypeConfirmation();

		};

		$scope.isLoggedIn = function() {
			return Auth.isLoggedIn();
		};

		$scope.cancel = function() {
			$location.path('/myraces');
		};

		$scope.submit = function(race) {

			var data = {
				race: $scope.race
			};

			$scope.saving = true;

			RaceServices.update($scope.raceId, data,
				function(res) {
					Alert.add("success", "Votre manifestation a bien été modifiée", 3000);
					$scope.saving = false;
					$location.path('/myraces');

				},
				function(error) {
					$scope.saving = false;
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.openChangeTypeConfirmation = function() {

			var modalInstance = $modal.open({
				templateUrl: 'partials/changetypeconfirmation',
				controller: 'ChangeTypeConfirmationCtrl',
				resolve: {}
			});

			modalInstance.result.then(function() {
				$scope.race.routes = [];

				$scope.changeType();

				$scope.currentRaceType = $scope.race.type;
				$scope.distances = $scope.race.type.distances;

			}, function() {

				$scope.race.type = $scope.currentRaceType;

			});
		};

		$scope.changeType = function() {

			var raceType = getRaceTypeByName(TYPE_OF_RACES, $scope.race.type.name);

			_.each(raceType.routes, function(routeType, index) {

				var route = {
					isVisible: false,
					editMode: true,
					segments: [],
					distance: 0,
					descendant: 0,
					ascendant: 0,
					minElevation: 0,
					maxElevation: 0,
					elevationPoints: [],
					type: routeType.i18n,
					stayOnTheRoad: true,
					travelMode: google.maps.TravelMode.WALKING,
					zoom: 10,
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

				route.events = {
					click: function(mapModel, eventName, originalEventArgs) {
						RouteFactory.onClickMap($scope, route, originalEventArgs[0].latLng, google.maps.TravelMode.DRIVING);
					}
				}

				if (route.segments.length === 0) {
					if ('undefined' !== typeof $scope.race.pin.location) {
						route.center = {
							latitude: $scope.race.pin.location.lat,
							longitude: $scope.race.pin.location.lon
						}
					} else {
						route.center = $scope.race.pin.department.center;
					}
				}

				$scope.race.routes[index] = route;
				$scope.race.routes[0].isVisible = true;
			});

		};

		$scope.getFile = function(route, file) {

			$scope.pending = true;

			fileReader.readAsDataUrl(file, $scope)
				.then(function(result) {

					route.segments = [];
					route.elevationPoints = [];
					route.distance = 0;
					route.descendant = 0;
					route.ascendant = 0;
					route.minElevation = 0;
					route.maxElevation = 0;


					try {
						RouteFactory.convertGPXtoRoute($scope, route, result);

						if (route.segments.length > 0) {
							route.markers = RouteFactory.rebuildMarkers(route.segments, true);
							route.polylines = RouteFactory.rebuildPolylines(route.segments);
						}

					} catch (ex) {
						Alert.add("danger", ex.message, 3000);
					} finally {
						$scope.pending = false;
					}

				});
		};

		$scope.init();

	}
]);

angular.module('nextrunApp').controller('ChangeTypeConfirmationCtrl', ['$scope', '$modalInstance', 'Auth', 'Alert', '$location',
	function($scope, $modalInstance, Auth, Alert, $location) {

		$scope.
		continue = function() {
			$modalInstance.close();
		};


		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	}
]);

angular.module('nextrunApp').directive("ngFileSelect", function() {

	return {
		require: ['ngModel'],
		link: function($scope, el, $attributes, ngModel) {

			el.bind("change", function(e) {
				$scope.file = (e.srcElement || e.target).files[0];
				$scope.getFile($scope.route, $scope.file);
			})

		}

	}
});