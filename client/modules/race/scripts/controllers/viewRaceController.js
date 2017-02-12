"use strict";

angular.module("nextrunApp.race").controller("ViewRaceController",
    function(
        $rootScope,
        $scope,
        $location,
        $routeParams,
        $modal,
        $filter,
        RaceTypeEnum,
        RaceService,
        AlertService,
        RouteHelperService,
        MetaService) {

        google.maps.visualRefresh = true;

        $scope.loading = false;
        $scope.raceId = $routeParams.raceId;
        $scope.cursorMarker = {};
        $scope.navType = "pills";

        //TODO create directive
        $scope.onChangeTab = function(route) {
            route.isVisible = true;
        };

        //TODO create directive
        $scope.onChangeOrganisationTab = function() {
            $scope.isVisible = true;
        };

        $scope.init = function() {

            $scope.loading = true;

            RaceService.retrieve($scope.raceId).then(function(response) {

                $scope.race = response.race;

                //TODO create services
                var raceType = RaceTypeEnum.getRaceTypeByName($scope.race.type.name);

                _.each(raceType.routes, function(routeType, index) {

                    var currentRoute = $scope.race.routes[index];

                    var route = RouteHelperService.generateRoute($scope, currentRoute, routeType);

                    $scope.race.routes[index] = route;

                });

                $scope.race.routes[0].isVisible = true;

                $scope.isVisible = false;

                $scope.options = {
                    map: {
                        center: new google.maps.LatLng($scope.race.plan.address.latlng.lat, $scope.race.plan.address.latlng.lng),
                        zoom: 6,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                };

                if (!_.isUndefined($scope.race.plan) && !_.isUndefined($scope.race.plan.address) && !_.isUndefined($scope.race.plan.address.latlng) && !_.isUndefined($scope.race.plan.address.latlng.lat) && !_.isUndefined($scope.race.plan.address.latlng.lon)) {
                    $scope.addressMarkers = [{
                        id: 0,
                        location: {
                            lat: $scope.race.plan.address.latlng.lat,
                            lng: $scope.race.plan.address.latlng.lng
                        }

                    }];
                }

                //TODO create service
                $scope.loading = false;

                MetaService.ready($scope.race.name, $location.path(), $scope.generateRaceDescription());

            }).then(function() {
                $scope.loading = false;
            });
        };

        //TODO create directive
        $scope.generateRaceDescription = function() {
            return $scope.race.name + " , date: " + $filter("amDateFormat")($scope.race.date, "DD MMMM YYYY") + " , type: " + $scope.race.type.i18n + " , distance: " + $scope.race.distanceType.name;
        };

        $scope.openFeedbackModal = function(raceId) {
            $scope.modalInstance = $modal.open({
                templateUrl: "partials/race/feedback",
                controller: "FeedbackModalController",
                resolve: {
                    raceId: function() {
                        return raceId;
                    }
                }
            });
        };

        $scope.init();
    });