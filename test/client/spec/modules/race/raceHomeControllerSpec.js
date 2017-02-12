'use strict';

describe('RaceHomeController', function() {

	var $scope, $controller, $location, MetaService;

	beforeEach(module('nextrunApp.race'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$location_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$location = _$location_;
		MetaService = _MetaService_;
	}));

	describe('ready()', function() {

		it('loading with success', function() {
			spyOn(MetaService, "ready");

			$controller('RaceHomeController', {
				$scope: $scope,
			});
			expect(MetaService.ready).toHaveBeenCalled();
		});

	});

	describe('createNewRace()', function() {

		it('change location with success', function() {
			spyOn($location, "path");

			$controller('RaceHomeController', {
				$scope: $scope,
			});

			$scope.createNewRace();

			expect($location.path).toHaveBeenCalledWith('/races/create');
		});
	});
});