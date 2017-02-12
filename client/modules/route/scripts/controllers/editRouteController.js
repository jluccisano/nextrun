"use strict";

angular.module("nextrunApp.route").controller("EditRouteController",
    function(
        $scope,
        $stateParams,
        $state,
        RouteBuilderService,
        RouteService,
        GpxService,
        FileReaderService,
        RouteUtilsService,
        RouteHelperService,
        MetaService,
        notificationService,
        gettextCatalog,
        race,
        RaceService,
        AuthService,
        RouteTypeEnum) {

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

        $scope.types = RouteTypeEnum;
        $scope.gettextCatalog = gettextCatalog;

        $scope.tmpRoute = {};
        $scope.route = undefined;
        $scope.routeViewModel = {};

        $scope.init = function() {

            $scope.routeId = $stateParams.id;

            $scope.race = race.data;

            if ($scope.routeId) {
                RouteService.retrieve($scope.routeId).then(function(response) {
                    $scope.route = response.data;
                    angular.copy($scope.route, $scope.tmpRoute);
                    $scope.createRoute();
                }).
                finally(function() {
                    MetaService.ready("Editer un parcours");
                });
            } else {
                $scope.createRoute();
            }
        };

        $scope.createRoute = function() {
            $scope.routeViewModel = RouteBuilderService.createRouteViewModel($scope.route, RouteHelperService.getChartConfig($scope, 180), RouteHelperService.getGmapsConfig(), true);
            $scope.routeViewModel.addClickListener($scope.onClickMap);
            $scope.routeViewModel.setVisible(true);
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

        $scope.onChange = function(type) {
            if (type === "Natation") {
                $scope.modeManu = true;
            } else {
                $scope.modeManu = false;
            }
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
            RouteService.saveOrUpdate($scope.routeViewModel.getData()).then(function(response) {
                notificationService.success(gettextCatalog.getString("Le parcours a bien été créée"));
                $scope.init();

                if ($scope.race) {
                    RaceService.updateRoute($scope.race._id, response.data.id).then(
                        function() {
                            notificationService.success(gettextCatalog.getString("Votre parcours a bien été ajouté à votre manifestation"));
                            $state.go("edit", {
                                id: $scope.race._id
                            });
                        });
                }

            });
        };

        $scope.cancel = function() {
            angular.copy($scope.tmpRoute, $scope.routeViewModel.getData());
        };

        $scope.init();
    });