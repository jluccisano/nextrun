angular.module('nextrunApp').controller('MapCtrl', ['$scope', '$location', '$rootScope', 'Auth', 'Alert', '$log', 'LayerFactory', 'RouteFactory',

	function($scope, $location, $rootScope, Auth, Alert, $log, LayerFactory, RouteFactory) {
		'use strict';

		$scope.directionService = new google.maps.DirectionsService();
		$scope.elevationService = new google.maps.ElevationService();

		$scope.route = {

			segments: [],
			distance: 0,
			descendant: 0,
			ascendant: 0,
			minElevation: 0,
			maxElevation: 0,
			elevationPoints: [],
			type: null
		}


		$scope.layer = {
			markers: [],
			polylines: [],
			segments: []
		}

		$scope.polylines = [];



		$scope.stayOnTheRoad = true;
		$scope.travelMode = google.maps.TravelMode.DRIVING;

		$scope.myMarkers = [{
			"latitude": 33.22,
			"longitude": 35.33
		}];

		$scope.center = {
			latitude: 33.895497,
			longitude: 35.480347,
		};

		$scope.zoom = 13;
		$scope.markers = $scope.myMarkers;
		$scope.fit = true;

		$scope.events = {
			click: function(mapModel, eventName, originalEventArgs) {

				$scope.onClickMap(originalEventArgs[0].latLng, $scope.stayOnTheRoad, $scope.travelMode);


			}
		};



		$scope.onClickMap = function(destinationLatlng, stayOnTheRoad, travelMode) {

			var lastLatlngOfLastSegment;

			var isFirstPoint = false;

			if (LayerFactory.getSegments().length > 0) {
				lastLatlngOfLastSegment = LayerFactory.getLastPointOfLastSegment($scope.layer).latlng;
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

				$scope.directionService.route(directionsRequest, function(result, status) {

					if (status == google.maps.DirectionsStatus.OK && directionsRequest.unitSystem == google.maps.UnitSystem.METRIC) {

						var segment = $scope.createSegment(result.routes[0], isFirstPoint);

						$scope.calculateDistanceFromStartForEachPointOfSegment(segment);

						var samplesPoints = $scope.findSamplesPointIntoSegment(segment, 0.1);

						//_this.getRoute().addSegment(segment);
						$scope.route.segments.push(segment);

						//_this.getLayer().addSegment(segment);
						$scope.layer.segments.push(segment);

						//samplesPoints = _this.getElevationFromSamplesPoints(segment, result.routes[0].overview_path, samplesPoints, _this);
						samplesPoints = $scope.getElevationFromSamplesPoints(segment, result.routes[0].overview_path, samplesPoints);
					}
				});

			} else {

				//var route = [];
				//route.push(lastLatlngOfLastSegment);
				//route.push(destinationLatlng);

				$scope.route.push(lastLatlngOfLastSegment);
				$scope.route.push(destinationLatlng);

				var segment = $scope.createSimpleSegment(lastLatlngOfLastSegment, destinationLatlng);

				//this.calculateDistanceFromStartForEachPointOfSegment(segment, this);
				$scope.calculateDistanceFromStartForEachPointOfSegment(segment);

				//var samplesPoints = this.findSamplesPointIntoSegment(segment, 0.1, this);
				var samplesPoints = $scope.findSamplesPointIntoSegment(segment, 0.1);

				//this.getRoute().addSegment(segment);
				$scope.route.segments.push(segment);

				//this.getLayer().addSegment(segment);
				$scope.layer.segments.push(segment);

				//samplesPoints = this.getElevationFromSamplesPoints(segment, route, samplesPoints, this);
				samplesPoints = $scope.getElevationFromSamplesPoints(segment, result.routes[0].overview_path, samplesPoints);


			}

		};

		$scope.createSegment = function(route, isFirstPoint) {

			var path = route.overview_path;
			var legs = route.legs;

			//var segment = new Segment();
			var segment = {
				segmentId: $scope.generateUUID(),
				points: [],
				distance: 0
			};

			var segmentPoints = [];

			var startIndex = 1;
			if (isFirstPoint == true) {
				startIndex = 0
			}

			//ne pas prendre le premier point car il s'agit du dernier point du dernier segment
			for (var k = startIndex; k < path.length; k++) {

				//var point = new Point();
				//point.setSegmentId(segment.getSegmentId());
				//point.setLatlng(path[k]);
				var point = {
					latlng: path[k],
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: segment.segmentId
				}
				//point.segmentId = segment.segmentId;
				//point.latlng = path[k];

				segmentPoints.push(point);
			}
			//segment.setDistance($scope.calculateDistanceOfSegment(legs));
			//segment.setPoints(segmentPoints);

			segment.distance = $scope.calculateDistanceOfSegment(legs);

			segment.points = segmentPoints;

			return segment;
		};

		$scope.createSimpleSegment = function(latLngOfLastSegment, destinationLatlng) {

			//var segment = new Segment();
			var segment = {
				segmentId: $scope.generateUUID(),
				points: [],
				distance: 0
			};

			var segmentPoints = [];

			//var point = new Point();
			//point.setSegmentId(segment.getSegmentId());
			//point.setLatlng(destinationLatlng);

			var point = {
				latlng: destinationLatlng,
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: segment.segmentId
			};

			segmentPoints.push(point);

			var segmentDistance = parseFloat($scope.calculateDistanceBetween2Points(latLngOfLastSegment, destinationLatlng));
			segment.distance = segmentDistance;
			segment.points = segmentPoints;

			return segment;

		};

		$scope.calculateDistanceOfSegment = function(legs) {

			var distance = 0.0;
			var segmentDistance = 0.0;

			for (var i = 0; i < legs.length; i++) {
				distance = legs[i].distance.value / 1000;
				segmentDistance += distance;
			}
			return segmentDistance;
		};

		$scope.calculateDistanceBetween2Points = function(p1, p2) {

			var R = 6371; // earth's mean radius in km
			var dLat = $scope.rad(p2.lat() - p1.lat());
			var dLong = $scope.rad(p2.lng() - p1.lng());

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos($scope.rad(p1.lat())) * Math.cos($scope.rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;

			return d.toFixed(3);
		};

		$scope.generateUUID = function() {

			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
			});
			return uuid;
		};

		$scope.rad = function(x) {
			return x * Math.PI / 180;
		};

		$scope.calculateDistanceFromStartForEachPointOfSegment = function(segment) {

			var distanceBetween2Points = 0.0;
			//var segmentPoints = segment.getPoints();
			var segmentPoints = segment.points;
			var lastPoint = null;
			var cumulatedDistance = 0;

			if ($scope.route.segments.length > 0) {
				//lastPoint = $scope.route.getLastPointOfLastSegment();
				lastPoint = RouteFactory.getLastPointOfLastSegment($scope.route);
				cumulatedDistance = $scope.route.distance;
			}


			if (lastPoint) {
				for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

					if (k == 0) {

						distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(lastPoint.latlng, segmentPoints[k].latlng));

					} else {

						distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(segmentPoints[k - 1].latlng, segmentPoints[k].latlng));
					}

					cumulatedDistance += distanceBetween2Points;

					segmentPoints[k].distanceFromStart = cumulatedDistance;
				}
			}

			if ($scope.route) {
				$scope.route.distance = cumulatedDistance;
			}


		};

		$scope.findSamplesPointIntoSegment = function(segment, samples) {

			var distanceBetween2Points = 0.0;
			var samplesPoints = [];
			var segmentPoints = segment.points;
			var lastPoint = null;

			if ($scope.route.segments.length > 0) {
				lastPoint = RouteFactory.getLastPointOfLastSegment($scope.route);
			}

			var cursor = lastPoint;

			if (lastPoint) {
				for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

					distanceBetween2Points = parseFloat(calculateDistanceBetween2Points(cursor.latlng, segmentPoints[k].latlng));

					if (k == (segmentPoints.length - 1) || distanceBetween2Points >= samples) {
						samplesPoints.push(segmentPoints[k]);
						cursor = segmentPoints[k];
					}
				}
			} else {
				if (segmentPoints.length == 1) {
					samplesPoints.push(segmentPoints[0]);
				}
			}

			return samplesPoints;

		};

		$scope.getElevationFromSamplesPoints = function(segment, path, samplesPoints) {

			var samplesLatlng = RouteFactory.getAllLatlngFromPoints(samplesPoints);

			$scope.getElevationFromLocation(samplesLatlng, function(result, status) {

				if (status != google.maps.ElevationStatus.OK) {
					return;
				}

				for (var k = 0; k < result.length; k++) {

					samplesPoints[k].elevation = result[k].elevation;

					var lastPoint = RouteFactory.getLastElevationPoint($scope.route.elevationPoints);

					if (lastPoint) {
						var diffElevation = (parseFloat(samplesPoints[k].elevation) - parseFloat(lastPoint.elevation));
						var distanceWithLastPoint = samplesPoints[k].distanceFromStart - lastPoint.distanceFromStart;
						var grade = 0;
						if (distanceWithLastPoint != 0 && diffElevation != 0) {
							grade = ((diffElevation / (distanceWithLastPoint * 1000)) * 100).toFixed(1);
						}
						samplesPoints[k].grade = grade;
					}

					//_this.getRoute().addElevationPoint(samplesPoints[k]);
					$scope.route.elevationPoints.push(samplesPoints[k]);
				}

				//_this.display.addPointsToElevationChart(samplesPoints);

				RouteFactory.calculateElevationDataAlongRoute($scope.route);

				//_this.display.refreshRouteInformation(_this.getRoute());

				$scope.drawSegment(segment, path);

			});

			return samplesPoints;
		};

		$scope.getElevationFromLocation = function(locations, cb) {
			var positionalRequest = {
				locations: locations
			}

			$scope.elevationService.getElevationForLocations(positionalRequest, cb);
		};

		$scope.drawSegment = function(segment, path) {

			$scope.createMarker(segment, path);

			$scope.createPolyLine(path);
		},

		$scope.createMarker = function(segment, path, _this) {

			if ($scope.layer.segments.length == 1) {

				//create start marker
				var icon = new google.maps.MarkerImage("../../img/start.png",
					new google.maps.Size(128, 128),
					new google.maps.Point(0, 0),
					new google.maps.Point(20, 40),
					new google.maps.Size(40, 40)
				);

			} else {

				//_this.replaceLastMarkerBySegmentPoint(_this);

				var icon = new google.maps.MarkerImage("../../img/end.png",
					new google.maps.Size(128, 128),
					new google.maps.Point(0, 0),
					new google.maps.Point(20, 40),
					new google.maps.Size(40, 40)
				);
			}

			var marker = new google.maps.Marker({
				position: path[path.length - 1],
				//map: _this.display.getMap(),
				icon: icon
			});

			//_this.getLayer().addMarker(marker);
			$scope.markers.push(marker);

			/*google.maps.event.addListener(marker, 'dblclick', function(event) {
				_this.deleteLastSegment(_this);
			});*/

		};

		$scope.createPolyLine = function(path) {

			var polyLine = new google.maps.Polyline({
				//map: _this.display.getMap(),
				strokeColor: "red",
				strokeWeight: 5
			});

			//polyLine.setPath(path);

			$scope.polylines.push(path);

			//_this.getLayer().addPolyLine(polyLine);
			$scope.layer.polylines.push(polyLine);
		};


	}
]);

