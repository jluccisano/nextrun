"use strict";

angular.module("mockModule").factory("mockGpxService",
	function(mockRoute) {

		return {
			getTrkpts: function() {
				return [];
			},
			convertGPXtoRoute: function() {
				return mockRoute;
			}
		};
	});