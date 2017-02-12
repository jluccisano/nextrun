'use strict';

describe('FooterController', function() {

	var $scope, $controller;

	beforeEach(module('nextrunApp.main'));

	beforeEach(inject(function(_$rootScope_, _$controller_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
	}));

	describe('init()', function() {

		it('loading with success', function() {

			$controller('FooterController', {
				$scope: $scope
			});
		});

	});
});