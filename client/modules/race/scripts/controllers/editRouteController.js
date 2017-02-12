"use strict";

angular.module("nextrunApp.race").controller("EditRouteController",
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
        notificationService) {

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
            if ($stateParams.id) {
                RouteService.retrieve($stateParams.id).then(function(response) {
                    $scope.route = response.data.route;
                }).
                finally(function() {
                    MetaService.ready("Editer une parcours");
                });
            } else {
                //create new route
            }

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

        $scope.getFile = function(routeViewModel, file) {
            FileReaderService.readAsDataUrl(file, $scope).then(function(result) {
                try {
                    routeViewModel = GpxService.convertGPXtoRoute($scope, routeViewModel.getType(), result);
                } catch (ex) {
                    notificationService.error(ex.message);
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

        $scope.saveOrUpdate = function(data) {
            RouteService.saveOrUpdate(data).then(
                function() {
                    $scope.init();
                    notificationService.success(gettextCatalog.getString("Votre parcours a bien été mise à jour"));
                });
        };

        $scope.submit = function() {
            $modalInstance.close($scope.routeViewModel.data);

            var fields = {};
            fields["routes.$"] = routeDataModel;

            var query = {};
            query = {
                "routes._id": routeDataModel._id
            };

            $scope.update({
                query: query,
                fields: fields
            });

        };

        $scope.cancel = function() {
            angular.copy($scope.tmpRoute, $scope.routeViewModel.data);
            $modalInstance.dismiss("cancel");
        };

        $scope.init();
    });