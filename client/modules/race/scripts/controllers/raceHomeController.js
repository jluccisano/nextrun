"use strict";

angular.module("nextrunApp.race").controller("RaceHomeController",
    function(
        $scope,
        $location,
        MetaService) {

        $scope.createNewRace = function() {
            $location.path("/races/create");
        };

        MetaService.ready("title.addRace", $location.path(), "message.addRace.description");
    });