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
        RouteBuilderService) {

        $scope.setRange = function(index) {
            $scope.active = index;
            $scope.criteria.dateRange = $scope.dateRanges[index];
            $scope.search();
        };
        
        $scope.dateRanges = [{
            label: "Les 7 Prochains jours",
            startDate: moment(),
            endDate: moment().add("days", 6)
        }, {
            label: "Les 30 Prochains jours",
            startDate: moment(),
            endDate: moment().add("days", 29)
        }, {
            label: "Les 3 mois à venir",
            startDate: moment(),
            endDate: moment().add("days", 89)
        }, {
            label: "Les 6 mois à venir",
            startDate: moment(),
            endDate: moment().add("days", 179)
        }, {
            label: "Personnalisée",
            startDate: moment(),
            endDate: undefined
        }];

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

        $scope.map = {
            isVisible: false,
            editMode: true,
            segments: [],
            zoom: 6,
            fit: true,
            markers: [],
            polylines: [],
            center: {
                latitude: 46.52863469527167,
                longitude: 2.43896484375,
            },
            options: {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.HYBRID,
                        google.maps.MapTypeId.SATELLITE
                    ]
                },
                disableDoubleClickZoom: true,
                scrollwheel: true,
                draggableCursor: "crosshair",
                streetViewControl: false,
                zoomControl: true
            },
            clusterOptions: {
                gridSize: 60,
                ignoreHidden: true,
                minimumClusterSize: 2
            },
            doClusterMarkers: true
        };


        $scope.search = function() {
            RaceService.search($scope.criteria).then(function(response) {
                if (response.data.items.length > 0) {

                    $scope.emptyResults = false;

                    $scope.map.markers = RouteBuilderService.convertRacesLocationToMarkers(response.data.items);

                    _.each($scope.map.markers, function(marker) {
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