angular.module('nextrunApp').controller('SearchRaceCtrl', ['$scope', '$location', '$routeParams', 'RaceServices',
	function($scope, $location, $routeParams, RaceServices) {
		'use strict';


		$scope.selected = undefined;
		$scope.total = 0;
		$scope.pageSize = 20;

		$scope.currentPage = 1;
		$scope.maxSize = 5;

		$scope.currentTypeSelected = [];

		$scope.department = $routeParams.department;

		$scope.init = function() {
			RaceServices.search($scope.department,
				function(response) {

					$scope.races = response.races[0].results;

					$scope.facets = response.facets;

					$scope.totalItems = response.races[0].size;

					$scope.total = response.races[0].total;

					$scope.idx = $scope.currentTypeSelected.indexOf($scope.facets[0]._id.name);
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

		$scope.onChange = function() {
			search();
			$scope.currentPage = 1;
		}

		$scope.onSelectPage = function() {
			//search();
		};


		$scope.onChangePageSize = function() {
			//search();
			//$scope.currentPage = 1;
		};

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

			var has = "";

			angular.forEach($scope.currentTypeSelected, function(item) {
				has += item + ",";
			});

			has = has.substr(0, has.length - 1);

			var url;
			if (has != "") {
				url = '/employees/search/' + $scope.currentSearch + '/filters/' + has + '/page/' + $scope.currentPage + '/size/' + $scope.pageSize
			} else {
				url = '/employees/search/' + $scope.currentSearch + '/page/' + $scope.currentPage + '/size/' + $scope.pageSize
			}


			return $http({
				method: 'GET',
				url: url
			}).
			then(function(response) {

				/*var hits = response.data.hits;

				var facets = response.data.facets;

				$scope.total = hits.total;

				$scope.employees = hits.hits;

				$scope.agencies = facets.agencyFacet.terms;

				$scope.totalItems = $scope.total;*/



			});

		};

		$scope.init();
	}
]);