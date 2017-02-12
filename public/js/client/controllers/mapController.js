nextrunControllers.controller('MapCtrl', ['$scope', '$location', '$rootScope', 'Auth', 'Alert', '$log', 'LayerFactory',

	function($scope, $location, $rootScope, Auth, Alert, $log, LayerFactory) {
		'use strict';

		$scope.directionService = new google.maps.DirectionsService();
		$scope.elevationService = new google.maps.ElevationService();



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
				lastLatlngOfLastSegment = LayerFactory.getLastPointOfLastSegment().getLatlng();
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

						//var samplesPoints = _this.findSamplesPointIntoSegment(segment, 0.1, _this);

						//_this.getRoute().addSegment(segment);

						//_this.getLayer().addSegment(segment);

						//samplesPoints = _this.getElevationFromSamplesPoints(segment, result.routes[0].overview_path, samplesPoints, _this);
					}
				});

			} else {

				//var route = [];
				//route.push(lastLatlngOfLastSegment);
				//route.push(destinationLatlng);

				//var segment = this.createSimpleSegment(lastLatlngOfLastSegment, destinationLatlng, this);

				//this.calculateDistanceFromStartForEachPointOfSegment(segment, this);

				//var samplesPoints = this.findSamplesPointIntoSegment(segment, 0.1, this);

				//this.getRoute().addSegment(segment);

				//this.getLayer().addSegment(segment);

				//samplesPoints = this.getElevationFromSamplesPoints(segment, route, samplesPoints, this);

			}

		};

		$scope.createSegment = function(route, isFirstPoint) {

			var path = route.overview_path;
			var legs = route.legs;

			var segment = new Segment();
			var segmentPoints = [];

			var startIndex = 1;
			if (isFirstPoint == true) {
				startIndex = 0
			}

			//ne pas prendre le premier point car il s'agit du dernier point du dernier segment
			for (var k = startIndex; k < path.length; k++) {

				var point = new Point();
				point.setSegmentId(segment.getSegmentId());
				point.setLatlng(path[k]);

				segmentPoints.push(point);
			}
			segment.setDistance($scope.calculateDistanceOfSegment(legs));
			segment.setPoints(segmentPoints);

			return segment;
		};

		$scope.createSimpleSegment = function(latLngOfLastSegment, destinationLatlng) {

			var segment = new Segment();
			var segmentPoints = [];

			var point = new Point();
			point.setSegmentId(segment.getSegmentId());
			point.setLatlng(destinationLatlng);

			segmentPoints.push(point);

			var segmentDistance = parseFloat(calculateDistanceBetween2Points(latLngOfLastSegment, destinationLatlng));
			segment.setDistance(segmentDistance);
			segment.setPoints(segmentPoints);

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
			var dLat = rad(p2.lat() - p1.lat());
			var dLong = rad(p2.lng() - p1.lng());

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
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
			var segmentPoints = segment.getPoints();
			var lastPoint = null;
			var cumulatedDistance = 0;

			if (_this.getRoute().getSegments().length > 0) {
				lastPoint = _this.getRoute().getLastPointOfLastSegment();
				cumulatedDistance = _this.getRoute().getDistance();
			}


			if (lastPoint) {
				for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

					if (k == 0) {

						distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(lastPoint.getLatlng(), segmentPoints[k].getLatlng()));

					} else {

						distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(segmentPoints[k - 1].getLatlng(), segmentPoints[k].getLatlng()));
					}

					cumulatedDistance += distanceBetween2Points;

					segmentPoints[k].setDistanceFromStart(cumulatedDistance);
				}
			}

			/*if (_this.getRoute()) {
				_this.getRoute().setDistance(cumulatedDistance);
			}*/


		},



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