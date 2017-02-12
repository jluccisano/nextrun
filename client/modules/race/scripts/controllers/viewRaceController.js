"use strict";

angular.module("nextrunApp.race").controller("ViewRaceController",
    function(
        $rootScope,
        $scope,
        $location,
        $routeParams,
        $modal,
        $filter,
        RaceService,
        RouteService,
        MetaService) {

        google.maps.visualRefresh = true;

        $scope.loading = false;
        $scope.raceId = $routeParams.raceId;
        $scope.cursorMarker = {};
        $scope.navType = "pills";

        $scope.routesViewModel = [];

        //TODO create directive
        $scope.onChangeTab = function(route) {
            route.isVisible = true;
        };

        //TODO create directive
        $scope.onChangeOrganisationTab = function() {
            $scope.isVisible = true;
        };

        $scope.init = function() {

            $scope.loading = true;

            RaceService.retrieve($scope.raceId).then(function(response) {

                $scope.race = response.race;

                $scope.routesViewModel = RouteService.createRoutesViewModel($scope, $scope.race);

            }).finally(function() {
                MetaService.ready($scope.race.name, $location.path(), $scope.generateRaceDescription());
                $scope.loading = false;
            });
        };

        //TODO create directive
        $scope.generateRaceDescription = function() {
            return $scope.race.name + " , date: " + $filter("date")($scope.race.date, "dd MMMM yyyy") + " , type: " + $scope.race.type.i18n + " , distance: " + $scope.race.distanceType.name;
        };

        $scope.openFeedbackModal = function(raceId) {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/feedbackModal",
                controller: "FeedbackModalController",
                resolve: {
                    raceId: function() {
                        return raceId;
                    }
                }
            });
        };

        $scope.init();
    });