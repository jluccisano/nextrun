"use strict";

angular.module("nextrunApp.race").controller("EditRaceController",
    function(
        $scope,
        $state,
        $modal,
        $filter,
        $q,
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
        RouteService) {

        $scope.selection = "";

        $scope.isCollapsed = false;

        $scope.editMode = true;
        $scope.active = "general";

        $scope.activePanel = 1;
        $scope.gettextCatalog = gettextCatalog;

        /** init google maps service **/
        //google.maps.visualRefresh = true;

        $scope.navType = "pills";
        $scope.routesViewModel = [];
        $scope.choices = ["oui", "non"];
        $scope.cursorMarker = {
            id: 1
        };

        $scope.currentRaceType = {};

        $scope.raceId = raceId;

        $scope.retrieveRoutes = function() {
            var promises = [];
            $scope.routesViewModel = [];
            
            angular.forEach($scope.race.routes, function(routeId) {
                promises.push(RouteService.retrieve(routeId));
            });

            $q.all(promises).then(function(routes){
                angular.forEach(routes, function(response){
                    $scope.routesViewModel.push(RouteBuilderService.createRouteViewModel(response.data, RouteHelperService.getChartConfig($scope, 250), RouteHelperService.getGmapsConfig()), false);
                });
                $scope.selection = $scope.routesViewModel[0].getType() + 0;
                $scope.routesViewModel[0].setVisible(true);
            });
        }

        $scope.init = function() {
            RaceService.retrieve($scope.raceId).then(function(response) {
                $scope.race = response.data;
                $scope.retrieveRoutes();
            }).finally(function() {
                MetaService.ready($scope.race.name, $scope.generateRaceDescription());
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
            }).get().on('pnotify.confirm', function() {
                RouteService.delete(routeViewModel.data._id).then(function() {
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

        $scope.init();
    });