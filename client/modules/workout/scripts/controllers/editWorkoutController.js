"use strict";

angular.module("nextrunApp.workout").controller("EditWorkoutController",
    function(
        $scope,
        $state,
        $modal,
        $filter,
        $q,
        $timeout,
        $stateParams,
        WorkoutService,
        notificationService,
        AuthService,
        RouteBuilderService,
        MetaService,
        gettextCatalog,
        GmapsApiService,
        RichTextEditorService,
        RouteUtilsService,
        RouteHelperService,
        workoutId,
        RouteService,
        GpxService) {

        $scope.selection = "";

        $scope.isCollapsed = false;
        $scope.isAddRouteMode = true;

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

        $scope.workoutId = workoutId;

        $scope.retrieveRoutes = function() {
            var promises = [];
            $scope.routesViewModel = [];

            if ($scope.workout.routeId) {
                promises.push(RouteService.retrieve($scope.workout.routeId));
            }

            $q.all(promises).then(function(routes) {
                angular.forEach(routes, function(response) {
                    if (angular.isObject(response.data) && response.data._id) {
                        var routeViewModel = RouteBuilderService.createRouteViewModel(response.data, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig(), false);
                        routeViewModel.setCenter(RouteUtilsService.getCenter($scope.workout));
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

            $scope.initSelection($stateParams.selection);

            WorkoutService.retrieve($scope.workoutId).then(function(response) {
                $scope.workout = response.data;
                $scope.retrieveRoutes();
            }).
            finally(function() {
                MetaService.ready($scope.workout.name, $scope.generateWorkoutDescription());
            });

            RouteService.find(AuthService.user.id, 1).then(function(response) {
                $scope.myRoutes = response.data.items;
            });
        };

        $scope.isLoggedIn = function() {
            return AuthService.isLoggedIn();
        };

        $scope.cancel = function() {
            $state.go("myworkouts");
        };


        $scope.editRoute = function(routeViewModel) {
            $state.go("editWorkoutRoute", {
                id: routeViewModel.getId(),
                workoutId: $scope.workout._id
            });
        };

        $scope.openDeleteConfirmation = function(routeViewModel) {
            notificationService.notify({
                title: gettextCatalog.getString("Confirmation requise"),
                text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce sortie ?"),
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
                WorkoutService.unlinkRoute($scope.workoutId, routeViewModel.data._id).then(function() {
                    notificationService.success(gettextCatalog.getString("Le sortie a bien été retiré de votre sortie"));
                    $state.go("editWorkout", {
                        id: $scope.workoutId
                    }, { reload: true });
                });
            });
        };

        $scope.update = function(data) {
            WorkoutService.update($scope.workoutId, data).then(
                function() {
                    notificationService.success(gettextCatalog.getString("Votre parcours a bien été mise à jour"));
                    $state.go("editWorkoutWithSelection", {
                        id: $scope.workoutId,
                        selection: "general"
                    }, { reload: true });
                });
        };

        $scope.initSelection = function(selection) {
            if (selection) {
                $scope.selection = selection;
                $scope.active = selection;
                $scope.isCollapsed = true;
            } else {
                $scope.selection = undefined;
                $scope.isCollapsed = false;
            }
        }

        $scope.setSelection = function(route, index) {
            $scope.selection = route.getType() + index;
            $scope.active = route.getType() + index;
            $scope.isCollapsed = true;
        };

        $scope.addNewParticipant = function(newParticipant) {
            WorkoutService.addParticipant($scope.workoutId, newParticipant).then(
                function() {
                    notificationService.success(gettextCatalog.getString("Un nouveau participant a été ajouté"));
                    $state.go("editWorkoutWithSelection", {
                        id: $scope.workoutId,
                        selection: "participants"
                    }, { reload: true });
                });
        };

        $scope.addRoute = function(selectedRoute) {
            WorkoutService.updateRoute($scope.workoutId, selectedRoute._id).then(
                function() {
                    notificationService.success(gettextCatalog.getString("Votre parcours a bien été ajouté à votre sortie"));
                    $state.go("editWorkout", {
                        id: $scope.workoutId
                    }, { reload: true });
                });
        };

        $scope.openDeleteParticipantConfirmation = function(participant) {
            notificationService.notify({
                title: gettextCatalog.getString("Confirmation requise"),
                text: gettextCatalog.getString("Etes-vous sûr de vouloir supprimer ce participant ?"),
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
                WorkoutService.deleteParticipant($scope.workoutId, participant).then(
                    function() {
                        notificationService.success(gettextCatalog.getString("Un participant a été supprimé"));
                        $state.go("editWorkoutWithSelection", {
                            id: $scope.workoutId,
                            selection: "participants"
                        }, { reload: true });
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