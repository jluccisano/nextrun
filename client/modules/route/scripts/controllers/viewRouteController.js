"use strict";

angular.module("nextrunApp.route").controller("ViewRouteController",
    function(
        $scope,
        $stateParams,
        $modal,
        $state,
        RouteBuilderService,
        RouteService,
        RouteUtilsService,
        RouteHelperService,
        MetaService,
        AuthService) {

        $scope.isCollapsed = false;


        $scope.status = {
            isopen: false
        };

        $scope.cursorMarker = {
            id: 1
        };

        $scope.route = undefined;
        $scope.routeViewModel = {};

        $scope.init = function() {

            $scope.routeId = $stateParams.id;

            if ($scope.routeId) {
                RouteService.retrieve($scope.routeId).then(function(response) {
                    $scope.route = response.data;
                    $scope.createRoute();
                    $scope.isCollapsed = true;
                }).
                finally(function() {
                    MetaService.ready("Voir un parcours");
                });
            } else {
                $scope.createRoute();
            }
        };

        $scope.isLoggedIn = function() {
            return AuthService.isLoggedIn();
        };

        $scope.createRoute = function() {
            $scope.routeViewModel = RouteBuilderService.createRouteViewModel($scope.route, RouteHelperService.getChartConfig($scope, 180), RouteHelperService.getGmapsConfig(), false);
            $scope.routeViewModel.setCenter(RouteUtilsService.getCenter($scope.race));
            $scope.routeViewModel.setVisible(true);
        };

        $scope.createNewWorkout = function() {
            $state.go("newWorkoutRoute", {
                "routeId": $scope.routeViewModel.getId()
            });

        };

        $scope.init();
    });