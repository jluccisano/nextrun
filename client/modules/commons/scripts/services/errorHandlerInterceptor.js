"use strict";

angular.module("nextrunApp.commons").factory("ErrorHandlerInterceptor",
	function($injector, $q, $cookieStore, $log, notificationService) {

		var interceptor = {
			/*request: function(config) {
				$log.info(config);
				return config;
			},*/
			"responseError": function(response) {

				$injector.invoke(function($state, AuthService) {

					if (response.status === 403) {
						$cookieStore.remove("user");
						AuthService.saveAttemptUrl($state.current);
						$state.go("login");
					} else if (response.data && response.data.message) {
						angular.forEach(response.data.message, function(message) {
							notificationService.error(message);
						});
					}

					return $q.reject(response);
				});
			}
		};
		return interceptor;
	});