angular.module('mockModule').factory('mockRouteHelperServices', ['mockRoute',
	function(mockRoute) {
		'use strict';

		return {
			generateRoute: function(scope, currentRoute, routeType) {
				return mockRoute;
			}
		};

	}
]);