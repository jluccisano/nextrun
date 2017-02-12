"use strict";

angular.module("nextrunApp.race").controller("ViewRaceController",
    function(
        $scope,
        $modal,
        $filter,
        RaceService,
        RouteBuilderService,
        RouteService,
        GpxService,
        MetaService,
        RouteHelperService,
        raceId) {

        $scope.editMode = false;

        $scope.isCollapsed = false;

        $scope.active = "general";
        $scope.raceId = raceId;
        $scope.cursorMarker = {};
        $scope.routesViewModel = [];

        $scope.init = function() {
            RaceService.retrieve($scope.raceId).then(function(response) {
                $scope.race = response.data;
                $scope.routesViewModel = RouteBuilderService.createRoutesViewModel($scope.race, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig());
                $scope.selection = $scope.routesViewModel[0].getType() + 0;
            }).finally(function() {
                MetaService.ready($scope.race.name, $scope.generateRaceDescription());
            });
        };

        $scope.generateRaceDescription = function() {
            return $scope.race.name + " , date: " + $filter("date")($scope.race.date, "dd MMMM yyyy") + " , type: " + $scope.race.type.i18n + " , distance: " + $scope.race.distanceType.name;
        };

        $scope.openFeedbackModal = function(raceId) {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/templates/feedbackModal",
                controller: "FeedbackModalController",
                resolve: {
                    raceId: function() {
                        return raceId;
                    }
                }
            });
        };

        $scope.exportGPX = function(route) {
            var gpx = GpxService.convertRouteToGPX(route, "export");
            var blob = new Blob([gpx], {
                type: "text/xml"
            });
            return blob;
        };

        $scope.setSelection = function(route, index) {
            $scope.selection = route.getType() + index;
            $scope.active = route.getType() + index;
        };

        $scope.init();
    });