angular.module('nextrunApp').factory('LayerFactory', function($http) {
	'use strict';

	var markers = [];
	var polylines = [];
	var segments = [];

	return {
		getLastPointOfLastSegment: function() {
			var segmentIndex = 0;
			var pointIndex = 0;

			if (segments.length > 0) {
				segmentIndex = segments.length - 1;
			}

			var lastSegment = segments[segmentIndex];
			var pointsOfLastSegment = lastSegment.getPoints();

			if (pointsOfLastSegment.length > 0) {
				pointIndex = pointsOfLastSegment.length - 1;
			}

			lastPointOfLastSegment = pointsOfLastSegment[pointIndex];

			return lastPointOfLastSegment;
		},
		getSegments: function() {
			return segments;
		}

	};
});

angular.module('nextrunApp').factory('RouteFactory', function() {
		'use strict';

		return {
			getLastPointOfLastSegment: function(route) {

				var lastPointOfLastSegment = null;
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
			},
			getAllLatlngFromPoints: function(points) {
				var samplesLatlng = [];

				for (var k = 0; k < points.length; k++) {
					samplesLatlng.push(points[k].latlng);
				}
				
				return samplesLatlng;
	
			},
			getLastElevationPoint: function(elevationPoints) {
				return elevationPoints[elevationPoints.length - 1];
			},
			calculateElevationDataAlongRoute: function(route) {

				route.ascendant = 0;
				route.descendant = 0;
				route.minElevation = route.elevationPoints[0].elevation;
				route.maxElevation = route.elevationPoints[0].elevation;

				if (route.elevationPoints.length > 0) {


					for (var k = 1, lk = route.elevationPoints.length; k < lk; ++k) {

						diffElevation = (parseFloat(route.elevationPoints[k].elevation) - parseFloat(route.elevationPoints[k - 1].elevation));

						if (diffElevation > 0) {
							route.ascendant = (route.ascendant + diffElevation);
						} else {
							route.descendant = (route.descendant + diffElevation);
						}

						if (route.elevationPoints[k - 1].elevation > route.maxElevation) {
							route.maxElevation = (route.elevationPoints[k - 1].elevation);
						}

						if (route.elevationPoints[k - 1].elevation < route.minElevation) {
							route.minElevation(route.elevationPoints[k - 1].elevation);
						}
					}
				}
			}
		}
	});

	/*
angular.module('nextrunApp').factory('PointFactory', function() {
	'use strict';
	return {
		createPoint: function(point) {

			var newPoint = {
				latlng: new google.maps.LatLng(point.latlng.mb, point.latlng.nb),
				elevation: point.elevation,
				distanceFromStart: point.distanceFromStart,
				grade: point.grade,
				segmentId: point.segmentId
			}
			return newPoint;
		}
	};
});*/