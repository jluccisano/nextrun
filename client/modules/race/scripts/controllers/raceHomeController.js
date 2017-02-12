"use strict";

angular.module("nextrunApp.race").controller("RaceHomeController",
    function(
        $scope,
        $location,
        MetaService,
        gettextCatalog) {

        $scope.createNewRace = function() {
            $location.path("/races/create");
        };

        MetaService.ready(gettextCatalog.getString("Ajouter une manifesation"), $location.path(), gettextCatalog.getString("Ajouter une manifesation"));
    });