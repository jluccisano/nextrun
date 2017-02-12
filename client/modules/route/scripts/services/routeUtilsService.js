"use strict";

angular.module("nextrunApp.route").factory("RouteUtilsService", function() {

	return {
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

			if ( (!p1 || (p1.mb >= 180 || p1.mb <= -180)) || (!p2 || (p2.mb >= 180 || p2.mb <= -180)) ) {
				throw new Error("invalid longitude");
			}

			if ( (!p1 || (p1.nb >= 90 || p1.nb <= -90)) || (!p2 || (p2.nb >= 90 || p2.nb <= -90)) ) {
				throw new Error("invalid latitude");
			}

			var R = 6371; // earth"s mean radius in km
			var dLat = this.rad(p2.mb - p1.mb);
			var dLong = this.rad(p2.nb - p1.nb);

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(this.rad(p1.mb)) * Math.cos(this.rad(p2.mb)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;

			return d.toFixed(3);
		},
	};
});