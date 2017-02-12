"use strict";

angular.module("nextrunApp.race").directive("nrResults", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/templates/results",
    controller: "ResultsController",
    scope: {
      editMode: "=editMode",
      race: "=race"
    }
  };
});

angular.module("nextrunApp.race").controller("ResultsController", function($scope, RaceService, gettextCatalog, notificationService) {

  $scope.edit = false;
  $scope.tmpRace = {};

  $scope.toggleEdit = function() {
    $scope.edit = !$scope.edit;
    return $scope.edit;
  };


  $scope.$watch("race", function(newValue) {
    if (newValue) {
      angular.copy(newValue, $scope.tmpRace);
    }
  });

  $scope.addResult = function(result) {
      RaceService.addResult($scope.race._id, result).then(function() {
        $scope.init();
        notificationService.success(gettextCatalog.getString("Votre résultat a bien été ajouté"));
      });
  };

  $scope.deleteResult = function(result) {
    RaceService.deleteResult($scope.race._id, result._id).then(function() {
        $scope.init();
        notificationService.success(gettextCatalog.getString("Votre résultat a bien été supprimé"));
      });
  };

  $scope.cancel = function() {
    $scope.edit = false;
    angular.copy($scope.tmpRace, $scope.race);
  };

  $scope.update = function() {

  };
});