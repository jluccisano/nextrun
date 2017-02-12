"use strict";

angular.module("nextrunApp.race").directive("nrType", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/type",
    controller: "TypeController",
    scope: {
      editMode: "=editMode",
      race: "=race"
    }
  };
});

angular.module("nextrunApp.race").controller("TypeController",
  function($scope, $modal, RaceService, gettextCatalog, notificationService, RaceTypeEnum, RouteHelperService, RouteService) {

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
        notificationService.notify({
          title: gettextCatalog.getString("Confirmation Requise"),
          text: gettextCatalog.getString("Etes-vous sûr de vouloir changer de type de manifestation, les parcours en cours seront réinitialisés ?"),
          hide: false,
          confirm: {
            confirm: true
          },
          buttons: {
            closer: false,
            sticker: false
          },
          history: {
            history: false
          }
        }).get().on('pnotify.confirm', function() {
          RaceService.update($scope.race._id, {
            fields: {
              "type": $scope.race.type,
              "distanceType": $scope.race.distanceType
            }
          }).then(
            function() {
              $scope.edit = false;
              $scope.race.routes = [];
              $scope.routesViewModel = RouteService.createRoutesViewModel($scope.race, RouteHelperService.getChartConfig($scope), RouteHelperService.getGmapsConfig());
              $scope.selection = $scope.routesViewModel[0].getType() + 0;
              notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
            });
        }).on('pnotify.cancel', function() {
          angular.copy($scope.tmpRace, $scope.race);
        });
      }
    };

  });