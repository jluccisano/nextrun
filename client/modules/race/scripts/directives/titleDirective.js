"use strict";

angular.module("nextrunApp.race").directive("nrTitle", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/templates/title",
    controller: "TitleController",
    scope: {
      editMode: "=editMode",
      race: "=race"
    }
  };
});

angular.module("nextrunApp.race").controller("TitleController",
  function($scope, $modal, RaceService, gettextCatalog, notificationService, RaceTypeEnum) {

    $scope.edit = false;
    $scope.gettextCatalog = gettextCatalog;
    $scope.types = RaceTypeEnum.getValues();
    $scope.tmpRace = {};

    $scope.$watch("race", function(newValue) {
      if (newValue) {
        angular.copy(newValue, $scope.tmpRace);
      }
    });

    $scope.toggleEdit = function() {
      $scope.edit = !$scope.edit;
      return $scope.edit;
    };

    $scope.cancel = function() {
      $scope.edit = false;
      angular.copy($scope.tmpRace, $scope.race);
    };

    $scope.update = function() {

      if (!angular.equals($scope.tmpRace, $scope.race)) {
        RaceService.update($scope.race._id, {
          fields: {
            "name": $scope.race.name
          }
        }).then(
          function() {
            $scope.edit = false;
            notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
          });
      }
    };

  });