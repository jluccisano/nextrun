"use strict";

angular.module("nextrunApp.route").factory("SegmentService",
	function(RouteUtilsService, GmapsApiService) {

		return {
			createSegmentDataModel: function(path, legs) {

				var points = RouteUtilsService.convertPathToPoints(path, isFirstPoint);
				var distance = RouteUtilsService.calculateDistanceFromLegs(legs);

				var segmentDataModel = {
					id: RouteUtilsService.generateUUID(),
					distance: distance,
					points: points
				};

				return segmentDataModel;
			},
			createSimpleSegmentDataModel: function(startLatlng, destinationLatlng) {

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

				var segmentDataModel = {
					segmentId: RouteUtilsService.generateUUID(),
					points: [],
					distance: 0
				};

				var segmentPoints = [];
				segmentPoints.push({
					lat: destinationLatlng.lat(),
					lng: destinationLatlng.lng(),
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: segmentDataModel.segmentId
				});

				try {
					segmentDataModel.distance = parseFloat(RouteUtilsService.calculateDistanceBetween2Points(startLatlng, destinationLatlng));
				} catch (ex) {
					console.log(ex.message);
				}

				segmentDataModel.points = segmentPoints;

				return segmentDataModel;
			},
			getDirection: function(route, directionsRequest, isFirstPoint) {

				var defer = $q.defer();

				GmapsApiService.DirectionsService().route(directionsRequest, function(result, status) {
					if (status === google.maps.DirectionsStatus.OK) {

						var path = result.routes[0].overview_path;
						var legs = result.routes[0].legs;

						var segmentDataModel = SegmentService.createSegmentDataModel(path, legs);

						var segment = route.addSegment(segmentDataModel);

						var data = {
							segment: segment,
							path: path
						};

						defer.resolve(data);
					} else {
						defer.reject(status);
					}
				});
				return defer.promise;
			},
			

		};
	});