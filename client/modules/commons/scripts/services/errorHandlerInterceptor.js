"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($q, notificationService, $state, $cookieStore) {
		var interceptor = {
			"responseError": function(response) {

				if (response.status === 401) {
					$cookieStore.remove("user");
          			AuthService.saveAttemptUrl();
          			$state.go("login");
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