"use strict";

describe("route utils", function() {

	var $scope, RouteUtilsService;

	beforeEach(module("nextrunApp.route"));

	beforeEach(inject(function(_$rootScope_, _RouteUtilsService_) {
		$scope = _$rootScope_.$new();
		RouteUtilsService = _RouteUtilsService_;
	}));

	describe("rad", function() {
		it("should return a radian", function() {
			expect(RouteUtilsService.rad(100)).toBe(1.7453292519943295);
		});
	});

	describe("generateUUID", function() {
		it("should return a UUID", function() {
			expect(RouteUtilsService.generateUUID().length).toBe(36);
		});
	});

	describe("calculateDistanceBetween2Points", function() {

		it("should throw error when longitude is undbounds", function() {
			var p1 = {
				mb: 345.2,
				nb: 1.34
			};

			var p2 = {
				mb: 45.3,
				nb: 1.33
			};

			expect(function() {
				RouteUtilsService.calculateDistanceBetween2Points(p1, p2);
			}).toThrowError("invalid longitude");

		});

		it("should throw error when latitude is undefined", function() {
			var p1 = {
				mb: 45.2,
				nb: 1.34
			};

			var p2 = {
				mb: 45.3,
				nb: 91
			};

			expect(function() {
				RouteUtilsService.calculateDistanceBetween2Points(p1, p2);
			}).toThrowError("invalid latitude");

		});



		it("should return a correct distance", function() {
			var p1 = {
				mb: 45.2,
				nb: 1.34
			};

			var p2 = {
				mb: 45.3,
				nb: 1.33
			};
			expect(RouteUtilsService.calculateDistanceBetween2Points(p1, p2)).toBe("11.147");
		});
	});

});