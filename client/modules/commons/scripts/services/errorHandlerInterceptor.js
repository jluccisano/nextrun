"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($q, Alert, $translate, $filter, $location) {
		var interceptor = {
			"responseError": function(response) {

				if (response.status === 401) {
					$location.path("/login");
				}

				if (response.data && response.data.message) {
					_.each(response.data.message, function(message) {
						Alert.add("danger", $filter("translate")(message), 3000);
					});
				}

				return $q.reject(response);
			}
		};
		return interceptor;
	});