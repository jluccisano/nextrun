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
				access: access.user,
				fullscreen: true
			},
			resolve: {
				race: function() {
					return {};
				},
				workout: function() {
					return {};
				}
			}
		}).state("viewRoute", {
			url: "/routes/:id",
			templateUrl: "/partials/route/mapView",
			controller: "ViewRouteController",
			data: {
				access: access.public,
				fullscreen: true
			}
		}).state("editRaceRoute", {
			url: "/routes/:id/race/:raceId/edit",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				race: function($stateParams, RaceService) {
					return RaceService.retrieve($stateParams.raceId);
				},
				workout: function() {
					return {};
				}
			}
		}).state("editWorkoutRoute", {
			url: "/routes/:id/workout/:workoutId/edit",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				workout: function($stateParams, WorkoutService) {
					return WorkoutService.retrieve($stateParams.workoutId);
				},
				race: function() {
					return {};
				}
			}
		}).state("newRoute", {
			url: "/routes/new",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				race: function() {
					return {};
				},
				workout: function() {
					return {};
				}
			}
		}).state("newRaceRoute", {
			url: "/routes/race/:raceId/new",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				race: function($stateParams, RaceService) {
					return RaceService.retrieve($stateParams.raceId);
				},
				workout: function() {
					return {};
				}
			}
		}).state("newWorkoutRoute", {
			url: "/routes/workout/:workoutId/new",
			templateUrl: "/partials/route/mapEditor",
			controller: "EditRouteController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				workout: function($stateParams, WorkoutService) {
					return WorkoutService.retrieve($stateParams.workoutId);
				},
				race: function() {
					return {};
				}
			}
		}).state("routes", {
			url: "/users/:id/routes",
			templateUrl: "/partials/route/routes",
			controller: "RoutesController",
			data: {
				access: access.user,
				fullscreen: false
			}
		}).state("allroutes", {
			url: "/routes",
			templateUrl: "/partials/route/allroutes",
			controller: "RoutesController",
			data: {
				access: access.user,
				fullscreen: false
			}
		});

		$locationProvider.html5Mode(true);

	});