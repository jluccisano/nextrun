"use strict";

describe("ContactController", function() {

	var $scope, $controller, MetaService;

	beforeEach(module("nextrunApp.main"));

	beforeEach(inject(function(_$rootScope_, _$controller_,_MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		MetaService = _MetaService_;
	}));

	describe("ready()", function() {

		it("loading with success", function() {

			spyOn(MetaService, "ready");

			$controller("ContactController", {
				$scope: $scope,
			});

			expect(MetaService.ready).toHaveBeenCalled();
		});

	});
});