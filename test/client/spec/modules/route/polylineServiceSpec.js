"use strict";

describe("Polyline Services", function() {

	var $scope, PolylineService, RouteUtilsService, mockPath;

	beforeEach(module("nextrunApp.route", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _MockFactory_, _PolylineService_, _RouteUtilsService_) {
		$scope = _$rootScope_.$new();
		PolylineService = _PolylineService_;
		RouteUtilsService = _RouteUtilsService_;
		mockPath = _MockFactory_.getMockPath();
	}));

	/*describe("createPolyline", function() {

		it("should throw error when a point is not an instance of google.maps.LatLng", function() {
			expect(function() {
				var mockPathWithBadPoint = [{ lat: 45.3, lon: 1.3 }];
				PolylineService.createPolyline(mockPathWithBadPoint);
			}).toThrowError("point is not instance of google.maps.Latlng");
		});

		it("should throw error when path not contain at least two point", function() {
			expect(function() {
				var mockPathWithOnePoint = [new google.maps.LatLng(45.3, 1.3)];
				PolylineService.createPolyline(mockPathWithOnePoint);
			}).toThrowError("polyline must contain at least two point");
		});


		it("should create new Polyline", function() {
			spyOn(RouteUtilsService, "generateUUID").and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			expect(PolylineService.createPolyline(mockPath, true, true, true, true, "blue", 6)).toEqual({
				id: "110E8400-E29B-11D4-A716-446655440000",
				path: [{
					latitude: 45.3,
					longitude: 1.2999999999999545
				}, {
					latitude: 45.4,
					longitude: 1.3999999999999773
				}],
				stroke: {
					color: "blue",
					weight: 6
				},
				editable: true,
				draggable: true,
				geodesic: true,
				visible: true
			});

		});

		it("should create new Polyline with default parameters", function() {
			spyOn(RouteUtilsService, "generateUUID").and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			expect(PolylineService.createPolyline(mockPath)).toEqual({
				id: "110E8400-E29B-11D4-A716-446655440000",
				path: [{
					latitude: 45.3,
					longitude: 1.2999999999999545
				}, {
					latitude: 45.4,
					longitude: 1.3999999999999773
				}],
				stroke: {
					color: "red",
					weight: 5
				},
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true
			});

		});
	});*/

});