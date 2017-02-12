"use strict";

angular.module("nextrunApp.route").controller("EditRouteController",
    function(
        $scope,
        $timeout,
        $stateParams,
        RouteBuilderService,
        RouteService,
        GpxService,
        FileReaderService,
        RouteUtilsService,
        RouteHelperService,
        MetaService,
        notificationService,
        gettextCatalog) {

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
        $scope.route;
        $scope.routeViewModel = {};

        $scope.init = function() {

            $scope.routeId = $stateParams.id;

            if ($scope.routeId) {
                RouteService.retrieve($scope.routeId).then(function(response) {

                    $scope.route = response.data;

                    angular.copy($scope.route, $scope.tmpRoute);

                    $scope.routeViewModel = RouteBuilderService.createRouteViewModel($scope.route, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig());
                    $scope.routeViewModel.addClickListener($scope.onClickMap);
                }).
                finally(function() {
                    MetaService.ready("Editer un parcours");
                });
            } else {
                $scope.routeViewModel = RouteBuilderService.createRouteViewModel($scope.route, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig());
                $scope.routeViewModel.addClickListener($scope.onClickMap);
            }


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

            var data = {
                route: $scope.routeViewModel.data
            };

            RouteService.saveOrUpdate(data).then(function(response) {
                notificationService.success(gettextCatalog.getString("Le parcours a bien été créée"));
            });

            /*var fields = {};
            fields["routes.$"] = routeDataModel;

            var query = {};
            query = {
                "routes._id": routeDataModel._id
            };

            $scope.update({
                query: query,
                fields: fields
            });*/
        };

        $scope.cancel = function() {
            angular.copy($scope.tmpRoute, $scope.routeViewModel.data);
        };

        $scope.init();
    });