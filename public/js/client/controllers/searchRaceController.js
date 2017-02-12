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
		$scope.departments = [];


		$scope.listOfDepartments = DEPARTMENTS.enums;

		$scope.names = [];

		$scope.departmentFacets = [];
		$scope.dateFacets = [];
		$scope.typeFacets = [];

		$scope.$on('handleBroadcast', function(fulltext) {
			$scope.fulltext = sharedService.fulltext;
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
			"endDate": moment().add('days', 29)
		};


		$scope.computeUrlParams = function() {

			var departmentsParams = $routeParams.departments;

			if (departmentsParams) {

				var departmentsArray = $routeParams.departments.split(',');

				_.each(departmentsArray, function(departmentCode) {
					$scope.departments.push(getDepartmentByCode(DEPARTMENTS, departmentCode));
				});

				$scope.search();
			}

		}

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

		$scope.getDepartment = function(department) {
			return department.code + ' - ' + department.name;
		};

		$scope.formatDateRange = function(dateRange) {
			return "du " + moment(new Date(dateRange.startDate)).format("DD-MM-YYYY") + ' au ' + moment(new Date(dateRange.endDate)).format("DD-MM-YYYY");
		};



		$scope.autocomplete = function(query_string) {
			return $http({
				method: 'GET',
				url: '/api/races/autocomplete/' + query_string
			}).
			then(function(response) {

				$scope.names = [];

				var races = response.data.races;
				//push the current query at first

				var query_fulltext = {
					fullname: query_string,
					id: undefined
				}
				$scope.names.push(query_fulltext);


				for (var i = 0; i < races.length; i++) {

					var name = {
						fullname: races[i].name,
						id: races[i]._id
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
				departmentsCodes.push(item.code);
			});
			return departmentsCodes
		};


		$scope.search = function() {

			$scope.currentPage = 1;

			var criteria = {
				fulltext: ($scope.fulltext !== undefined && $scope.fulltext.fullname) ? $scope.fulltext.fullname : "",
				page: ($scope.currentPage - 1),
				size: $scope.pageSize,
				sort: {
					"date": 1
				},
				types: $scope.currentTypeSelected,
				departments: $scope.getDepartmentsCodes($scope.departments),
				dateRange: $scope.dateRange
			};

			RaceServices.search(criteria,
				function(response) {

					if (response.races.length > 0) {

						$scope.emptyResults = false;

						$scope.races = response.races[0].results;

						$scope.typeFacets = response.facets[2];

						$scope.departmentFacets = response.facets[0];

						$scope.dateFacets = response.facets[1];

						$scope.datarangeConfig.minDate = $scope.dateFacets[0].minDate;
						$scope.datarangeConfig.maxDate = $scope.dateFacets[0].maxDate;

						$scope.totalItems = response.races[0].size;

						$scope.total = response.races[0].total;

					} else {

						$scope.emptyResults = true;

						$scope.races = [];

						$scope.departmentFacets = [];
						$scope.dateFacets = [];
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
		$scope.computeUrlParams();
		$scope.search();
	}
]);