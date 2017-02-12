"use strict";

var routeModule = angular.module("nextrunApp.route", ["nextrunApp.commons", "google-maps", "cb.x2js"]);

routeModule.config(
	function(
		$stateProvider,
		$locationProvider) {

		var access = routingConfig.accessLevels;

		$stateProvider.state("editRoute", {
			url: "/routes/:id/edit",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user
			}
		}).state("newRoute", {
			url: "/routes/new",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user
			}
		});

		$locationProvider.html5Mode(true);

	});