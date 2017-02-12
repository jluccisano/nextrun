"use strict";

angular.module("nextrunApp.route").factory("SegmentService",
	function() {

		return {
			/*calculateDistanceOfSegment: function(legs) {

				if (!legs) {
					throw new Error("legs is undefined");
				}

				var distance = 0.0;
				var segmentDistance = 0.0;

				for (var i = 0; i < legs.length; i++) {
					distance = legs[i].distance.value / 1000;
					segmentDistance += distance;
				}
				return segmentDistance;
			},*/
			/*createSegment: function(path, legs, isFirstPoint) {

				if (!path) {
					throw new Error("path is undefined");
				}

				if (!legs) {
					throw new Error("legs is undefined");
				}

				var segment = {
					segmentId: RouteUtilsService.generateUUID(),
					points: [],
					distance: 0
				};

				var segmentPoints = [];

				var startIndex = 1;

				if (isFirstPoint === true) {
					startIndex = 0;
				}

				//ne pas prendre le premier point car il s"agit du dernier point du dernier segment
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
					};

					segmentPoints.push(point);
				}

				segment.distance = this.calculateDistanceOfSegment(legs);
				segment.points = segmentPoints;

				return segment;
			},
			getLastPointOfLastSegment: function(segments) {

				if (!segments) {
					throw new Error("segments is undefined");
				}

				if (segments.length === 0) {
					throw new Error("segments must contains at least 1 segment");
				}

				var lastPointOfLastSegment;
				var segmentIndex = 0;
				var pointIndex = 0;

				if (segments.length > 0) {
					segmentIndex = segments.length - 1;
				}

				var lastSegment = segments[segmentIndex];

				if (lastSegment) {
					var pointsOfLastSegment = lastSegment.points;

					if (pointsOfLastSegment.length > 0) {
						pointIndex = pointsOfLastSegment.length - 1;
					}

					lastPointOfLastSegment = pointsOfLastSegment[pointIndex];
				}

				return lastPointOfLastSegment;
			},*/
			/**
			 * Cette fonction créé un segment d"un seul point
			 * Il s"agit d"un segment dont le point A et le dernier point du segment précédent
			 * @param {google.maps.Latlng} startLatlng
			 * @param {google.maps.Latlng} destinationLatlng
			 * @throws {Error} If params are not defined or are not instance of google.maps.Latlng
			 * @returns {Segment}
			 */
			/*createSimpleSegment: function(startLatlng, destinationLatlng) {

				if (!startLatlng) {
					throw new Error("start Latlng is undefined");
				}

				if (!destinationLatlng) {
					throw new Error("destination Latlng is undefined");
				}

				if (!(startLatlng instanceof google.maps.LatLng)) {
					throw new Error("start Latlng is not instance of google.maps.Latlng");
				}

				if (!(destinationLatlng instanceof google.maps.LatLng)) {
					throw new Error("destination Latlng is not instance of google.maps.Latlng");
				}

				var segment = {
					segmentId: RouteUtilsService.generateUUID(),
					points: [],
					distance: 0
				};

				var segmentPoints = [];
				segmentPoints.push({
					latlng: {
						mb: destinationLatlng.lat(),
						nb: destinationLatlng.lng()
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: segment.segmentId
				});

				try {
					segment.distance = parseFloat(RouteUtilsService.calculateDistanceBetween2Points(startLatlng, destinationLatlng));
				} catch (ex) {
					$log.error(ex.message);
				}

				segment.points = segmentPoints;

				return segment;
			},*/
			/*removeLastSegment: function(route) {
				route.segments.splice(route.segments.length - 1, 1);

				if (route.polylines.length > 0) {
					route.polylines.splice(route.polylines.length - 1, 1);
				}
			},*/
			/**
			* Cette fonction retourne le dernier segment de la liste
			* @throws {Error} if segment is undefined
			* @throws {Error} if segments mustn"t contain at least 1 segment
			* @param {Array} of {Segments}
			* @return {Segment}
			*/
			/*getLastSegment: function(segments) {

				if (!segments) {
					throw new Error("segments is undefined");
				}

				if (segments.length === 0) {
					throw new Error("segments must contains at least 1 segment");
				}

				var lastSegment;

				if (segments.length > 0) {
					lastSegment = segments[segments.length - 1];
				}
				return lastSegment;
			},*/
			/*clearSegment: function(route) {

				var lastPointOfLastSegment = this.getLastPointOfLastSegment(route.segments);

				if (lastPointOfLastSegment) {

					route.distance = lastPointOfLastSegment.distanceFromStart;

					//ElevationServices.calculateElevationDataAlongRoute(route);

				} else {
					route.ascendant = 0;
					route.descendant = 0;
					route.minElevation = 0;
					route.maxElevation = 0;
					route.distance = 0.0;
				}
			},*/
			/*getLastLatLngOfPath: function(path) {

				var lastLatLng;

				if (!path || path.length >= 0) {
					throw new Error("path is must contain at least one LatLng");
				}

				lastLatLng = path[path.length - 1];


				if (!(lastLatLng instanceof google.maps.LatLng)) {
					throw new Error("Last LatLng is not instance of google.maps.Latlng");
				}

				return lastLatLng;

			},*/
			/*addMarkerToRoute: function(route, path) {

				try {

					var marker = {};

					var lastLatLng = this.getLastLatLngOfPath(path);

					if (route.segments.length === 1) {

						MarkerService.createMarker(lastLatLng, "client/modules/route/images/start.png", "first point");

					} else {

						//replace last marker by segment point
						var segmentIcon = new google.maps.MarkerImage("client/modules/route/images/segment.png",
							new google.maps.Size(32, 32),
							new google.maps.Point(0, 0),
							new google.maps.Point(8, 8),
							new google.maps.Size(16, 16)
						);

						var lastMarker = MarkerService.getLastMarker(route.markers);
						lastMarker.icon = segmentIcon;

						//create the new last marker
						MarkerService.createMarker(lastLatLng, "client/modules/route/images/end.png", "end point");
					}

					route.markers.push(marker);

				} catch (ex) {
					$log.error("an error occured during add marker to route", ex.message);
				}


			},*/
			/*drawSegment: function(route, path) {

				this.addMarkerToRoute(route, path);

				var polyline = PolylineService.createPolyline(path, false, false, false, true, "red", 5);

				route.polylines.push(polyline);
			},*/
			/*calculateDistanceFromStartForEachPointOfSegment: function(segmentPoints, lastPointOfLastSegment) {

				if (!segmentPoints) {
					throw new Error("segmentPoints is undefined");
				}

				var distanceBetween2Points = 0.0;
				var cumulatedDistance = 0;

				if (lastPointOfLastSegment) {

					cumulatedDistance = lastPointOfLastSegment.distanceFromStart;

					for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

						if (k === 0) {

							distanceBetween2Points = parseFloat(RouteUtilsService.calculateDistanceBetween2Points(lastPointOfLastSegment.latlng, segmentPoints[k].latlng));

						} else {

							distanceBetween2Points = parseFloat(RouteUtilsService.calculateDistanceBetween2Points(segmentPoints[k - 1].latlng, segmentPoints[k].latlng));
						}

						cumulatedDistance += distanceBetween2Points;

						segmentPoints[k].distanceFromStart = cumulatedDistance;
					}
				}

				return segmentPoints;
			},*/
			/*findSamplesPointIntoSegment: function(segment, samples) {

				var distanceBetween2Points = 0.0;
				var samplesPoints = [];
				var segmentPoints = segment.points;
				var lastPoint = null;

	

				var cursor = lastPoint;

				if (lastPoint) {
					for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

						distanceBetween2Points = parseFloat(RouteUtilsService.calculateDistanceBetween2Points(cursor.latlng, segmentPoints[k].latlng));

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

			}*/


		};
	});