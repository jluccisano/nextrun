"use strict";

angular.module("nextrunApp.race").directive("nrDate", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/date",
    controller: "DateController",
    scope: {
      editMode: "=editMode",
      race: "=race"
    },
    link: function($scope) {


    }
  };
});

angular.module("nextrunApp.race").controller("DateController",
  function($scope, $modal, RaceService, gettextCatalog, AlertService, RaceTypeEnum, RouteHelperService, RouteService) {

    $scope.edit = false;
    $scope.gettextCatalog = gettextCatalog;
    $scope.types = RaceTypeEnum.getValues();
    $scope.tmpRace = {};

    $scope.$watch("race", function(newValue, oldValue) {
      if (newValue) {
        angular.copy(newValue, $scope.tmpRace);
      }
    });

    $scope.toggleEdit = function() {
      return $scope.edit = !$scope.edit;
    };

    $scope.cancel = function() {
      $scope.edit = false;
      angular.copy($scope.tmpRace, $scope.race);
    };

    $scope.update = function() {

      if (!angular.equals($scope.tmpRace, $scope.race)) {
        RaceService.update($scope.race._id, {
          fields: {
            "date": $scope.race.date
          }
        }).then(
          function() {
            $scope.edit = false;
            AlertService.add("success", gettextCatalog.getString("Votre manifestation a bien été mise à jour"), 3000);
          });
      }
    };

  });