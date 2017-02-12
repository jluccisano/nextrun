angular.module('mockModule').factory('mockRouteServices', ['mockRoute',
	function(mockRoute) {
		'use strict';

		return {
			delete: function(route) {
				return true;
			},
			undo: function(route) {
				return true;
			},
			rebuildMarkers: function(segments, showSegment) {
				return [{
					latitude: 45.1,
					longitude: 1.33,
					title: "hello"
				}];
			},
			rebuildPolylines: function(segments) {
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

	}
]);