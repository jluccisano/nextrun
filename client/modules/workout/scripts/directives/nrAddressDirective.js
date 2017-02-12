"use strict";

angular.module("nextrunApp.workout").directive("nrWorkoutAddress", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/workout/templates/address",
    controller: "WorkoutAddressController",
    scope: {
      editMode: "=editMode",
      workout: "=workout"
    }
  };
});

angular.module("nextrunApp.workout").controller("WorkoutAddressController", function($scope, WorkoutService, gettextCatalog, notificationService) {

  $scope.edit = false;
  $scope.tmpWorkout = {};

  $scope.mapOptions = {
    zoom: 12
  };

  $scope.options = {
    types: "(cities)",
    watchEnter: true
  };

  $scope.placeMarker = {
    id: "123",
    icon: "client/modules/route/images/end.png",
    coords: {
      latitude: 46.52863469527167,
      longitude: 2.43896484375
    }
  };

  $scope.toggleEdit = function() {
    $scope.edit = !$scope.edit;
    return $scope.edit;
  };

  $scope.$watch("workout", function(newValue) {
    if (newValue) {
      angular.copy(newValue, $scope.tmpWorkout);

      if (newValue.place && newValue.place.location) {
        $scope.placeMarker.coords = newValue.place.location;
      }
    }
  });

  $scope.cancel = function() {
    $scope.edit = false;
    angular.copy($scope.tmpWorkout, $scope.workout);
  };

  $scope.update = function() {

    WorkoutService.update($scope.workout._id, {
      fields: {
        "place": $scope.workout.place
      }
    }).then(
      function() {
        $scope.placeMarker.coords = $scope.workout.place.location;
        $scope.edit = false;
        notificationService.success(gettextCatalog.getString("Votre sortie a bien été mise à jour"));
      });
  };
});