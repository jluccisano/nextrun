"use strict";

angular.module("nextrunApp.race").controller("RaceHomeController",
    function(
        $scope,
        $state,
        MetaService) {

        $scope.createNewRace = function() {
            $state.go("create");
        };

        MetaService.ready("Ajouter une manifesation");
    });