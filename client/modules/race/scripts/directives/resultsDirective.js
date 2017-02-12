"use strict";

angular.module("nextrunApp.race").directive("nrResults", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/templates/results",
    controller: "ResultsController",
    scope: {
      editMode: "=editMode",
      race: "=race",
      reload: "&"
    }
  };
});

angular.module("nextrunApp.race").controller("ResultsController", function($scope, $q, RaceService, gettextCatalog, notificationService) {

  $scope.edit = false;
  $scope.tmpRace = {};

  

  $scope.toggleEdit = function() {
    $scope.edit = !$scope.edit;
    return $scope.edit;
  };

  $scope.createYearList = function() {
      var years = [];
      var date = new Date();
      var currentYear = date.getFullYear();

      for(var i = currentYear ; i > (currentYear - 10) ; i--) {
          years.push(i);
      }
      return years;
  };

  $scope.years = $scope.createYearList();


  $scope.$watch("race", function(newValue) {
    if (newValue) {
      angular.copy(newValue, $scope.tmpRace);
    }
  });

  $scope.addResult = function(result) {
    RaceService.addResult($scope.race._id, result).then(function() {
      $scope.reload();
      notificationService.success(gettextCatalog.getString("Votre résultat a bien été ajouté"));
    });
  };

  $scope.deleteResult = function(result) {
    RaceService.deleteResult($scope.race._id, result._id).then(function() {
      $scope.reload();
      notificationService.success(gettextCatalog.getString("Votre résultat a bien été supprimé"));
    });
  };

  $scope.cancel = function() {
    $scope.edit = false;
    angular.copy($scope.tmpRace, $scope.race);
  };

  $scope.downloadResult = function(result) {
    var defer = $q.defer();

    RaceService.downloadResult($scope.race._id, result._id).then(function(response) {
      var base64EncodedString = decodeURIComponent(response.data);
      defer.resolve(base64EncodedString);
    });

    return defer.promise;
  };

});