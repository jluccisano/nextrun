angular.module('nextrunApp').controller('SearchRaceCtrl', ['$scope', '$location', '$routeParams', 'RaceServices', '$http', 'mySharedService', '$rootScope',
	function($scope, $location, $routeParams, RaceServices, $http, sharedService, $rootScope) {
		'use strict';



		$scope.fulltext = undefined;
		$scope.total = 0;
		$scope.pageSize = 20;

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.sort = "_score";
		$scope.emptyResults = true;

		$scope.currentTypeSelected = [];
		$scope.currentDepartmentSelected = [];
		$scope.currentRegionSelected = [];

		$scope.departments = [];
		$scope.region = REGIONS.ALL.value;

		$scope.listOfDepartments = DEPARTMENTS.enums;
		$scope.listOfRegions = REGIONS.enums;

		$scope.names = [];

		$scope.departmentFacets = [];
		$scope.dateFacets = [];
		$scope.typeFacets = [];

		$scope.$on('handleBroadcast', function() {
			$scope.fulltext = sharedService.fulltext;
			$scope.region = sharedService.region;
			$scope.currentTypeSelected = sharedService.currentTypesSelected;
			$scope.search();
		});

		$scope.datarangeConfig = {
			minDate: '01/01/2012',
			maxDate: '31/12/2015',
			dateLimit: {
				days: 365
			},
			showDropdowns: true,
			showWeekNumbers: true,
			timePicker: false,
			timePickerIncrement: 1,
			timePicker12Hour: true,
			ranges: {
				"Aujourd'hui": [moment(), moment()],
				"Les 7 Prochains jours": [moment(), moment().add('days', 6)],
				"Les 30 Prochains jours": [moment(), moment().add('days', 29)],
				"Ce mois-ci": [moment().startOf('month'), moment().endOf('month')],
				"Le mois prochain": [moment().add('month', 1).startOf('month'), moment().add('month', 1).endOf('month')]
			},
			opens: 'left',
			buttonClasses: ['btn btn-default'],
			applyClass: 'btn-small btn-primary',
			cancelClass: 'btn-small',
			format: 'DD/MM/YYYY',
			separator: ' a ',
			locale: {
				applyLabel: 'Valider',
				fromLabel: 'de',
				toLabel: 'a',
				customRangeLabel: 'Personnalise',
				daysOfWeek: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
				monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
				firstDay: 0
			},
		};

		$scope.dateRange = {
			"startDate": moment(),
			"endDate": moment().add('days', 365)
		};


		$scope.deleteFilters = function() {
			$scope.currentTypeSelected = [];
			$scope.departments = [];
			$scope.dateRange = {
				"startDate": moment(),
				"endDate": moment().add('days', 29)
			};
		}


		$scope.getDate = function(dateString) {
			if (dateString) {
				return moment(new Date(dateString)).format("DD MMMM YYYY");
			}
			return '-';
		};

		

		$scope.getRegion = function(region) {
			return region.name;
		};

		$scope.formatDateRange = function(dateRange) {
			return "du " + moment(new Date(dateRange.startDate)).format("DD-MM-YYYY") + ' au ' + moment(new Date(dateRange.endDate)).format("DD-MM-YYYY");
		};



		$scope.autocomplete = function(query_string) {

			var criteria = {
				fulltext: (query_string !== undefined) ? query_string : "",
				region: ($scope.region.name !== REGIONS.ALL.value.name) ? $scope.region : undefined
			};

			return $http({
				headers: {'Content-Type': 'application/json'},
				method: 'POST',
				url: '/api/races/autocomplete',
				data: {criteria:criteria}
			}).
			then(function(response) {

				$scope.names = [];

				var races = response.data.hits.hits;

				var query_fulltext = {
					fullname: query_string,
					id: undefined
				}
				$scope.names.push(query_fulltext);


				for (var i = 0; i < races.length; i++) {

					var name = {
						fullname: races[i].fields.name,
						id: races[i].fields._id
					}
					$scope.names.push(name);
				}

				return $scope.names;
			});
		};

		$scope.onSelectPage = function() {
			$scope.search();
		};


		$scope.onChangePageSize = function() {
			$scope.search();
		};

		$scope.onChangeSort = function() {
			$scope.search();
		};

		$scope.onChange = function() {
			$scope.search();
		}

		$scope.onChangeRegion = function(region) {
			$scope.search();
		}

		$scope.onSelect = function($item) {



			if ($scope.names.length > 0 && $item !== $scope.names[0]) {

				$location.path("/races/view/" + $item.id)

			} else {

				//Reinit 
				$scope.deleteFilters();
				$scope.search();
			}



		};

		$scope.resetDataRangeFilter = function() {
			$scope.dateRange = {
				"startDate": moment(),
				"endDate": moment().add('days', 29)
			};

		};

		$scope.toggleDepartmentSelection = function(term) {
			var idx = $scope.departments.indexOf(term);

			// is currently selected
			if (idx > -1) {
				$scope.departments.splice(idx, 1);
			}

			// is newly selected
			else {
				$scope.departments.push(term);
			}
		};

		$scope.toggleRegionSelection = function(term) {
			var idx = $scope.departments.indexOf(term);

			// is currently selected
			if (idx > -1) {
				$scope.departments.splice(idx, 1);
			}

			// is newly selected
			else {
				$scope.departments.push(term);
			}
		};


		$scope.toggleTypeSelection = function(term) {
			var idx = $scope.currentTypeSelected.indexOf(term);

			// is currently selected
			if (idx > -1) {
				$scope.currentTypeSelected.splice(idx, 1);
			}

			// is newly selected
			else {
				$scope.currentTypeSelected.push(term);
			}
		};

		$scope.getDepartmentsCodes = function(departments) {
			var departmentsCodes = [];
			angular.forEach(departments, function(item) {
				departmentsCodes.push(item.department.code);
			});
			return departmentsCodes
		};

		$scope.getDepartmentByCode = function(departmentCode) {
			var department = getDepartmentByCode(DEPARTMENTS, departmentCode);
			return department.code + ' - ' + department.name;
		}

		$scope.getTypeByName = function(typeName) {
			var type = getRaceTypeByName(TYPE_OF_RACES, typeName);
			return type.i18n;
		}



		$scope.search = function() {

			$scope.currentPage = 1;


			var criteria = {
				fulltext: ($scope.fulltext !== undefined && $scope.fulltext.fullname) ? $scope.fulltext.fullname : "",
				page: ($scope.currentPage - 1),
				size: $scope.pageSize,
				sort: $scope.sort,
				types: $scope.currentTypeSelected,
				departments: ($scope.region.name !== REGIONS.ALL.value.name) ? $scope.departments : [],
				region: ($scope.region.name !== REGIONS.ALL.value.name) ? $scope.region : undefined,
				dateRange: $scope.dateRange
			};

			RaceServices.search(criteria,
				function(response) {

					if (response.hits.hits.length > 0) {

						$scope.emptyResults = false;

						$scope.races = response.hits.hits;

						$scope.typeFacets = response.facets.typeFacets.terms;

						$scope.departmentFacets = $scope.buildDepartmentFacets(response.facets.departmentFacets.terms);

						$scope.total = response.hits.total;
						$scope.totalItems = $scope.total;

						

					} else {

						$scope.emptyResults = true;

						$scope.races = [];

						$scope.departmentFacets = [];
						$scope.typeFacets = [];

						$scope.totalItems = 0;

						$scope.total = 0;

					}

				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};


		$scope.buildDepartmentFacets = function(entries) {
			var results = [];

			_.each($scope.region.departments, function(department) {

				var departmentFacet = {
					department: getDepartmentByCode(DEPARTMENTS, department),
					count: 0
				}

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

		$scope.displayDepartmentFacet = function(department) {
			return department.department.name + ' (' + department.count + ') ';
		};

	}
]);