"use strict";

angular.module("nextrunApp.route").controller("EditRouteController",
    function(
        $scope,
        $stateParams,
        $state,
        $previousState,
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
        workout,
        RaceService,
        WorkoutService,
        RouteTypeEnum,
        GmapsApiService,
        $cookieStore) {

        var currentRoute = RouteBuilderService.getCurrentRoute();



        $scope.isCollapsed = true;
        $scope.isLoaded = false;

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
                types: "(cities)"
            }
        };

        $scope.cursorMarker = {
            id: 1
        };

        $scope.$watch("location.details", function(newValue, oldValue) {

            if (newValue === oldValue) {
                return;
            }

            if (newValue && newValue.location) {
                var center = {
                    latitude: newValue.location.latitude,
                    longitude: newValue.location.longitude
                };
                $scope.routeViewModel.setCenter(center);
            }

        }, true);

        $scope.types = RouteTypeEnum;
        $scope.gettextCatalog = gettextCatalog;

        $scope.tmpRoute = {};
        $scope.route = undefined;
        $scope.routeViewModel = {};

        $scope.init = function() {

            if (currentRoute) {
                $scope.route = currentRoute;
                angular.copy($scope.route, $scope.tmpRoute);
                $scope.createRoute();
                $scope.isLoaded = true;
            }

            $scope.routeId = $stateParams.id;

            if (race && race.data) {
                $scope.race = race.data;
            }

            if (workout && workout.data) {
                $scope.workout = workout.data;
            }

            if ($scope.routeId) {
                RouteService.retrieve($scope.routeId).then(function(response) {
                    $scope.route = response.data;
                    angular.copy($scope.route, $scope.tmpRoute);
                    $scope.createRoute();
                    $scope.isLoaded = true;
                }).
                finally(function() {
                    MetaService.ready("Editer un parcours");
                });
            } else {
                $scope.createRoute();
                $scope.isLoaded = true;
            }
        };

        $scope.createRoute = function() {
            $scope.routeViewModel = RouteBuilderService.createRouteViewModel($scope.route, RouteHelperService.getChartConfig($scope, 180), RouteHelperService.getGmapsConfig(), true);
            $scope.routeViewModel.setCenter(RouteUtilsService.getCenter($scope.race));
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

        $scope.getFile = function(file) {

            notificationService.notify({
                title: gettextCatalog.getString("Confirmation requise"),
                text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce parcours ?"),
                hide: false,
                confirm: {
                    confirm: true
                },
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                }
            }).get().on("pnotify.confirm", function() {
                $scope.createRoute();
                GpxService.convertGPXtoRoute($scope.routeViewModel, file);
            });
        };

        $scope.submit = function() {
            if ($scope.routeViewModel.data.segments.length > 0 && $scope.routeViewModel.data.segments[0].points.length > 0) {

                RouteBuilderService.setCurrentRoute($scope.routeViewModel.data);

                var firstPoint = $scope.routeViewModel.data.segments[0].points[0];

                var latlng = GmapsApiService.LatLng(firstPoint.lat, firstPoint.lng);

                GmapsApiService.getPlace(latlng).then(function(result) {
                    $scope.routeViewModel.data.startPlace = result;

                    RouteService.saveOrUpdate($scope.routeViewModel.getData()).then(function(response) {
                        notificationService.success(gettextCatalog.getString("Le parcours a bien été créée"));

                        if ($scope.race) {
                            RaceService.updateRoute($scope.race._id, response.data.id).then(
                                function() {
                                    notificationService.success(gettextCatalog.getString("Votre parcours a bien été ajouté à votre manifestation"));
                                    $state.go("edit", {
                                        id: $scope.race._id
                                    }, {
                                        reload: true
                                    });
                                });
                        } else if ($scope.workout) {
                            WorkoutService.updateRoute($scope.workout._id, response.data.id).then(
                                function() {
                                    notificationService.success(gettextCatalog.getString("Votre parcours a bien été ajouté à votre sortie"));
                                    $state.go("editWorkout", {
                                        id: $scope.workout._id
                                    }, {
                                        reload: true
                                    });
                                });
                        } else {
                            $scope.init();
                        }

                        RouteBuilderService.removeCurrentRoute();

                    });

                });
            }
        };

        $scope.cancel = function() {
            angular.copy($scope.tmpRoute, $scope.routeViewModel.getData());
            $previousState.go("previousState");
        };

        $scope.exportGPX = function(route) {
            var gpx = GpxService.convertRouteToGPX(route, "export");
            var blob = new Blob([gpx], {
                type: "text/xml"
            });
            return blob;
        };

        $scope.init();
    });