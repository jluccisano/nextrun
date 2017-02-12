"use strict";

angular.module("nextrunApp.race").controller("EditRaceController",
    function(
        $scope,
        $state,
        $modal,
        $filter,
        $q,
        $timeout,
        RaceService,
        notificationService,
        AuthService,
        RaceTypeEnum,
        RouteBuilderService,
        MetaService,
        gettextCatalog,
        GmapsApiService,
        RichTextEditorService,
        RouteUtilsService,
        RouteHelperService,
        raceId,
        RouteService,
        GpxService) {

        $scope.selection = "";

        $scope.isCollapsed = false;
        $scope.isAddRouteMode = true;

        $scope.onChangeRouteMode = function() {
            $scope.isAddRouteMode = !$scope.isAddRouteMode;
        };
        $scope.editMode = true;
        $scope.active = "general";

        $scope.activePanel = 1;
        $scope.gettextCatalog = gettextCatalog;

        $scope.navType = "pills";
        $scope.routesViewModel = [];
        $scope.choices = ["oui", "non"];
        $scope.cursorMarker = {
            id: 1
        };

        $scope.croppedImage = "";
        $scope.myImage = "";

        $scope.currentRaceType = {};

        $scope.raceId = raceId;

        $scope.retrieveRoutes = function() {
            var promises = [];
            $scope.routesViewModel = [];

            angular.forEach($scope.race.routes, function(routeId) {
                promises.push(RouteService.retrieve(routeId));
            });

            $q.all(promises).then(function(routes) {
                angular.forEach(routes, function(response) {
                    if (angular.isObject(response.data) && response.data._id) {
                        var routeViewModel = RouteBuilderService.createRouteViewModel(response.data, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig(), false);
                        routeViewModel.setCenter(RouteUtilsService.getCenter($scope.race));
                        $scope.routesViewModel.push(routeViewModel);
                    }
                });

                if ($scope.routesViewModel.length > 0 && !$scope.selection) {
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

            RouteService.find(AuthService.user.id, 1).then(function(response) {
                $scope.myRoutes = response.data.items;
            });
        };

        $scope.isLoggedIn = function() {
            return AuthService.isLoggedIn();
        };

        $scope.cancel = function() {
            $state.go("myraces");
        };

        $scope.editRichTextEditor = function(model, field) {
            $scope.modalInstance = RichTextEditorService.openRichTextEditorModal(model);

            $scope.modalInstance.result.then(function(data) {
                if (!angular.equals(data, model)) {
                    var params = {};
                    params.fields = {};
                    params.fields[field] = data;
                    $scope.update(params);
                }
            });
        };

        $scope.editRoute = function(routeViewModel) {
            $state.go("editRaceRoute", {
                id: routeViewModel.getId(),
                raceId: $scope.race._id
            });
        };

        $scope.openDeleteConfirmation = function(routeViewModel) {
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
                RaceService.unlinkRoute($scope.raceId, routeViewModel.data._id).then(function() {
                    notificationService.success(gettextCatalog.getString("Le parcours a bien été supprimé"));
                    $scope.init();
                });
            });
        };

        $scope.update = function(data) {
            RaceService.update($scope.raceId, data).then(
                function() {
                    $scope.init();
                    notificationService.success(gettextCatalog.getString("Votre manifestation a bien été mise à jour"));
                });
        };

        $scope.editRegistration = function() {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/templates/editRegistrationModal",
                controller: "EditRegistrationModalController",
                size: "lg",
                backdrop: false,
                resolve: {
                    registration: function() {
                        return $scope.race.registration;
                    }
                }
            });

            $scope.modalInstance.result.then(function(data) {
                if (!angular.equals(data, $scope.race.registration)) {
                    $scope.update({
                        fields: {
                            "registration": data
                        }
                    });
                    $scope.selection = "registration";
                }
            });
        };

        $scope.editSchedule = function() {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/templates/editScheduleModal",
                controller: "EditScheduleModalController",
                size: "lg",
                backdrop: false,
                resolve: {
                    schedule: function() {
                        return $scope.race.schedule;
                    }
                }
            });

            $scope.modalInstance.result.then(function(data) {
                if (!angular.equals(data, $scope.race.schedule)) {
                    $scope.update({
                        fields: {
                            "schedule": data
                        }
                    });
                    $scope.selection = "schedule";
                    $scope.active = "schedule";
                }
            });
        };

        $scope.setSelection = function(route, index) {
            $scope.selection = route.getType() + index;
            $scope.active = route.getType() + index;
            $scope.isCollapsed = true;
        };

        $scope.getFile = function(imageFile) {

            RaceService.uploadImage($scope.race._id, imageFile).then(function() {
                notificationService.success(gettextCatalog.getString("Votre image a bien été mise à jour"));
                $scope.init();
            });
        };

        $scope.initSelection = function(selection) {
            if (selection) {
                $scope.selection = selection;
                $scope.active = selection;
                if (selection !== "general") {
                    $scope.isCollapsed = false;
                } else {
                    $scope.isCollapsed = true;

                }
            } else {
                $scope.selection = undefined;
                $scope.isCollapsed = false;
            }
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

        $scope.addRoute = function(selectedRoute) {
            RaceService.updateRoute($scope.raceId, selectedRoute._id).then(
                function() {
                    notificationService.success(gettextCatalog.getString("Votre parcours a bien été ajouté à votre manifestation"));
                    $state.go("edit", {
                        id: $scope.raceId
                    }, {
                        reload: true
                    });
                });
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