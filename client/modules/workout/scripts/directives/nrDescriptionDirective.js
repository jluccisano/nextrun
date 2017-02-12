"use strict";

angular.module("nextrunApp.workout").directive("nrWorkoutDescription", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/workout/templates/description",
    controller: "WorkoutDescriptionController",
    scope: {
      editMode: "=editMode",
      workout: "=workout"
    }
  };
});

angular.module("nextrunApp.workout").controller("WorkoutDescriptionController",
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
        WorkoutService.saveOrUpdate($scope.workout, {
          fields: {
            "description": $scope.workout.description
          }
        }).then(
          function() {
            $scope.edit = false;
            notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
          });
      }
    };

  });