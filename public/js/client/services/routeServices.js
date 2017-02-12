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


			drawSegment(route, segment, path);

			$scope.$apply();

		});

		return samplesPoints;
	};

	var getElevationFromLocation = function(locations, cb) {
		var positionalRequest = {
			locations: locations
		}

		elevationService.getElevationForLocations(positionalRequest, cb);
	};

	var drawSegment = function(route, segment, path) {

		createMarker(route, segment, path);

		createPolyLine(route, path);
	};

	var createMarker = function(route, segment, path, _this) {

		var marker = {};

		if (route.segments.length === 1) {

			marker = {
				latitude: path[path.length - 1].mb,
				longitude: path[path.length - 1].nb,
				icon: "../../../img/start.png",
				title: "hello"
			}
		} else {

			replaceLastMarkerBySegmentPoint(route);

			marker = {
				latitude: path[path.length - 1].mb,
				longitude: path[path.length - 1].nb,
				icon: "../../../img/end.png",
				title: "hello"
			}
		}

		route.markers.push(marker);

	};

	var replaceLastMarkerBySegmentPoint = function(route) {

		var icon = new google.maps.MarkerImage("../../../img/segment.png",
			new google.maps.Size(32, 32),
			new google.maps.Point(0, 0),
			new google.maps.Point(8, 8),
			new google.maps.Size(16, 16)
		);

		if (route.markers.length > 1) {
			route.markers[route.markers.length - 1].icon = icon;
		}
	};


	var createPolyLine = function(route, path) {

		var pathArray = [];
		_.each(path, function(point) {
			pathArray.push({
				latitude: point.mb,
				longitude: point.nb
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
	};

	var calculateDistanceBetween2Points = function(p1, p2) {

		var R = 6371; // earth's mean radius in km
		var dLat = rad(p2.mb - p1.mb);
		var dLong = rad(p2.nb - p1.nb);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(rad(p1.mb)) * Math.cos(rad(p2.mb)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
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

	var removeLastMarker = function(route) {

		var marker = {};

		if (route.markers.length > 0) {
			route.markers[route.markers.length - 1];
			route.markers.splice(route.markers.length - 1, 1);
		}

		if (route.markers.length > 1) {

			marker = getMarkerByIndex(route, route.markers.length - 1);

			marker.icon = "../../../img/end.png";
		}

		if (route.markers.length === 1) {

			marker = getMarkerByIndex(route, 0);
		}
	};

	var getMarkerByIndex = function(route, index) {
		if (route.markers.length <= 0 && index < route.markers.length) {
			throw new Error("marker must not be null");
		}
		return route.markers[index];
	};

	var removeLastSegment = function(route) {

		route.segments.splice(route.segments.length - 1, 1);

		if (route.polylines.length > 0) {
			route.polylines[route.polylines.length - 1];
			route.polylines.splice(route.polylines.length - 1, 1);
		}
	};

	var clearSegment = function(route) {

		var lastPointOfLastSegment = getLastPointOfLastSegment(route);

		if (lastPointOfLastSegment) {

			route.distance = lastPointOfLastSegment.distanceFromStart;

			calculateElevationDataAlongRoute(route);

		} else {
			route.ascendant = 0;
			route.descendant = 0;
			route.minElevation = 0;
			route.maxElevation = 0;
			route.distance = 0.0;
		}
	};

	return {
		onClickMap: function($scope, route, destinationLatlng, travelMode) {

			var lastLatlngOfLastSegment;

			var isFirstPoint = false;

			if (route.segments.length > 0) {
				lastLatlngOfLastSegment = getLastPointOfLastSegment(route).latlng;
			} else {
				lastLatlngOfLastSegment = destinationLatlng;
				isFirstPoint = true;
			}

			if (route.stayOnTheRoad) {

				var directionsRequest = {
					origin: new google.maps.LatLng(lastLatlngOfLastSegment.mb, lastLatlngOfLastSegment.nb),
					destination: new google.maps.LatLng(destinationLatlng.mb, destinationLatlng.nb),
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

		},
		drawPolylines: function(segments) {

			var polylines = [];
			var pathArray = [];

			_.each(segments, function(segment, index) {

				var lastPointOfLastSegment;

				if (index > 0) {

					var lastSegment = segments[index - 1];

					if (typeof lastSegment.points[lastSegment.points.length - 1] !== 'undefined') {
						lastPointOfLastSegment = lastSegment.points[lastSegment.points.length - 1];
					}

					pathArray.push({
						latitude: lastPointOfLastSegment.latlng.mb,
						longitude: lastPointOfLastSegment.latlng.nb
					});

				}

				_.each(segment.points, function(point) {
					pathArray.push({
						latitude: point.latlng.mb,
						longitude: point.latlng.nb
					});
				});
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

			polylines.push(polyLine);
			return polylines;
		},
		rebuildPolylines: function(segments) {

			var polylines = [];

			_.each(segments, function(segment, index) {

				var pathArray = [];

				var lastPointOfLastSegment;

				if (index > 0) {

					var lastSegment = segments[index - 1];

					if (typeof lastSegment.points[lastSegment.points.length - 1] !== 'undefined') {
						lastPointOfLastSegment = lastSegment.points[lastSegment.points.length - 1];
					}

					pathArray.push({
						latitude: lastPointOfLastSegment.latlng.mb,
						longitude: lastPointOfLastSegment.latlng.nb
					});

				}

				_.each(segment.points, function(point) {
					pathArray.push({
						latitude: point.latlng.mb,
						longitude: point.latlng.nb
					});
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

				polylines.push(polyLine);
			});
			return polylines;
		},
		rebuildMarkers: function(segments, showSegment) {

			var markers = [];

			_.each(segments, function(segment, index) {

				var lastPointOfSegment;
				var icon;
				var marker;

				if (typeof segment.points[segment.points.length - 1] !== 'undefined') {
					lastPointOfSegment = segment.points[segment.points.length - 1];
				}

				if (index === 0) {
					icon = "../../../img/start.png";
				} else if (index === (segments.length - 1)) {
					icon = "../../../img/end.png";
				} else if (showSegment) {
					icon = new google.maps.MarkerImage("../../../img/segment.png",
						new google.maps.Size(32, 32),
						new google.maps.Point(0, 0),
						new google.maps.Point(8, 8),
						new google.maps.Size(16, 16)
					);
				}

				if (icon) {
					marker = {
						latitude: lastPointOfSegment.latlng.mb,
						longitude: lastPointOfSegment.latlng.nb,
						icon: icon,
						title: "hello"
					}
				}

				if (marker) {
					markers.push(marker);
				}
			});
			return markers;
		},
		rebuildElevationChart: function(elevationPoints) {

			var datas = [];

			_.each(elevationPoints, function(elevationPoint) {

				var data = {
					x: parseFloat(elevationPoint.distanceFromStart.toFixed(2)),
					y: elevationPoint.elevation,
					grade: elevationPoint.grade,
					color: 'blue',
					fillColor: 'blue',
					segmentId: elevationPoint.segmentId,
					latlng: elevationPoint.latlng

				};
				datas.push(data);
			});
			return datas;
		},
		delete: function(route) {

			route.ascendant = 0;
			route.descendant = 0;
			route.minElevation = 0;
			route.maxElevation = 0;
			route.distance = 0.0;
			route.elevationPoints = [];
			route.segments = [];

			route.markers.length = 0;
			route.polylines.length = 0;

			route.chartConfig.series[0].data = [];
		},
		undo: function(route) {

			if (route.segments.length > 0) {

				var lastSegment = getLastSegment(route.segments);

				removeLastSegment(route);

				removeLastMarker(route);

				route.elevationPoints = _.difference(route.elevationPoints, _.where(route.elevationPoints, {
					'segmentId': lastSegment.segmentId
				}));


				clearSegment(route);

				removePointsToElevationChartBySegmentId(route, lastSegment.segmentId);
			}
		}

	}
});