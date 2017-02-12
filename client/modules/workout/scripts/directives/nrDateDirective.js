"use strict";

angular.module("nextrunApp.workout").directive("nrWorkoutDate", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/workout/templates/date",
    controller: "WorkoutDateController",
    scope: {
      editMode: "=editMode",
      workout: "=workout"
    }
  };
});

angular.module("nextrunApp.workout").controller("WorkoutDateController",
  function($scope, $modal, WorkoutService, gettextCatalog, notificationService) {

    $scope.edit = false;
    $scope.gettextCatalog = gettextCatalog;
    $scope.tmpWorkout = {};

    $scope.$watch("workout", function(newValue) {
      if (newValue) {
        angular.copy(newValue, $scope.tmpWorkout);
      }
    });

    $scope.toggleEdit = function() {
      $scope.edit = !$scope.edit;
      return $scope.edit;
    };

    $scope.cancel = function() {
      $scope.edit = false;
      angular.copy($scope.tmpWorkout, $scope.workout);
    };

    $scope.update = function() {

      if (!angular.equals($scope.tmpWorkout, $scope.workout)) {
        WorkoutService.update($scope.workout._id, {
          fields: {
            "date": $scope.workout.date
          }
        }).then(
          function() {
            $scope.edit = false;
            notificationService.success(gettextCatalog.getString("Votre sortie a bien été mise à jour"));
          });
      }
    };

  });