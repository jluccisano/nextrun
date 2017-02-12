'use strict';

describe('RaceHomeController', function() {

	var $scope, $controller, $location, metaBuilder;

	beforeEach(module('nextrunApp.race'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$location_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$location = _$location_;
		metaBuilder = _metaBuilder_;
	}));

	describe('ready()', function() {

		it('loading with success', function() {
			spyOn(metaBuilder, "ready");

			$controller('RaceHomeController', {
				$scope: $scope,
			});
			expect(metaBuilder.ready).toHaveBeenCalled();
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