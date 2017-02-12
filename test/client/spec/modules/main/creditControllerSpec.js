'use strict';

describe('CreditController', function() {

	var $scope, $controller, metaBuilder;

	beforeEach(module('nextrunApp.main'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		metaBuilder = _metaBuilder_;
	}));

	describe('ready()', function() {

		it('loading with success', function() {

			spyOn(metaBuilder, "ready");

			$controller('CreditController', {
				$scope: $scope,
			});

			expect(metaBuilder.ready).toHaveBeenCalled();
		});

	});
});