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
        RouteService) {

        $scope.selection = "";

        $scope.isCollapsed = false;

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

                if ($scope.routesViewModel.length > 0) {
                    //$scope.selection = $scope.routesViewModel[0].getType() + 0;
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
                RouteService.delete(routeViewModel.data._id).then(function() {
                    notificationService.success(gettextCatalog.getString("Le sortie a bien été supprimée"));
                    $state.go("editWorkoutWithSelection", {
                        id: $scope.workoutId,
                        selection: "general"
                    });
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
                    });
                });
        };

        $scope.initSelection = function(selection) {
            if (selection) {
                $scope.selection = selection;
                $scope.active = selection;
                if (selection !== "general") {
                    $scope.isCollapsed = true;
                } else {
                    $scope.isCollapsed = true;

                }
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
                    });
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
                        });
                    });
            });
        };

        $scope.init();
    });