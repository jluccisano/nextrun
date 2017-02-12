"use strict";

describe("AboutController", function() {

	var $scope, $controller, mockMetaService;

	beforeEach(module("nextrunApp"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		mockMetaService = _MetaService_;
	}));

	describe("ready()", function() {

		it("loading with success", function() {

			spyOn(mockMetaService, "ready");

			$controller("AboutController", {
				$scope: $scope,
				MetaService: mockMetaService
			});

			expect(mockMetaService.ready).toHaveBeenCalled();
		});

	});
});