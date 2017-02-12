"use strict";

angular.module("nextrunApp.race").directive("nrAddress", function() {
  return {
    restrict: "E",
    templateUrl: "/partials/race/address",
    controller: "AddressController",
    scope: {
      editMode: "=editMode",
      race: "=race"
    }
  };
});

angular.module("nextrunApp.race").controller("AddressController", function($scope, RaceService, gettextCatalog, notificationService) {

  $scope.edit = false;
  $scope.tmpRace = {};

  $scope.mapOptions = {
    zoom: 12
  };

  $scope.options = {
    country: "fr",
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

  $scope.$watch("race", function(newValue) {
    if (newValue) {
      angular.copy(newValue, $scope.tmpRace);

      if (newValue.place && newValue.place.location) {
        $scope.placeMarker.coords = newValue.place.location;
      }
    }
  });

  $scope.cancel = function() {
    $scope.edit = false;
    angular.copy($scope.tmpRace, $scope.race);
  };

  $scope.update = function() {

    RaceService.update($scope.race._id, {
      fields: {
        "place": $scope.race.place
      }
    }).then(
      function() {
        $scope.placeMarker.coords = $scope.race.place.location;
        $scope.edit = false;
        notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
      });
  };
});