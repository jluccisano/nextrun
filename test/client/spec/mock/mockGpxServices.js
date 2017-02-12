angular.module('mockModule').factory('mockGpxServices', ['mockRoute',
	function(mockRoute) {
		'use strict';

		return {
			getTrkpts: function(gpxToJson) {
				return [];
			},
			convertGPXtoRoute: function(scope, route, result) {
				return mockRoute;
			}
		}
	}
]);