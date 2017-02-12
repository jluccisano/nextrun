"use strict";

angular.module("nextrunApp.route").factory("MarkerService", function() {
	return {

		createMarker: function(latLng, icon, title) {

			if (!(latLng instanceof google.maps.LatLng)) {
				throw new Error("latLng is not instance of google.maps.Latlng");
			}

			var marker = {
				latitude: latLng.lat(),
				longitude: latLng.lng(),
				icon: icon,
				title: title
			};

			return marker;
		},
		getLastMarker: function(markers) {

			if (!markers || markers.length > 0) {
				throw new Error("markers array must contain at least one element");
			}

			return markers[markers.length - 1];

		},
		removeLastMarker: function(markers) {
	
			if (!markers || markers.length > 0) {
				throw new Error("markers array must contain at least one element");
			}

			markers.splice(markers.length - 1, 1);	
		}
	};
});