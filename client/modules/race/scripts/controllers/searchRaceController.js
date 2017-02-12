"use strict";

angular.module("nextrunApp.race").controller("SearchRaceController",
    function(
        $scope,
        RaceService,
        SharedCriteriaService,
        DepartmentEnum,
        RegionEnum,
        RaceTypeEnum,
        MetaService,
        gettextCatalog,
        RouteHelperService,
        RouteBuilderService,
        underscore,
        mapOptions
        dateRanges) {

        $scope.setRange = function(index) {
            $scope.active = index;
            $scope.criteria.dateRange = $scope.dateRanges[index];
            $scope.search();
        };
        
        $scope.dateRanges = angular.copy(dateRanges);

        $scope.criteria = {
            radius: 60,
            dateRange: $scope.dateRanges[0],
        };

        $scope.listOfTypes = RaceTypeEnum.getValues();
        $scope.active = 0;

        $scope.location = {
            details: {},
            name: ""
        };

        $scope.autocomplete = {
            options: {
                country: "fr",
                types: "(regions)"
            }
        };

        $scope.map = angular.copy(mapOptions);

        $scope.search = function() {
            RaceService.search($scope.criteria).then(function(response) {
                if (response.data.items.length > 0) {
                    $scope.emptyResults = false;
                    $scope.map.markers = RouteBuilderService.convertRacesLocationToMarkers(response.data.items);
                    underscore.each($scope.map.markers, function(marker) {
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