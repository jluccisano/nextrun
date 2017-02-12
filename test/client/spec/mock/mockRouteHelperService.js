"use strict";

angular.module("mockModule").factory("mockRouteHelperService",
	function(mockRoute) {
		
		return {
			generateRoute: function() {
				return mockRoute;
			}
		};
	});