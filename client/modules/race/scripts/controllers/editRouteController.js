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
        RouteHelperService,
        AlertService) {

        $scope.polylines;

        $scope.location = {
            details: {},
            name: ""
        };

        $scope.status = {
            isopen: false
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

        $scope.tmpRoute = {};
        $scope.route = {};
        $scope.routeViewModel = {};

        $scope.init = function() {
            $scope.route = routeDataModel;

            angular.copy(routeDataModel, $scope.tmpRoute);

            $scope.routeViewModel = new routeBuilder.Route($scope.route, RouteHelperService.getChartConfig($scope, 150), RouteHelperService.getGmapsConfig());
            $scope.routeViewModel.setCenter(RouteUtilsService.getCenter(race));
            $scope.routeViewModel.addClickListener($scope.onClickMap);

            $scope.polylines = $scope.routeViewModel.getPolylines();

            $timeout(function() {
                $scope.routeViewModel.setVisible(true);
            });

        };

        $scope.onClickMap = function(routeViewModel, destinationLatlng) {
            RouteService.createNewSegment(routeViewModel, destinationLatlng);
            $scope.polylines.length = 0;
            $scope.polylines = routeViewModel.getPolylines();
        };

        $scope.delete = function(routeViewModel) {
            RouteService.resetRoute(routeViewModel);

            $scope.polylines = routeViewModel.getPolylines();
        };

        $scope.undo = function(routeViewModel) {
            RouteService.deleteLastSegment(routeViewModel);
            $scope.polylines.length = 0;
            $scope.polylines = routeViewModel.getPolylines();
        };

        $scope.getFile = function(routeViewModel, file) {
            FileReaderService.readAsDataUrl(file, $scope).then(function(result) {
                try {
                    routeViewModel = GpxService.convertGPXtoRoute($scope, routeViewModel.getType(), result);
                } catch (ex) {
                    AlertService.add("danger", ex.message, 3000);
                } finally {

                }
            });
        };

        $scope.centerToLocation = function(routeViewModel, details) {
            if (details && details.location) {
                var center = {
                    latitude: details.location.latitude,
                    longitude: details.location.longitude
                };
                routeViewModel.setCenter(center);
            }
        };

        $scope.submit = function() {
            $modalInstance.close($scope.routeViewModel.data);
        };

        $scope.cancel = function() {
            angular.copy($scope.tmpRoute, $scope.routeViewModel.data);
            $modalInstance.dismiss("cancel");
        };

        $scope.init();
    });