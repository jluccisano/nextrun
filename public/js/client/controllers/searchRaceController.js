angular.module('nextrunApp').controller('SearchRaceCtrl', ['$scope', '$location', '$routeParams', 'RaceServices','$http',
	function($scope, $location, $routeParams, RaceServices,$http) {
		'use strict';


		$scope.selected = undefined;
		$scope.total = 0;
		$scope.pageSize = 20;

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.sort = "_score";
		$scope.emptyResults = true;

		$scope.currentTypeSelected = [];
		$scope.departments = [];
		$scope.dateRange = {};

		$scope.datarangeConfig = {
			//startDate: fromDate,
			//endDate: toDate,
			minDate: '01/01/2012',
			maxDate: '31/12/2015',
			dateLimit: { days: 60 },
			showDropdowns: true,
			showWeekNumbers: true,
			timePicker: false,
			timePickerIncrement: 1,
			timePicker12Hour: true,
			ranges: {
				"Aujourd'hui": [moment(), moment()],
				"Hier": [moment().subtract('days', 1), moment().subtract('days', 1)],
				"Les 7 Derniers jours": [moment().subtract('days', 6), moment()],
				"Les 30 Derniers jours": [moment().subtract('days', 29), moment()],
				"Ce mois-ci": [moment().startOf('month'), moment().endOf('month')],
				"Le dernier mois": [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
			},
			opens: 'left',
			buttonClasses: ['btn btn-default'],
			applyClass: 'btn-small btn-primary',
			cancelClass: 'btn-small',
			format: 'DD/MM/YYYY',
			separator: ' à ',
			locale: {
				applyLabel: 'Valider',
				fromLabel: 'de',
				toLabel: 'à',
				customRangeLabel: 'Personnalisé',
				daysOfWeek: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa','Di'],
				monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
				firstDay: 0
			},
		};

		$scope.computeUrlParams = function() {

			var departmentsArray = $routeParams.departments.split(',');

			_.each(departmentsArray, function(departmentCode) {
				$scope.departments.push(getDepartmentByCode(DEPARTMENTS,departmentCode));
			});

		}


		$scope.listOfDepartments = DEPARTMENTS.enums;



		$scope.getDate = function(dateString) {
			if (dateString) {
				return moment(new Date(dateString)).format("DD MMMM YYYY");
			}
			return '-';
		};

		$scope.getDepartment = function(department) {
			return department.code + ' - ' + department.name;
		};

		$scope.autocomplete = function(query) {
			return $http({
				method: 'GET',
				url: '/employees/_autocomplete/' + query
			}).
			then(function(response) {

				var names = [];

				var hits = response.data.hits.hits;
				//push the current query at first
				names.push(query);


				for (var i = 0; i < hits.length; i++) {
					names.push(hits[i]._source.firstname + " " + hits[i]._source.lastname);
				}

				return names;
			});

		};

		$scope.onSelectPage = function() {
			$scope.search();
		};


		$scope.onChangePageSize = function() {
			$scope.search();
			$scope.currentPage = 1;
		};

		$scope.onChangeSort = function() {
			$scope.search();
			$scope.currentPage = 1;
		};

		$scope.onChange = function() {
			$scope.search();
			$scope.currentPage = 1;
		}


		$scope.toggleSelection = function(term) {
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

			var criteria = {
				page: ($scope.currentPage - 1) ,
				size: $scope.pageSize,
				sort: {"date":1},
				types: $scope.currentTypeSelected,
				departments: $scope.getDepartmentsCodes($scope.departments),
				dateRange: $scope.dateRange
			};

			RaceServices.search(criteria,
				function(response) {

					if(response.races.length > 0) {

						$scope.emptyResults = false;

						$scope.races = response.races[0].results;

						$scope.typeFacets = response.facets[0];

						$scope.totalItems = response.races[0].size;

						$scope.total = response.races[0].total;

					} else {

						$scope.emptyResults = true;

						$scope.races = [];

						$scope.facets = [];

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
		//$scope.search();
	}
]);