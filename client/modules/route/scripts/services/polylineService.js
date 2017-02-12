"use strict";

angular.module("nextrunApp.route").factory("PolylineService",
	function(RouteUtilsService) {

		return {
			createPolyline: function(route, path, editable, draggable, geodesic, visible, color, weight) {

				var pathArray = [];

				_.each(path, function(point) {

					if (!(point instanceof google.maps.LatLng)) {
						throw new Error("point is not instance of google.maps.Latlng");
					}

					pathArray.push({
						latitude: point.lat(),
						longitude: point.lng()
					});
				});

				if (pathArray.length > 1) {
					var polyline = {
						id: RouteUtilsService.generateUUID(),
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
					throw new Error("polyline must contain at least two point");
				}
			}
		};
	});