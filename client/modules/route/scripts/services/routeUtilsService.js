"use strict";

angular.module("nextrunApp.route").factory("RouteUtilsService", function(GmapsApiService) {

	return {

		convertPointsToPath: function(points) {
			var path = [];

			_.each(points, function(point){
				path.push(GmapsApiService.LatLng(point.getLatitude(), point.getLongitude());
			});
			return path;
		},
		convertPathToPoints: function(path, isFirstPoint) {

			var startIndex = 1;
			var points = [];

			if (isFirstPoint === true) {
				startIndex = 0;
			}

			//ne pas prendre le premier point car il s"agit du dernier point du dernier segment
			for (var k = startIndex; k < path.length; k++) {

				points.push({
					lat: path[k].lat(),
					lng: path[k].lng(),
					elevation: 0,
					distanceFromStart: 0,
					grade: 0
				});
			}

			return points;
		},
		calculateDistanceFromLegs: function(legs) {
			if (!legs) {
				throw new Error("legs is undefined");
			}

			var distance = 0.0;
			var distanceTotal = 0.0;

			for (var i = 0; i < legs.length; i++) {
				distance = legs[i].distance.value / 1000;
				distanceTotal += distance;
			}
			return distanceTotal;
		},
		setCenter: function(scope, currentRoute) {

			//default France center
			var center = {
				latitude: 46.52863469527167,
				longitude: 2.43896484375,
			};

			if (currentRoute.segments.length === 0) {

				if (!_.isUndefined(scope.race.pin)) {
					if (!_.isUndefined(scope.race.pin.location)) {
						center = {
							latitude: scope.race.pin.location.lat,
							longitude: scope.race.pin.location.lon
						};
					} else {
						//set the department of location
						center = scope.race.pin.department.center;
					}
				}

			}
			return center;
		}
	};
});