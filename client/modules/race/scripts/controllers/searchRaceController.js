"use strict";

angular.module("nextrunApp.race").controller("SearchRaceController",
    function(
        $scope,
        $location,
        RaceService,
        SharedCriteriaService,
        DepartmentEnum,
        RegionEnum,
        RaceTypeEnum,
        MetaService,
        gettextCatalog,
        RouteHelperService,
        RouteService) {



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

                    $scope.map.markers = RouteService.convertRacesLocationToMarkers(response.data.items);

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
                MetaService.ready(gettextCatalog.getString("Manifestations"), $location.path(), gettextCatalog.getString("Manifestations"));
            });

        };

        $scope.onMarkerClicked = function(marker) {
            marker.showWindow = true;
            $scope.$apply();
        };

        $scope.search();

        /*
        var initCriteria = function() {
            $scope.criteria = {
                sort: "_score",
                size: 20,
                from: 0,
                fulltext: "",
                departments: [],
                region: RegionEnum.getRegionByName("*"),
                types: [],
                dateRanges: [{
                    startDate: moment(),
                    endDate: moment().add(179, "days")
                }],
                location: {},
                searchAround: true,
                distance: "15"
            };
        };

        var initPagination = function() {
            $scope.pagination = {
                total: 0,
                pageSize: 20,
                currentPage: 1,
                maxPage: 5,
                numPages: 0
            };
        };

        var initFacets = function() {
            $scope.facets = {
                departmentFacets: [],
                typeFacets: []
            };
        };

        var initRaces = function() {
            $scope.races = [];
        };

        var initAutocomplete = function() {
            $scope.autocomplete = {
                options: {
                    country: "fr",
                    types: "(cities)"
                }
            };
        };

        initCriteria();
        initPagination();
        initFacets();
        initRaces();
        initAutocomplete();

        $scope.listOfRegion = RegionEnum.getValues();
        $scope.dateRange = {
            startDate: moment(),
            endDate: moment().add("days", 179)
        };

        $scope.$on("handleCriteriaBroadcast", function() {
            $scope.criteria = SharedCriteriaService.criteria;
            $scope.isModeGeolocation = SharedCriteriaService.mode;
            $scope.search();
        });

        $scope.reinitFilter = function() {
            $scope.criteria.departments = [];
            $scope.criteria.types = [];
            $scope.criteria.dateRange = [];
            $scope.search();
        };

        $scope.suggest = function(queryString) {

            var criteria = {
                fulltext: (queryString !== undefined) ? queryString : "",
                region: ($scope.criteria.region.name !== RegionEnum.getRegionByName("*")) ? $scope.criteria.region : undefined
            };

            return RaceService.suggest(criteria).then(function(response) {

                $scope.names = [];

                var races = response.data.hits.hits;

                var queryFullText = {
                    fullname: queryString,
                    id: undefined
                };

                $scope.names.push(queryFullText);

                if (races) {
                    for (var i = 0; i < races.length; i++) {

                        var name = {
                            fullname: races[i].fields.partial1[0].name,
                            id: races[i].fields.partial1[0]._id
                        };

                        $scope.names.push(name);
                    }
                }
                return $scope.names;
            });
        };

        $scope.onSelect = function($item) {
            if ($scope.names.length > 0 && $item !== $scope.names[0]) {
                $location.path("/races/view/" + $item.id + "/");
            }
        };

        $scope.getDepartmentsCodes = function(departments) {
            var departmentsCodes = [];
            angular.forEach(departments, function(item) {
                departmentsCodes.push(item.department.code);
            });
            return departmentsCodes;
        };

        $scope.displayDepartment = function(departmentCode) {
            var department = DepartmentEnum.getDepartmentByCode(departmentCode);
            return department.code + " - " + department.name;
        };

        $scope.getTypeByName = function(typeName) {
            var type = RaceTypeEnum.getRaceTypeByName(typeName);
            return type.i18n;
        };


        $scope.search = function() {
            RaceService.search($scope.criteria).then(
                function(response) {
                    if (response.data && response.data.hits.hits.length > 0) {
                        $scope.races = response.data.hits.hits;
                        $scope.facets.typeFacets = response.data.facets.typeFacets.terms;
                        $scope.facets.departmentFacets = $scope.buildDepartmentFacets(response.data.facets.departmentFacets.terms);
                        $scope.pagination.total = response.data.hits.total;
                    } else {
                        initRaces();
                        initFacets();
                        initPagination();
                    }
                });
        };

        $scope.buildDepartmentFacets = function(entries) {
            var results = [];

            _.each($scope.criteria.region.departments, function(department) {

                var departmentFacet = {
                    department: DepartmentEnum.getDepartmentByCode(department),
                    count: 0
                };

                var hasFacet = _.findWhere(entries, {
                    term: departmentFacet.department.code
                });
                if (hasFacet !== undefined) {
                    departmentFacet.count = hasFacet.count;
                }
                results.push(departmentFacet);

            });
            return results;
        };

        $scope.changeDateRange = function(dateRange) {
            if ($scope.criteria.dateRanges.length > 0) {
                $scope.criteria.dateRanges.splice(0, 1);
            }
            $scope.criteria.dateRanges.push(dateRange);
        };

        $scope.removeDateRange = function() {
            if ($scope.criteria.dateRanges.length > 0) {
                $scope.criteria.dateRanges.splice(0, 1);
            }
        };

        $scope.switchSearchView = function(value) {
            $scope.isModeGeolocation = value;
            initCriteria();
        };

        MetaService.ready(gettextCatalog.getString("Rechercher une manifestation"), $location.path(), gettextCatalog.getString("Rechercher une manifestation"));

        $scope.search(); */

    });