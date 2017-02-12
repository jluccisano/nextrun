"use strict";

angular.module("nextrunApp.route").controller("EditRouteController",
    function(
        $scope,
        $modalInstance,
        $timeout,
        $stateParams,
        RouteBuilderService,
        RouteService,
        GpxService,
        FileReaderService,
        routeDataModel,
        race,
        RouteUtilsService,
        RouteHelperService,
        notificationService,
        routeId) {

        $scope.location = {
            details: {},
            name: ""
        };

        $scope.modeManu = false;

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

            $timeout(function() {
                $scope.routeViewModel.setVisible(true);
            });
        };

        $scope.onClickMap = function(routeViewModel, destinationLatlng) {
            RouteBuilderService.createNewSegment(routeViewModel, destinationLatlng, $scope.modeManu);
        };

        $scope.delete = function(routeViewModel) {
            RouteBuilderService.resetRoute(routeViewModel);
        };

        $scope.undo = function(routeViewModel) {
            RouteBuilderService.deleteLastSegment(routeViewModel);
        };

        /*$scope.getFile = function(routeViewModel, file) {
            FileReaderService.readAsDataUrl(file, $scope).then(function(result) {
                try {
                    routeViewModel = GpxService.convertGPXtoRoute($scope, routeViewModel.getType(), result);
                } catch (ex) {
                    notificationService.error(ex.message);
                } finally {

                }
            });
        };*/

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