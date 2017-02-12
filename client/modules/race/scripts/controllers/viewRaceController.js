"use strict";

angular.module("nextrunApp.race").controller("ViewRaceController",
    function(
        $scope,
        $modal,
        $filter,
        $q,
        $base64,
        RaceService,
        RouteBuilderService,
        RouteService,
        GpxService,
        MetaService,
        RouteUtilsService,
        RouteHelperService,
        raceId) {

        $scope.editMode = false;

        $scope.isCollapsed = false;

        $scope.active = "general";
        $scope.raceId = raceId;
        $scope.cursorMarker = {};
        $scope.routesViewModel = [];


        $scope.retrieveRoutes = function() {
            var promises = [];
            angular.forEach($scope.race.routes, function(routeId) {
                promises.push(RouteService.retrieve(routeId));
            });

            $q.all(promises).then(function(routes) {
                angular.forEach(routes, function(response) {
                    var routeViewModel = RouteBuilderService.createRouteViewModel(response.data, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig(), false);
                    routeViewModel.setCenter(RouteUtilsService.getCenter($scope.race));
                    $scope.routesViewModel.push(routeViewModel);
                });

                if ($scope.routesViewModel.length > 0) {
                    $scope.selection = $scope.routesViewModel[0].getType() + 0;
                    $scope.routesViewModel[0].setVisible(true);
                }
            });
        };

        $scope.init = function() {
            RaceService.retrieve($scope.raceId).then(function(response) {
                $scope.race = response.data;
                $scope.retrieveRoutes();

                RaceService.download($scope.race._id).then(function(response) {
                    $scope.image = response.data;
                });

            }).
            finally(function() {
                MetaService.ready($scope.race.name, $scope.generateRaceDescription());
            });
        };

        $scope.showImage = function() {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/templates/lightBoxModal",
                controller: "LightBoxModalController",
                size: "lg",
                resolve: {
                    image: function() {
                        return $scope.image;
                    }
                }
            });
        };

        $scope.generateRaceDescription = function() {
            return $scope.race.name + " , date: " + $filter("date")($scope.race.date, "dd MMMM yyyy") + " , type: " + $scope.race.type.i18n + " , distance: " + $scope.race.distanceType.name;
        };

        $scope.openFeedbackModal = function() {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/templates/feedbackModal",
                controller: "FeedbackModalController",
                resolve: {
                    raceId: function() {
                        return $scope.raceId;
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
            $scope.isCollapsed = true;
        };

        $scope.openLightboxModal = function($index) {
            Lightbox.openModal($scope.images, $index);
        };

        $scope.downloadResult = function(result) {
            RaceService.downloadResult($scope.race._id, result._id).then(function(response) {
                var base64EncodedString = decodeURIComponent(response.data);
                var decodedString = $base64.decode(base64EncodedString);
                var blob = new Blob([decodedString], {
                    type: "text/pdf"
                });
                return blob;
            });
        };

        $scope.init();
    });