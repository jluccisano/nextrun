"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($injector, $q, $cookieStore, notificationService) {

		var interceptor = {
			"responseError": function(response) {

				$injector.invoke(function($state, AuthService) {

					if (response.status === 403) {
						$cookieStore.remove("user");
						AuthService.saveAttemptUrl();
						$state.go("login");
					} else if (response.data && response.data.message) {
						_.each(response.data.message, function(message) {
							notificationService.error(message);
						});
					}

					return $q.reject(response);
				});
			}
		};
		return interceptor;
	});