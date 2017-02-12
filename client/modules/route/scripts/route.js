"use strict";

var routeModule = angular.module("nextrunApp.route", [
	"nextrunApp.commons",
	"google-maps",
	"cb.x2js",
	"frapontillo.bootstrap-switch"
]);

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
			},
			resolve: {
				race: function() {
					return {}
				}
			}
		}).state("editRaceRoute", {
			url: "/routes/:id/race/:raceId/edit",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user
			},
			resolve: {
				race: function($stateParams, RaceService) {
					return RaceService.retrieve($stateParams.raceId);
				}
			}
		}).state("newRoute", {
			url: "/routes/new",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user
			},
			resolve: {
				race: function() {
					return {}
				}
			}
		}).state("newRaceRoute", {
			url: "/routes/race/:raceId/new",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user
			},
			resolve: {
				race: function($stateParams, RaceService) {
					return RaceService.retrieve($stateParams.raceId);
				}
			}
		}).state("routes", {
			url: "/users/routes",
			templateUrl: "/partials/route/routes",
			controller: "RoutesController",
			data: {
				access: access.user
			}
		});

		$locationProvider.html5Mode(true);

	});