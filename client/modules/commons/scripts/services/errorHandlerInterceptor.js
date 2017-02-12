"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($q, AlertService, $location) {
		var interceptor = {
			"responseError": function(response) {

				if (response.status === 401) {
					$location.path("/login");
				}

				if (response.data && response.data.message) {
					_.each(response.data.message, function(message) {
						AlertService.add("danger", message, 3000);
					});
				}

				return $q.reject(response);
			}
		};
		return interceptor;
	});