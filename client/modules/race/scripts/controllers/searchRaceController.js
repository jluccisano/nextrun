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
        RouteService,
        mapOptions,
        dateRanges,
        RouteTypeEnum) {

        $scope.distanceSelection = {};

        $scope.types = RouteTypeEnum;

        $scope.isFiltered = false;
        $scope.isCollapsed = true;

        $scope.gettextCatalog = gettextCatalog;

        $rootScope.$on("handleCriteriaBroadcast", function(evt, criteria, type) {
            if (criteria) {
                $scope.criteria = criteria;
            }
            if (type) {
                $scope.searchType.raceType = type;
            }
            $scope.search();
        });

        $scope.dateRanges = angular.copy(dateRanges.getValues());

        $scope.radius = [{
            value: 30,
            label: "30km"
        }, {
            value: 60,
            label: "60km"
        }, {
            value: 120,
            label: "120km"
        }];

        $scope.raceTypes = [{
            value: "official",
            label: "Epreuves officielles"
        }, {
            value: "routes",
            label: "Parcours partagés"
        }];

        $scope.searchType = {
            raceType: "official"
        };

        $scope.listOfTypes = RaceTypeEnum.getValues();

        $scope.autocomplete = {
            options: {
                types: "(regions)"
            }
        };

        $scope.map = angular.copy(mapOptions);

        $scope.onChangeType = function() {
            $scope.distanceSelection = {};
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

        $scope.setRange = function(index) {
            $scope.active = index;
            $scope.criteria.dateRange = $scope.dateRanges[index];
            $scope.search();
        };

        $scope.submit = function() {
            $scope.criteria.dateRange = {};
            $scope.criteria.distances = [];
            $scope.search();
        };

        $scope.search = function() {
            if ($scope.criteria) {

                if ($scope.searchType.raceType === "official") {
                    RaceService.search($scope.criteria).then(function(response) {
                        if (response.data.items.length > 0) {
                            $scope.isFiltered = true;
                            $scope.emptyResults = false;
                            $scope.map.markers = RouteBuilderService.convertRacesLocationToMarkers(response.data.items);
                            angular.forEach($scope.map.markers, function(marker) {
                                marker.showWindow = false;
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
                        MetaService.ready("Rechercher", "Cherchez un parcours ou une épreuve officielle");
                    });
                } else {
                    RouteService.search($scope.criteria).then(function(response) {
                        if (response.data.items.length > 0) {
                            $scope.isFiltered = false;
                            $scope.emptyResults = false;
                            $scope.map.markers = RouteBuilderService.convertRoutesLocationToMarkers(response.data.items);
                            angular.forEach($scope.map.markers, function(marker) {
                                marker.showWindow = false;
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
                        MetaService.ready("Rechercher", "Cherchez un parcours ou une épreuve officielle");
                    });
                }
            }
        };

        $scope.onMarkerClicked = function(marker) {
            marker.showWindow = true;
            $scope.$apply();
        };
    });