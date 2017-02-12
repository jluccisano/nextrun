"use strict";

angular.module("nextrunApp.route").factory("MarkerService", function(RouteUtilsService) {
	return {

		createMarker: function(latLng, icon, title) {

			if (!(latLng instanceof google.maps.LatLng)) {
				throw new Error("latLng is not instance of google.maps.Latlng");
			}

			var marker = {
				id: routeBuilder.generateUUID(),
				latitude: latLng.lat(),
				longitude: latLng.lng(),
				icon: icon,
				title: title
			};

			return marker;
		},

		addMarkerToRoute: function(route, path) {

			try {

				var marker = {};

				var lastLatLng = RouteUtilsService.getLastLatLngOfPath(path);

				var segments = route.getSegments();

				if (segments.length === 1) {

					marker = this.createMarker(lastLatLng, "client/modules/route/images/start.png", "first point");

				} else {

					if (segments.length > 2) {
						//replace last marker by segment point
						var segmentIcon = new google.maps.MarkerImage("client/modules/route/images/segment.png",
							new google.maps.Size(32, 32),
							new google.maps.Point(0, 0),
							new google.maps.Point(8, 8),
							new google.maps.Size(16, 16)
						);

						var lastMarker = route.getLastMarker();
						lastMarker.icon = segmentIcon;

					}

					//create the new last marker
					marker = this.createMarker(lastLatLng, "client/modules/route/images/end.png", "end point");
				}

				route.addMarker(marker);


			} catch (ex) {
				console.log("an error occured during add marker to route", ex.message);
			}
		},
	};
});