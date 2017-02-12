'use strict';

describe('SearchRaceController', function() {

	var $scope,
		$controller,
		$location,
		$q,
		$timeout,
		mockRaceService,
		mockRace,
		mockAlertService,
		mockSuggestResponse,
		mockCriteria,
		RegionEnum;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$timeout_, _AlertService_, _RegionEnum_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		$timeout = _$timeout_;
		RegionEnum = _RegionEnum_;
		mockAlertService = _AlertService_;
		mockSuggestResponse = _MockFactory_.getMockSuggestResponse();
		mockRaceService = _MockFactory_.getMockRaceService();
		mockCriteria = _MockFactory_.getMockCriteria();

		$controller('SearchRaceController', {
			$scope: $scope,
			RaceService: mockRaceService,
			AlertService: mockAlertService
		});
	}));


	describe('suggest()', function() {
		it('Suggest with success', function() {

			mockRaceService.setPromiseResponse(true);

			spyOn(mockRaceService, "suggest").and.callThrough();

			$scope.criteria = {
				region: {
					name: 'Aquitaine',
					departments: ['24', '33', '40', '47', '64']
				}

			};

			$scope.suggest("dua");

			$scope.$apply();

			expect($scope.names.length).toBe(2);
		});
	});

	describe('search()', function() {
		it('Suggest with success', function() {

			mockRaceService.setPromiseResponse(true);

			spyOn(mockRaceService, "search").and.callThrough();

			$scope.search();

			$scope.$apply();

			expect($scope.races.length).toBe(1);
		});
	});

	describe('buildDepartmentFacets()', function() {
		it('buildDepartmentFacets with department of different region return count 0', function() {

			$scope.criteria = mockCriteria;

			var entries = [{
				count: 1,
				term: "11"
			}];

			var facets = $scope.buildDepartmentFacets(entries);

			expect(facets.length).toBe(2);
			expect(facets[0].count).toBe(0);
			expect(facets[0].department.code).toBe("67");

		});

		it('buildDepartmentFacets with department of region return count 11', function() {

			$scope.criteria = mockCriteria;

			var entries = [{
				count: 1,
				term: "67"
			}];

			var facets = $scope.buildDepartmentFacets(entries);

			expect(facets.length).toBe(2);
			expect(facets[0].count).toBe(1);
			expect(facets[0].department.code).toBe("67");

		});
	});


});