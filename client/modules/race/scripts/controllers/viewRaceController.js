"use strict";

angular.module("nextrunApp.race").controller("ViewRaceController",
    function(
        $scope,
        $location,
        $routeParams,
        $modal,
        $filter,
        RaceService,
        RouteService,
        GpxService,
        MetaService,
        RouteHelperService) {

        $scope.editMode = false;

        google.maps.visualRefresh = true;

        $scope.active = "general";

        $scope.raceId = $routeParams.raceId;
        $scope.cursorMarker = {};
        $scope.navType = "pills";

        $scope.routesViewModel = [];

        $scope.status = {
            open: true
        };

        //TODO create directive
        $scope.onChangeOrganisationTab = function() {
            $scope.isVisible = true;
        };

        $scope.init = function() {


            RaceService.retrieve($scope.raceId).then(function(response) {

                $scope.race = response.data.race;

                $scope.routesViewModel = RouteService.createRoutesViewModel($scope.race, RouteHelperService.getChartConfig($scope), RouteHelperService.getGmapsConfig());

                $scope.selection = $scope.routesViewModel[0].getType() + 0;

            }).finally(function() {
                MetaService.ready($scope.race.name, $location.path(), $scope.generateRaceDescription());
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