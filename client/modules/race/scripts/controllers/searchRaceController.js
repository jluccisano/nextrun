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
        gettextCatalog) {

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

                var races = response.hits.hits;

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

        //service department
        $scope.getDepartmentsCodes = function(departments) {
            var departmentsCodes = [];
            angular.forEach(departments, function(item) {
                departmentsCodes.push(item.department.code);
            });
            return departmentsCodes;
        };

        //service department
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
                    if (response.hits.hits.length > 0) {
                        $scope.races = response.hits.hits;
                        $scope.facets.typeFacets = response.facets.typeFacets.terms;
                        $scope.facets.departmentFacets = $scope.buildDepartmentFacets(response.facets.departmentFacets.terms);
                        $scope.pagination.total = response.hits.total;
                    } else {
                        initRaces();
                        initFacets();
                        initPagination();
                    }
                });
        };

        //todo directives
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

        $scope.search();

    });