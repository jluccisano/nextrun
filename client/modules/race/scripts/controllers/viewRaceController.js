"use strict";

angular.module("nextrunApp.race").controller("ViewRaceController",
    function(
        $rootScope,
        $scope,
        $location,
        $routeParams,
        $modal,
        $filter,
        $anchorScroll,
        RaceService,
        RouteService,
        GpxService,
        MetaService,
        RouteHelperService) {

        google.maps.visualRefresh = true;

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

        $scope.scrolltoHref = function(id) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(id);
            // call $anchorScroll()
            $anchorScroll();
        };

        $scope.init();
    });