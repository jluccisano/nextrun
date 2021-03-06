"use strict";

angular.module("nextrunApp.route").factory("RouteUtilsService", function(GmapsApiService) {

	return {

		convertPointsToPath: function(points) {
			var path = [];

			for (var k = 0; k < points.length; k++) {
				path.push(GmapsApiService.LatLng(points[k].lat, points[k].lng));
			}
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
		getCenter: function(race) {

			//default France center
			var center = {
				latitude: 46.52863469527167,
				longitude: 2.43896484375,
			};

			if (angular.isDefined(race) && angular.isDefined(race.place)) {
				if (angular.isDefined(race.place.location)) {
					center = {
						latitude: race.place.location.latitude,
						longitude: race.place.location.longitude
					};
				}
			}
			return center;
		},
		getLastLatLngOfPath: function(path) {

			var lastLatLng;

			if (!path || path.length === 0) {
				throw new Error("path is must contain at least one LatLng");
			}

			lastLatLng = path[path.length - 1];


			if (!(lastLatLng instanceof google.maps.LatLng)) {
				throw new Error("Last LatLng is not instance of google.maps.Latlng");
			}

			return lastLatLng;
		},
		getAllLatlngFromPoints: function(points) {
			var samplesLatlng = [];

			angular.forEach(points, function(point) {
				samplesLatlng.push(GmapsApiService.LatLng(point.lat, point.lng));
			});

			return samplesLatlng;
		}
	};
});