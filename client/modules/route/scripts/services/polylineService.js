"use strict";

angular.module("nextrunApp.route").factory("PolylineService",
	function($log) {

		return {
			createPolyline: function(route, path, editable, draggable, geodesic, visible, color, weight) {

				var pathArray = [];

				angular.forEach(path, function(point) {

					if (!(point instanceof google.maps.LatLng)) {
						$log.error("point is not instance of google.maps.Latlng");
						return;
					}

					pathArray.push({
						latitude: point.lat(),
						longitude: point.lng()
					});
				});

				if (pathArray.length > 1) {
					var polyline = {
						id: routeBuilder.generateUUID(),
						path: pathArray,
						stroke: {
							color: (color) ? color : "red",
							weight: (weight) ? weight : 5
						},
						editable: (editable) ? editable : false,
						draggable: (draggable) ? draggable : false,
						geodesic: (geodesic) ? geodesic : false,
						visible: (visible) ? visible : true
					};

					route.addPolyline(polyline);

				} else {
					$log.error("polyline must contain at least two point");
				}
			}
		};
	});