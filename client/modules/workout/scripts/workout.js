"use strict";

var routeModule = angular.module("nextrunApp.workout", [
	"nextrunApp.commons",
	"google-maps"
]);

routeModule.config(
	function(
		$stateProvider,
		$locationProvider) {

		var access = routingConfig.accessLevels;

		$stateProvider.state("viewWorkout", {
			url: "/workouts/:id",
			templateUrl: "/partials/workout/workout",
			controller: "ViewWorkoutController",
			data: {
				access: access.public,
				fullscreen: false
			},
			resolve: {
				workoutId: ['$stateParams',
					function($stateParams) {
						return $stateParams.id;
					}
				]
			}
		}).state("viewWorkoutParticipant", {
			url: "/workouts/:id/participants/:participantId",
			templateUrl: "/partials/workout/workout",
			controller: "ViewWorkoutController",
			data: {
				access: access.public,
				fullscreen: false
			},
			resolve: {
				workoutId: ['$stateParams',
					function($stateParams) {
						return $stateParams.id;
					}
				]
			}
		}).state("newWorkoutRoute", {
			url: "/workouts/route/:routeId/new",
			templateUrl: "/partials/workout/create",
			controller: "CreateWorkoutController",
			data: {
				access: access.public,
				fullscreen: true
			},
			resolve: {
				routeId: function($stateParams) {
					return $stateParams.routeId;
				}
			}
		}).state("editWorkout", {
			url: "/workouts/:id/edit",
			templateUrl: "/partials/workout/workout",
			controller: "EditWorkoutController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				workoutId: ['$stateParams',
					function($stateParams) {
						return $stateParams.id;
					}
				]
			}
		}).state("workouts", {
			url: "/users/:id/workouts",
			templateUrl: "/partials/workout/workouts",
			controller: "WorkoutsController",
			data: {
				access: access.user,
				fullscreen: false
			}
		}).state("allworkouts", {
			url: "/workouts",
			templateUrl: "/partials/workout/allworkouts",
			controller: "WorkoutsController",
			data: {
				access: access.user,
				fullscreen: false
			}
		}).state("newWorkout", {
			url: "/workouts/new",
			templateUrl: "/partials/workout/create",
			controller: "CreateWorkoutController",
			data: {
				access: access.user,
				fullscreen: true
			},
			resolve: {
				routeId: function() {
					return {};
				}
			}
		});

		$locationProvider.html5Mode(true);

	});