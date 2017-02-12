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
				latlng: {
					mb: path[k].lat(),
					nb: path[k].lng()
				},
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
			samplesLatlng.push(new google.maps.LatLng(points[k].latlng.mb, points[k].latlng.nb));
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
			latlng: {
				mb: destinationLatlng.lat(),
				nb: destinationLatlng.lng()
			},
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
				latitude: path[path.length - 1].lat(),
				longitude: path[path.length - 1].lng(),
				icon: "../../../img/start.png",
				title: "hello"
			}
		} else {

			replaceLastMarkerBySegmentPoint(route);

			marker = {
				latitude: path[path.length - 1].lat(),
				longitude: path[path.length - 1].lng(),
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
				latitude: point.lat(),
				longitude: point.lng()
			})
		});


		var polyLine = {
			id: generateUUID(),
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

		var climbs = {
			climbsInf7: [],
			climbsInf10: [],
			climbsInf15: [],
			climbsSup15: []
		}

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

			climbs = addClimbsToElevationChart(route, samplesPoints, k, climbs);



		}

		route.chartConfig.series[1].data = route.chartConfig.series[1].data.concat(climbs.climbsInf7);
		route.chartConfig.series[2].data = route.chartConfig.series[2].data.concat(climbs.climbsInf10);
		route.chartConfig.series[3].data = route.chartConfig.series[3].data.concat(climbs.climbsInf15);
		route.chartConfig.series[4].data = route.chartConfig.series[4].data.concat(climbs.climbsSup15);
	};

	var addClimbsToElevationChart = function(route, elevationPoints, index, climbs) {

		var previousElevationPoint;
		var previousData;

		if (elevationPoints[index].grade > 5 && elevationPoints[index].grade <= 7) {

			//get previous point
			if (index > 0) {
				previousElevationPoint = elevationPoints[index - 1];
				previousData = {
					x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
					y: previousElevationPoint.elevation,
					grade: previousElevationPoint.grade,
					segmentId: previousElevationPoint.segmentId,
					latlng: previousElevationPoint.latlng

				};
				climbs.climbsInf7.push(previousData);
			}

			climbs.climbsInf7.push({
				x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
				y: elevationPoints[index].elevation,
				grade: elevationPoints[index].grade,
				segmentId: elevationPoints[index].segmentId,
				latlng: elevationPoints[index].latlng

			});
		} else if (elevationPoints[index].grade > 7 && elevationPoints[index].grade <= 10) {
			//get previous point
			if (index > 0) {
				previousElevationPoint = elevationPoints[index - 1];
				previousData = {
					x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
					y: previousElevationPoint.elevation,
					grade: previousElevationPoint.grade,
					segmentId: previousElevationPoint.segmentId,
					latlng: previousElevationPoint.latlng

				};
				climbs.climbsInf10.push(previousData);
			}

			climbs.climbsInf10.push({
				x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
				y: elevationPoints[index].elevation,
				grade: elevationPoints[index].grade,
				segmentId: elevationPoints[index].segmentId,
				latlng: elevationPoints[index].latlng

			});
		} else if (elevationPoints[index].grade > 10 && elevationPoints[index].grade <= 15) {
			//get previous point
			if (index > 0) {
				previousElevationPoint = elevationPoints[index - 1];
				previousData = {
					x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
					y: previousElevationPoint.elevation,
					grade: previousElevationPoint.grade,
					segmentId: previousElevationPoint.segmentId,
					latlng: previousElevationPoint.latlng

				};
				climbs.climbsInf15.push(previousData);
			}

			climbs.climbsInf15.push({
				x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
				y: elevationPoints[index].elevation,
				grade: elevationPoints[index].grade,
				segmentId: elevationPoints[index].segmentId,
				latlng: elevationPoints[index].latlng

			});

		} else if (elevationPoints[index].grade > 15) {
			//get previous point
			if (index > 0) {
				previousElevationPoint = elevationPoints[index - 1];
				previousData = {
					x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
					y: previousElevationPoint.elevation,
					grade: previousElevationPoint.grade,
					segmentId: previousElevationPoint.segmentId,
					latlng: previousElevationPoint.latlng

				};
				climbs.climbsSup15.push(previousData);
			}

			climbs.climbsSup15.push({
				x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
				y: elevationPoints[index].elevation,
				grade: elevationPoints[index].grade,
				segmentId: elevationPoints[index].segmentId,
				latlng: elevationPoints[index].latlng

			});

		} else {

			var point0 = {
				x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
				y: null,
				grade: elevationPoints[index].grade,
				segmentId: elevationPoints[index].segmentId,
				latlng: elevationPoints[index].latlng

			}
			climbs.climbsInf7.push(point0);
			climbs.climbsInf10.push(point0);
			climbs.climbsInf15.push(point0);
			climbs.climbsSup15.push(point0);
		}

		return climbs;

	};

	var removePointsToElevationChartBySegmentId = function(route, segmentId) {
		route.chartConfig.series[0].data = _.difference(route.chartConfig.series[0].data, _.where(route.chartConfig.series[0].data, {
			'segmentId': segmentId
		}));
		route.chartConfig.series[1].data = _.difference(route.chartConfig.series[1].data, _.where(route.chartConfig.series[1].data, {
			'segmentId': segmentId
		}));
		route.chartConfig.series[2].data = _.difference(route.chartConfig.series[2].data, _.where(route.chartConfig.series[2].data, {
			'segmentId': segmentId
		}));
		route.chartConfig.series[3].data = _.difference(route.chartConfig.series[3].data, _.where(route.chartConfig.series[3].data, {
			'segmentId': segmentId
		}));
		route.chartConfig.series[4].data = _.difference(route.chartConfig.series[4].data, _.where(route.chartConfig.series[4].data, {
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

	var getTrkpts = function(gpxToJson) {

		if (_.isNull(gpxToJson) || _.isUndefined(gpxToJson) || _.isUndefined(gpxToJson.gpx) || _.isUndefined(gpxToJson.gpx.trk) || _.isUndefined(gpxToJson.gpx.trk.trkseg) || _.isUndefined(gpxToJson.gpx.trk.trkseg.trkpt)) {
			throw new Error("parse.gpx.error");
		}

		return gpxToJson.gpx.trk.trkseg.trkpt;
	}

	return {
		onClickMap: function($scope, route, destinationLatlng, travelMode) {

			var lastLatlngOfLastSegment;

			var isFirstPoint = false;

			if (route.segments.length > 0) {
				lastLatlngOfLastSegment = getLastPointOfLastSegment(route).latlng;
			} else {
				lastLatlngOfLastSegment = {
					mb: destinationLatlng.lat(),
					nb: destinationLatlng.lng()
				};
				isFirstPoint = true;
			}

			if (route.stayOnTheRoad) {

				var directionsRequest = {
					origin: new google.maps.LatLng(lastLatlngOfLastSegment.mb, lastLatlngOfLastSegment.nb),
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

				lastLatlngOfLastSegment = new google.maps.LatLng(lastLatlngOfLastSegment.mb, lastLatlngOfLastSegment.nb);

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
				id: generateUUID(),
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
					id: generateUUID(),
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
		convertRacesLocationToMarkers: function(races) {

			var markers = [];

			_.each(races, function(race, index) {

				var marker;

				if (race.pin) {
					marker = {
						raceId: race._id,
						raceName: race.name,
						latitude: race.pin.location.lat + (Math.random() - 0.5) / 1500,
						longitude: race.pin.location.lon + (Math.random() - 0.5) / 1500,
						icon: "../../../img/start.png",
						showWindow: false,
						title: "hello"
					}
				}

				if (marker) {
					markers.push(marker);
				}
			});
			return markers;
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
		rebuildElevationChart: function(route) {

			var datas = [];
			var climbs = {
				climbsInf7: [],
				climbsInf10: [],
				climbsInf15: [],
				climbsSup15: []
			}

			var elevationPoints = _.sortBy(route.elevationPoints, function(elevationPoint) {
				return parseFloat(elevationPoint.distanceFromStart.toFixed(2));
			});

			_.each(elevationPoints, function(elevationPoint, index) {

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

				climbs = addClimbsToElevationChart(route, elevationPoints, index, climbs);

			});
			route.chartConfig.series[0].data = datas;
			route.chartConfig.series[1].data = climbs.climbsInf7;
			route.chartConfig.series[2].data = climbs.climbsInf10;
			route.chartConfig.series[3].data = climbs.climbsInf15;
			route.chartConfig.series[4].data = climbs.climbsSup15;
			//return datas;
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
			route.chartConfig.series[1].data = [];
			route.chartConfig.series[2].data = [];
			route.chartConfig.series[3].data = [];
			route.chartConfig.series[4].data = [];

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
		},
		convertGPXtoRoute: function($scope, route, gpx) {
			try {

				var x2js = new X2JS();
				var gpxToJson = x2js.xml_str2json(gpx);


				var trkpts = getTrkpts(gpxToJson);
				var arrayOfSamplesPoint = [];
				var samplesPointCount = 0;
				//var samplesPoints = [];

				//create first segment with start marker
				var segment1Id = generateUUID();
				var segment1 = {
					segmentId: segment1Id,
					points: [{
						latlng: {
							mb: trkpts[0]._lat,
							nb: trkpts[0]._lon
						},
						elevation: trkpts[0].ele,
						distanceFromStart: 0,
						grade: 0,
						segmentId: segment1Id
					}],
					distance: 0
				};

				route.segments.push(segment1);


				var segment2 = {
					segmentId: generateUUID(),
					points: [],
					distance: 0
				};

				var index = 0;

				var segmentPointsOffset = parseInt(trkpts.length * 0.05);

				var sample = segmentPointsOffset * 0.001;

				_.each(trkpts, function(trkpt, i) {

					if (index === segmentPointsOffset || i === (trkpts.length - 1)) {

						segment2.distance = calculateDistanceFromStartForEachPointOfSegment(route, segment2);
						route.segments.push(segment2);

						var samplesPoints = findSamplesPointIntoSegment(route, segment2, sample);
						samplesPointCount = samplesPointCount + samplesPoints.length;
						arrayOfSamplesPoint.push(samplesPoints);

						//reinit the segment
						segment2 = {
							segmentId: generateUUID(),
							points: [],
							distance: 0
						};

						index = 0;
					}

					var point = {
						latlng: {
							mb: trkpt._lat,
							nb: trkpt._lon
						},
						elevation: parseInt(trkpt.ele),
						distanceFromStart: 0,
						grade: 0,
						segmentId: segment2.segmentId
					};

					segment2.points.push(point);

					index++;

				});

				_.each(arrayOfSamplesPoint, function(samplesPoints, j) {

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

						calculateElevationDataAlongRoute(route);

						if (route.elevationPoints.length === samplesPointCount) {
							// put code here to process arrayOfRes


							if (route.elevationPoints.length > 0) {

								var datas = [];
								var climbs = {
									climbsInf7: [],
									climbsInf10: [],
									climbsInf15: [],
									climbsSup15: []
								}

								var elevationPoints = _.sortBy(route.elevationPoints, function(elevationPoint) {
									return parseFloat(elevationPoint.distanceFromStart.toFixed(2));
								});

								_.each(elevationPoints, function(elevationPoint, index) {

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

									climbs = addClimbsToElevationChart(route, elevationPoints, index, climbs);

								});


								route.chartConfig.series[0].data = datas;
								route.chartConfig.series[1].data = climbs.climbsInf7;
								route.chartConfig.series[2].data = climbs.climbsInf10;
								route.chartConfig.series[3].data = climbs.climbsInf15;
								route.chartConfig.series[4].data = climbs.climbsSup15;


							}

							$scope.$apply();
						}

					});

				});

			} catch (ex) {
				throw new Error(ex);
			}
		}

	}
});