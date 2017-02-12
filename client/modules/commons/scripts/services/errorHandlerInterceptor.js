"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($injector, $q, $cookieStore, notificationService) {

		var stateService = $injector.get("$state");
		var AuthService = $injector.get("AuthService");

		var interceptor = {
			"responseError": function(response) {

				if (response.status === 403) {
					$cookieStore.remove("user");
					AuthService.saveAttemptUrl();
					stateService.go("login");
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