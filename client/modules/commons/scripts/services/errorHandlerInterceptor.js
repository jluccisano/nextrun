"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($q, notificationService, $location) {
		var interceptor = {
			"responseError": function(response) {

				if (response.status === 401) {
					$location.path("/login");
				}

				if (response.data && response.data.message) {
					_.each(response.data.message, function(message) {
						notificationService.error(message);
					});
				}

				return $q.reject(response);
			}
		};
		return interceptor;
	});