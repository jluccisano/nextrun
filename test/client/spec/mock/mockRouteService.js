"use strict";

angular.module("mockModule").factory("mockRouteService",
	function() {

		return {
			delete: function() {
				return true;
			},
			undo: function() {
				return true;
			},
			rebuildMarkers: function() {
				return [{
					latitude: 45.1,
					longitude: 1.33,
					title: "hello"
				}];
			},
			rebuildPolylines: function() {
				return [{
					id: 12345,
					path: [],
					stroke: {
						color: "red",
						weight: 5
					},
					editable: false,
					draggable: false,
					geodesic: false,
					visible: true
				}];
			},
			convertRacesLocationToMarkers: function() {
				return [{
					latitude: 45.3,
					longitude: 1.2,
					icon: "../../../img/start.png",
					title: "hello"
				}];
			}
		};
	});