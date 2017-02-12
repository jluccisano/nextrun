"use strict;"

var routeModule = angular.module("nextrunApp.route", ["nextrunApp.commons", "google-maps", "cb.x2js"]);

routeModule.config(
	function(
		$stateProvider,
		$locationProvider) {

		var access = routingConfig.accessLevels;

		$stateProvider.state("editRoute", {
			url: "/routes/:id/edit",
			templateUrl: "/partials/route/edit",
			controller: "EditRouteController",
			data: {
				access: access.user
			},
			resolve: {
				routeId: ['$stateParams',
					function($stateParams) {
						return $stateParams.id;
					}
				]
			}
		}).state("newRoute", {
			url: "/routes/new",
			templateUrl: "/partials/route/edit",
			controller: "EditRouteController",
			data: {
				access: access.user
			}
		});

		$locationProvider.html5Mode(true);

	});