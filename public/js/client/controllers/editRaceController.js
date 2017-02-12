angular.module('nextrunApp').controller('EditRaceCtrl', ['$scope', '$location', 'RaceServices', 'Alert', 'Auth', '$routeParams', '$log', 'RouteFactory', '$window',

	function($scope, $location, RaceServices, Alert, Aut, $routeParams, $log, RouteFactory, window) {
		'use strict';

		$scope.Math = window.Math;

		/** init google maps service **/
		google.maps.visualRefresh = true;

		$scope.departments = DEPARTMENTS.enums;
		$scope.types = TYPE_OF_RACES.enums;
		$scope.distances = [];

		$scope.raceId = $routeParams.raceId;

		$scope.onChangeTab = function(route) {
			route.isVisible = true;
		};


		$scope.init = function() {
			RaceServices.retrieve($scope.raceId,
				function(response) {

					$scope.race = response.race;

					var raceType = getRaceTypeByName(TYPE_OF_RACES, $scope.race.type);

					_.each(raceType.routes, function(routeType) {

						var route = {
							isVisible: false,
							segments: [],
							distance: 0,
							descendant: 0,
							ascendant: 0,
							minElevation: 0,
							maxElevation: 0,
							elevationPoints: [],
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

														var cursorMarker = {
															latitude: this.latlng.mb,
															longitude: this.latlng.nb,
															icon: "../../../img/segment.png",
															title: "hello"
														}

														//$scope.cursorMarker = cursorMarker;
														//$scope.$apply();

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

						route.events = {
							click: function(mapModel, eventName, originalEventArgs) {
								RouteFactory.onClickMap($scope, route, originalEventArgs[0].latLng, true, google.maps.TravelMode.DRIVING);
							}
						}


						$scope.race.routes.push(route);
						$scope.race.routes[0].isVisible = true;

					});
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
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

angular.module('nextrunApp').factory('RouteFactory', function() {
	'use strict';

	var directionService = new google.maps.DirectionsService();
	var elevationService = new google.maps.ElevationService();

	var createSegment = function(route, isFirstPoint) {

		var path = route.overview_path;
		var legs = route.legs;

		var segment = {
			segmentId: generateUUID(),
			points: [],
			distance: 0
		};

		var segmentPoints = [];

		var startIndex = 1;
		if (isFirstPoint === true) {
			startIndex = 0
		}

		//ne pas prendre le premier point car il s'agit du dernier point du dernier segment
		for (var k = startIndex; k < path.length; k++) {

			var point = {
				latlng: path[k],
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: segment.segmentId
			}

			segmentPoints.push(point);
		}
		segment.distance = calculateDistanceOfSegment(legs);

		segment.points = segmentPoints;

		return segment;
	};

	var generateUUID = function() {

		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	};
	var rad = function(x) {
		return x * Math.PI / 180;
	};

	var calculateDistanceOfSegment = function(legs) {
		var distance = 0.0;
		var segmentDistance = 0.0;

		for (var i = 0; i < legs.length; i++) {
			distance = legs[i].distance.value / 1000;
			segmentDistance += distance;
		}
		return segmentDistance;
	};

	var getLastPointOfLastSegment = function(route) {

		var lastPointOfLastSegment;
		var segmentIndex = 0;
		var pointIndex = 0;

		if (route.segments.length > 0) {
			segmentIndex = route.segments.length - 1;
		}

		var lastSegment = route.segments[segmentIndex];

		if (lastSegment) {
			var pointsOfLastSegment = lastSegment.points;

			if (pointsOfLastSegment.length > 0) {
				pointIndex = pointsOfLastSegment.length - 1;
			}

			lastPointOfLastSegment = pointsOfLastSegment[pointIndex];
		}

		return lastPointOfLastSegment;
	};

	var getAllLatlngFromPoints = function(points) {
		var samplesLatlng = [];

		for (var k = 0; k < points.length; k++) {
			samplesLatlng.push(points[k].latlng);
		}

		return samplesLatlng;
	};

	var getLastElevationPoint = function(elevationPoints) {
		return elevationPoints[elevationPoints.length - 1];
	};

	var createSimpleSegment = function(latLngOfLastSegment, destinationLatlng) {

		var segment = {
			segmentId: generateUUID(),
			points: [],
			distance: 0
		};

		var segmentPoints = [];

		var point = {
			latlng: destinationLatlng,
			elevation: 0,
			distanceFromStart: 0,
			grade: 0,
			segmentId: segment.segmentId
		};

		segmentPoints.push(point);

		var segmentDistance = parseFloat(calculateDistanceBetween2Points(latLngOfLastSegment, destinationLatlng));
		segment.distance = segmentDistance;
		segment.points = segmentPoints;

		return segment;

	};

	var calculateDistanceFromStartForEachPointOfSegment = function(route, segment) {

		var distanceBetween2Points = 0.0;
		var segmentPoints = segment.points;
		var lastPoint = null;
		var cumulatedDistance = 0;

		if (route.segments.length > 0) {
			lastPoint = getLastPointOfLastSegment(route);
			cumulatedDistance = route.distance;
		}


		if (lastPoint) {
			for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

				if (k === 0) {

					distanceBetween2Points = parseFloat(calculateDistanceBetween2Points(lastPoint.latlng, segmentPoints[k].latlng));

				} else {

					distanceBetween2Points = parseFloat(calculateDistanceBetween2Points(segmentPoints[k - 1].latlng, segmentPoints[k].latlng));
				}

				cumulatedDistance += distanceBetween2Points;

				segmentPoints[k].distanceFromStart = cumulatedDistance;
			}
		}

		if (route) {
			route.distance = cumulatedDistance;
		}


	};

	var findSamplesPointIntoSegment = function(route, segment, samples) {

		var distanceBetween2Points = 0.0;
		var samplesPoints = [];
		var segmentPoints = segment.points;
		var lastPoint = null;

		if (route.segments.length > 0) {
			lastPoint = getLastPointOfLastSegment(route);
		}

		var cursor = lastPoint;

		if (lastPoint) {
			for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

				distanceBetween2Points = parseFloat(calculateDistanceBetween2Points(cursor.latlng, segmentPoints[k].latlng));

				if (k === (segmentPoints.length - 1) || distanceBetween2Points >= samples) {
					samplesPoints.push(segmentPoints[k]);
					cursor = segmentPoints[k];
				}
			}
		} else {
			if (segmentPoints.length === 1) {
				samplesPoints.push(segmentPoints[0]);
			}
		}

		return samplesPoints;

	};

	var getElevationFromSamplesPoints = function($scope, route, segment, path, samplesPoints) {

		var samplesLatlng = getAllLatlngFromPoints(samplesPoints);

		getElevationFromLocation(samplesLatlng, function(result, status) {

			if (status !== google.maps.ElevationStatus.OK) {
				return;
			}

			for (var k = 0; k < result.length; k++) {

				samplesPoints[k].elevation = result[k].elevation;

				var lastPoint = getLastElevationPoint(route.elevationPoints);

				if (lastPoint) {
					var diffElevation = (parseFloat(samplesPoints[k].elevation) - parseFloat(lastPoint.elevation));
					var distanceWithLastPoint = samplesPoints[k].distanceFromStart - lastPoint.distanceFromStart;
					var grade = 0;
					if (distanceWithLastPoint !== 0 && diffElevation !== 0) {
						grade = ((diffElevation / (distanceWithLastPoint * 1000)) * 100).toFixed(1);
					}
					samplesPoints[k].grade = grade;
				}

				route.elevationPoints.push(samplesPoints[k]);
			}

			addPointsToElevationChart(route, samplesPoints);

			calculateElevationDataAlongRoute(route);


			drawSegment($scope, route, segment, path);

		});

		return samplesPoints;
	};

	var getElevationFromLocation = function(locations, cb) {
		var positionalRequest = {
			locations: locations
		}

		elevationService.getElevationForLocations(positionalRequest, cb);
	};

	var drawSegment = function($scope, route, segment, path) {

		createMarker($scope, route, segment, path);

		createPolyLine($scope, route, path);
	};

	var createMarker = function($scope, route, segment, path, _this) {

		var marker = {};

		if (route.segments.length === 1) {

			marker = {
				latitude: path[path.length - 1].lat(),
				longitude: path[path.length - 1].lng(),
				icon: "../../../img/start.png",
				title: "hello"
			}
		} else {

			replaceLastMarkerBySegmentPoint($scope, route);

			marker = {
				latitude: path[path.length - 1].lat(),
				longitude: path[path.length - 1].lng(),
				icon: "../../../img/end.png",
				title: "hello"
			}
		}

		route.markers.push(marker);
		$scope.$apply();

	};

	var replaceLastMarkerBySegmentPoint = function($scope, route) {

		var icon = "../../../img/segment.png";

		if (route.markers.length > 1) {
			route.markers[route.markers.length - 1].icon = icon;
			$scope.$apply();
		}
	};

	var createPolyLine = function($scope, route, path) {

		var pathArray = [];
		_.each(path, function(point) {
			pathArray.push({
				latitude: point.lat(),
				longitude: point.lng()
			})
		});


		var polyLine = {
			path: pathArray,
			stroke: {
				color: "red",
				weight: 5
			},
			editable: false,
			draggable: false,
			geodesic: false,
			visible: true

		}

		route.polylines.push(polyLine);
		$scope.$apply();
	};

	var calculateDistanceBetween2Points = function(p1, p2) {

		var R = 6371; // earth's mean radius in km
		var dLat = rad(p2.lat() - p1.lat());
		var dLong = rad(p2.lng() - p1.lng());

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;

		return d.toFixed(3);
	};

	var calculateElevationDataAlongRoute = function(route) {

		route.ascendant = 0;
		route.descendant = 0;
		route.minElevation = route.elevationPoints[0].elevation;
		route.maxElevation = route.elevationPoints[0].elevation;

		if (route.elevationPoints.length > 0) {


			for (var k = 1, lk = route.elevationPoints.length; k < lk; ++k) {

				var diffElevation = (parseFloat(route.elevationPoints[k].elevation) - parseFloat(route.elevationPoints[k - 1].elevation));

				if (diffElevation > 0) {
					route.ascendant = (route.ascendant + diffElevation);
				} else {
					route.descendant = (route.descendant + diffElevation);
				}

				if (route.elevationPoints[k - 1].elevation > route.maxElevation) {
					route.maxElevation = (route.elevationPoints[k - 1].elevation);
				}

				if (route.elevationPoints[k - 1].elevation < route.minElevation) {
					route.minElevation = (route.elevationPoints[k - 1].elevation);
				}
			}
		}
	};

	var getLastSegment = function(segments) {
		var segmentIndex = 0;
		if (segments.length > 0) {
			segmentIndex = segments.length - 1;
		}
		var lastSegment = segments[segmentIndex];
		return lastSegment;
	};

	var addPointsToElevationChart = function(route, samplesPoints) {

		var datas = [];

		for (var k = 0; k < samplesPoints.length; k++) {

			var data = {
				x: parseFloat(samplesPoints[k].distanceFromStart.toFixed(2)),
				y: samplesPoints[k].elevation,
				grade: samplesPoints[k].grade,
				color: 'blue',
				fillColor: 'blue',
				segmentId: samplesPoints[k].segmentId,
				latlng: samplesPoints[k].latlng
			};

			route.chartConfig.series[0].data.push(data);
		}
	};

	var removePointsToElevationChartBySegmentId = function(route, segmentId) {
		route.chartConfig.series[0].data = _.difference(route.chartConfig.series[0].data, _.where(route.chartConfig.series[0].data, {
			'segmentId': segmentId
		}));
	};

	return {
		onClickMap: function($scope, route, destinationLatlng, stayOnTheRoad, travelMode) {

			var lastLatlngOfLastSegment;

			var isFirstPoint = false;

			if (route.segments.length > 0) {
				lastLatlngOfLastSegment = getLastPointOfLastSegment(route).latlng;
			} else {
				lastLatlngOfLastSegment = destinationLatlng;
				isFirstPoint = true;
			}

			if (stayOnTheRoad) {

				var directionsRequest = {
					origin: lastLatlngOfLastSegment,
					destination: destinationLatlng,
					travelMode: travelMode,
					provideRouteAlternatives: false,
					avoidHighways: true,
					avoidTolls: true,
					unitSystem: google.maps.UnitSystem.METRIC

				};

				directionService.route(directionsRequest, function(result, status) {

					if (status === google.maps.DirectionsStatus.OK && directionsRequest.unitSystem === google.maps.UnitSystem.METRIC) {

						var segment = createSegment(result.routes[0], isFirstPoint);

						calculateDistanceFromStartForEachPointOfSegment(route, segment);

						var samplesPoints = findSamplesPointIntoSegment(route, segment, 0.1);

						route.segments.push(segment);

						samplesPoints = getElevationFromSamplesPoints($scope, route, segment, result.routes[0].overview_path, samplesPoints);

					}
				});

			} else {

				var routeSamples = [];
				routeSamples.push(lastLatlngOfLastSegment);
				routeSamples.push(destinationLatlng);

				var segment = createSimpleSegment(lastLatlngOfLastSegment, destinationLatlng);

				calculateDistanceFromStartForEachPointOfSegment(route, segment);

				var samplesPoints = findSamplesPointIntoSegment(route, segment, 0.1);

				route.segments.push(segment);

				samplesPoints = getElevationFromSamplesPoints($scope, route, segment, routeSamples, samplesPoints);
			}

			return route;

		}
	}
});