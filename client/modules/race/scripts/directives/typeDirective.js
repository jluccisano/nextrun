"use strict";

angular.module("nextrunApp.race").directive("nrType", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/type",
    controller: "TypeController",
    scope: {
      editMode: "=editMode",
      race: "=race"
    },
    link: function($scope) {


    }
  };
});

angular.module("nextrunApp.race").controller("TypeController",
  function($scope, $modal, RaceService, gettextCatalog, AlertService, RaceTypeEnum, RouteHelperService, RouteService) {

    $scope.edit = false;
    $scope.gettextCatalog = gettextCatalog;
    $scope.types = RaceTypeEnum.getValues();
    $scope.tmpRace = {};

    $scope.$watch("race", function(newValue, oldValue) {
      if(newValue) {
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

      $scope.modalInstance = $modal.open({
        templateUrl: "partials/race/changeTypeConfirmationModal",
        controller: "ChangeTypeConfirmationModalController"
      });

      if (!angular.equals($scope.tmpRace, $scope.race)) {

        $scope.modalInstance.result.then(function() {
            RaceService.update($scope.race._id, {
              fields: {
                "type": $scope.race.type,
                "distanceType": $scope.race.distanceType
              }
            }).then(
              function() {
                $scope.edit = false;
                $scope.routesViewModel = RouteService.createRoutesViewModel($scope.race, RouteHelperService.getChartConfig($scope), RouteHelperService.getGmapsConfig());
                $scope.selection = $scope.routesViewModel[0].getType() + 0;
                AlertService.add("success", gettextCatalog.getString("Votre manifestation a bien été mise à jour"), 3000);
              });
          },
          function() {
            angular.copy($scope.tmpRace, $scope.race);
          });
      }
    };

  });