"use strict";

var workoutModule = angular.module("nextrunApp.workout", [
	"nextrunApp.commons",
	"google-maps"
]);

workoutModule.config(
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
		}).state("viewWorkoutWithSelection", {
			url: "/workouts/:id?selection",
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
		}).state("viewWorkoutParticipantWithSelection", {
			url: "/workouts/:id/participants/:participantId?selection",
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
		}).state("newWorkoutWithCurrentRoute", {
			url: "/workouts/route/:routeId/new",
			templateUrl: "/partials/workout/create",
			controller: "CreateWorkoutController",
			data: {
				access: access.public,
				fullscreen: false
			},
			resolve: {
				routeId: function($stateParams) {
					return $stateParams.routeId;
				}
			}
		}).state("editWorkoutWithSelection", {
			url: "/workouts/:id/edit?selection",
			templateUrl: "/partials/workout/workout",
			controller: "EditWorkoutController",
			data: {
				access: access.user,
				fullscreen: false
			},
			resolve: {
				workoutId: ['$stateParams',
					function($stateParams) {
						return $stateParams.id;
					}
				]
			}
		}).state("editWorkout", {
			url: "/workouts/:id/edit",
			templateUrl: "/partials/workout/workout",
			controller: "EditWorkoutController",
			data: {
				access: access.user,
				fullscreen: false
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
				access: access.public,
				fullscreen: false
			},
			resolve: {
				routeId: function() {
					return {};
				}
			}
		});

		$locationProvider.html5Mode(true);

	});