"use strict";

angular.module("nextrunApp.race").controller("DeleteConfirmationModalController",
    function(
        $scope,
        $modalInstance,
        AlertService,
        RaceService,
        race,
        gettextCatalog) {

        $scope.race = race;

        $scope.deleteRace = function() {
            RaceService.delete($scope.race._id).then(
                function() {
                    AlertService.add("success", gettextCatalog.getString("La manifestation a bien été supprimée"), 3000);
                    $modalInstance.close();
                });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

    });