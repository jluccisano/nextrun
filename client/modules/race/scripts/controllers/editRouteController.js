"use strict";

angular.module("nextrunApp.race").controller("EditRouteController",
    function(
        $scope,
        $modalInstance,
        $timeout,
        RouteService,
        GpxService,
        FileReaderService,
        routeDataModel,
        race,
        RouteUtilsService,
        RouteHelperService) {


        $scope.location = {
            details: {},
            name: ""
        };

        $scope.map = {
            options: {
                country: "fr",
                types: "(cities)"
            }
        };

        $scope.cursorMarker = {
            id: 1
        };

        $scope.init = function() {
            $scope.route = new routeBuilder.Route(routeDataModel, RouteHelperService.getChartConfig($scope), RouteHelperService.getGmapsConfig());
            $scope.route.setCenter(RouteUtilsService.getCenter(race));
            $scope.route.addClickListener($scope.onClickMap);
            
            $timeout(function() {
                $scope.route.setVisible(true);
            });


        };

        $scope.onClickMap = function(route, destinationLatlng) {
            RouteService.createNewSegment(route, destinationLatlng);
        };

        $scope.delete = function(route) {
            RouteService.resetRoute(route);
        };

        $scope.undo = function(route) {
            RouteService.deleteLastSegment(route);
        };

        $scope.getFile = function(route, file) {
            FileReaderService.readAsDataUrl(file, $scope).then(function(result) {
                try {
                    route = GpxService.convertGPXtoRoute($scope, route.routeType, result);
                } catch (ex) {
                    AlertService.add("danger", ex.message, 3000);
                } finally {

                }
            });
        };

        $scope.centerToLocation = function(route, details) {
            if (details && details.location) {
                var center = {
                    latitude: details.location.lat,
                    longitude: details.location.lon
                };
                route.setCenter(center);
            }
        };

        $scope.submit = function() {
            $modalInstance.close($scope.route);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };

        $scope.init();
    });