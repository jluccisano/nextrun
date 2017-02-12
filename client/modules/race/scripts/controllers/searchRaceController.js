"use strict";

angular.module("nextrunApp.race").controller("SearchRaceController",
    function(
        $scope,
        $rootScope,
        RaceService,
        SharedCriteriaService,
        DepartmentEnum,
        RegionEnum,
        RaceTypeEnum,
        MetaService,
        gettextCatalog,
        RouteHelperService,
        RouteBuilderService,
        mapOptions,
        dateRanges) {

        $scope.distanceSelection = {};

        $scope.criteria = {};

        $rootScope.$on("handleCriteriaBroadcast", function(evt, criteria){
            if (criteria) {
                $scope.criteria = criteria;
            } else {
                $scope.criteria = {
                    radius: 60,
                    dateRange: $scope.dateRanges[0]
                };
            }
            $scope.search();
        });

        $scope.setRange = function(index) {
            $scope.active = index;
            $scope.criteria.dateRange = $scope.dateRanges[index];
            $scope.search();
        };

        $scope.dateRanges = angular.copy(dateRanges.getValues());

        $scope.listOfTypes = RaceTypeEnum.getValues();
        $scope.active = 0;

        $scope.autocomplete = {
            options: {
                country: "fr",
                types: "(regions)"
            }
        };

        $scope.map = angular.copy(mapOptions);

        $scope.$watch("criteria.location", function(newValue, oldValue) {

            if (newValue === oldValue) {
                return;
            }

            $scope.search();

        }, true);

        $scope.onChangeType = function() {
            $scope.distanceSelection = {};
            $scope.search();
        };

        $scope.onChangeDistance = function() {
            $scope.criteria.distances = [];
            angular.forEach($scope.distanceSelection, function(value, distance) {
                if ($scope.distanceSelection[distance] === true) {
                    $scope.criteria.distances.push(distance);
                }
            });
            $scope.search();
        };

        $scope.search = function() {
            RaceService.search($scope.criteria).then(function(response) {
                if (response.data.items.length > 0) {
                    $scope.emptyResults = false;
                    $scope.map.markers = RouteBuilderService.convertRacesLocationToMarkers(response.data.items);
                    angular.forEach($scope.map.markers, function(marker) {
                        marker.closeClick = function() {
                            marker.showWindow = false;
                            $scope.$apply();
                        };
                        marker.onClicked = function() {
                            $scope.onMarkerClicked(marker);
                        };
                    });

                } else {
                    $scope.emptyResults = true;
                    $scope.map.markers = [];
                }
            }).
            finally(function() {
                MetaService.ready("Manifestations");
            });

        };

        $scope.onMarkerClicked = function(marker) {
            marker.showWindow = true;
            $scope.$apply();
        };

        $scope.search();
    });