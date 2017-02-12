angular.module('nextrunApp').controller('SearchRaceCtrl', ['$scope', '$location', '$routeParams', 'RaceServices','$http',
	function($scope, $location, $routeParams, RaceServices,$http) {
		'use strict';


		$scope.selected = undefined;
		$scope.total = 0;
		$scope.pageSize = 20;

		$scope.currentPage = 1;
		$scope.maxSize = 5;
		$scope.sort = "_score";



		$scope.currentTypeSelected = [];

		$scope.departments = $routeParams.departments;

		$scope.init = function() {
			RaceServices.search($scope.departments,
				function(response) {

					$scope.races = response.races[0].results;

					$scope.facets = response.facets;

					$scope.totalItems = response.races[0].size;

					$scope.total = response.races[0].total;
				},
				function(error) {
					_.each(error.message, function(message) {
						Alert.add("danger", message, 3000);
					});
				});
		};

		$scope.getDate = function(dateString) {
			if (dateString) {
				return moment(new Date(dateString)).format("DD MMMM YYYY");
			}
			return '-';
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
			search();
			$scope.currentPage = 1;
		}


		$scope.toggleSelection = function toggleSelection(term) {
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


		var search = function() {

			var url = '/api/races/search' + '/page/' + ($scope.currentPage - 1) + '/size/' + $scope.pageSize + '/sort/' + $scope.sort

			var hasTypes = "";

			angular.forEach($scope.currentTypeSelected, function(item) {
				hasTypes += item + ",";
			});

			hasTypes = hasTypes.substr(0, hasTypes.length - 1);

			if (hasTypes != "") {
				url = url + '/types/' + hasTypes;
			}


			return $http({
				method: 'GET',
				url: url
			}).
			then(function(response) {

				$scope.races = response.races[0].results;

				$scope.facets = response.facets;

				$scope.totalItems = response.races[0].size;

				$scope.total = response.races[0].total;

			});

		};

		$scope.init();
	}
]);