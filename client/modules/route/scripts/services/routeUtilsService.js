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

			if (!_.isUndefined(race.pin)) {
				if (!_.isUndefined(race.pin.location)) {
					center = {
						latitude: race.pin.location.lat,
						longitude: race.pin.location.lon
					};
				} else {
					//set the department of location
					center = race.pin.department.center;
				}
			}
			return center;
		},
		getLastLatLngOfPath = function(path) {

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
		generateUUID: function() {
			var d = new Date().getTime();
			var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === "x" ? r : (r & 0x7 | 0x8)).toString(16);
			});
			return uuid;
		},
		rad: function(x) {
			return (x * Math.PI) / 180;
		},
		calculateDistanceBetween2Points: function(p1, p2) {

			if ((!p1 || (p1.lat >= 180 || p1.lat <= -180)) || (!p2 || (p2.lat >= 180 || p2.lat <= -180))) {
				throw new Error("invalid longitude");
			}

			if ((!p1 || (p1.lng >= 90 || p1.lng <= -90)) || (!p2 || (p2.lng >= 90 || p2.lng <= -90))) {
				throw new Error("invalid latitude");
			}

			var R = 6371; // earth"s mean radius in km
			var dLat = this.rad(p2.lat - p1.lat);
			var dLong = this.rad(p2.lng - p1.lng);

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;

			return d.toFixed(3);
		},
		getAllLatlngFromPoints: function(points) {
			var samplesLatlng = [];

			_.each(points, function(point) {
				samplesLatlng.push(GmapsApiService.LatLng(point.lat, point.lng));
			});

			return samplesLatlng;
		}
	};
});