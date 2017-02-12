"use strict";

describe("Segment Services", function() {

	var $scope, SegmentService, RouteUtilsService, mockLegs, mockPath, mockSegment, mockSegments, mockPoint;

	beforeEach(module("nextrunApp.route", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _SegmentService_, _RouteUtilsService_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		SegmentService = _SegmentService_;
		RouteUtilsService = _RouteUtilsService_;
		mockLegs = _MockFactory_.getMockLegs();
		mockPath = _MockFactory_.getMockPath();
		mockSegment = _MockFactory_.getMockSegment();
		mockSegments = _MockFactory_.getMockSegments();
		mockPoint = _MockFactory_.getMockPoint();
	}));

	/*describe("calculateDistanceOfSegment", function() {

		it("should throw error when legs is undefined", function() {
			expect(function() {
				SegmentService.calculateDistanceOfSegment(undefined)
			}).toThrowError("legs is undefined");
		});

		it("should return distance segment", function() {
			expect(SegmentService.calculateDistanceOfSegment(mockLegs)).toBe(2);
		});
	});

	describe("createSegment", function() {

		it("should throw error when path is undefined", function() {
			expect(function() {
				SegmentService.createSegment(undefined, undefined, false);
			}).toThrowError("path is undefined");
		});

		it("should throw error when legs is undefined", function() {
			expect(function() {
				SegmentService.createSegment(mockPath, undefined, false);
			}).toThrowError("legs is undefined");
		});

		it("should return a segment", function() {
			spyOn(RouteUtilsService, "generateUUID").and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			spyOn(SegmentService, "calculateDistanceOfSegment").and.returnValue(2);
			expect(SegmentService.createSegment(mockPath, mockLegs, true)).toEqual({
				segmentId: "110E8400-E29B-11D4-A716-446655440000",
				points: [{
					latlng: {
						mb: 45.3,
						nb: 1.2999999999999545
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: "110E8400-E29B-11D4-A716-446655440000"
				}, {
					latlng: {
						mb: 45.4,
						nb: 1.3999999999999773
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: "110E8400-E29B-11D4-A716-446655440000"
				}],
				distance: 2
			});
		});

		it("should return a segment skipping the firstpoint", function() {
			spyOn(RouteUtilsService, "generateUUID").and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			spyOn(SegmentService, "calculateDistanceOfSegment").and.returnValue(2);
			expect(SegmentService.createSegment(mockPath, mockLegs, false)).toEqual({
				segmentId: "110E8400-E29B-11D4-A716-446655440000",
				points: [{
					latlng: {
						mb: 45.4,
						nb: 1.3999999999999773
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: "110E8400-E29B-11D4-A716-446655440000"
				}],
				distance: 2
			});
		});
	});

	describe("getLastPointOfLastSegment", function() {

		it("should throw error when segments is undefined", function() {
			expect(function() {
				SegmentService.getLastPointOfLastSegment(undefined);
			}).toThrowError("segments is undefined");
		});

		it("should throw error when segments is undefined", function() {
			expect(function() {
				SegmentService.getLastPointOfLastSegment([]);
			}).toThrowError("segments must contains at least 1 segment");
		});

		it("should return last point of last segment", function() {
			expect(SegmentService.getLastPointOfLastSegment(mockSegments)).toEqual({
				latlng: {
					mb: 45.4,
					nb: 1.4
				},
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: "110E8400-E29B-11D4-A716-446655440000"
			});
		});
	});

	describe("calculateDistanceFromStartForEachPointOfSegment", function() {

		it("should throw error when segmentPoints is undefined", function() {
			expect(function() {
				SegmentService.calculateDistanceFromStartForEachPointOfSegment(undefined, undefined);
			}).toThrowError("segmentPoints is undefined");
		});

		it("should return segment point with a good distance from start set", function() {
			spyOn(RouteUtilsService, "calculateDistanceBetween2Points").and.returnValue(2);
			expect(SegmentService.calculateDistanceFromStartForEachPointOfSegment(mockSegment.points, mockPoint)).toEqual([{
				latlng: {
					mb: 45.3,
					nb: 1.3
				},
				elevation: 0,
				distanceFromStart: 2,
				grade: 0,
				segmentId: "110E8400-E29B-11D4-A716-446655440000"
			}, {
				latlng: {
					mb: 45.4,
					nb: 1.4
				},
				elevation: 0,
				distanceFromStart: 4,
				grade: 0,
				segmentId: "110E8400-E29B-11D4-A716-446655440000"
			}]);
		});
	});

	describe("createSimpleSegment", function() {

		it("should throw error when startLatlng is undefined", function() {
			expect(function() {
				var destinationLatlng = new google.maps.LatLng(45.4, 1.3);
				SegmentService.createSimpleSegment(undefined, destinationLatlng);
			}).toThrowError("start Latlng is undefined");
		});

		it("should throw error when destinationLatlng is undefined", function() {
			expect(function() {
				var startLatlng = new google.maps.LatLng(45.3, 1.3);
				SegmentService.createSimpleSegment(startLatlng, undefined);
			}).toThrowError("destination Latlng is undefined");
		});

		it("should throw error when startLatlng is not an instance of google.maps.LatLng", function() {
			expect(function() {
				var destinationLatlng = new google.maps.LatLng(45.4, 1.3);
				SegmentService.createSimpleSegment({}, destinationLatlng);
			}).toThrowError("start Latlng is not instance of google.maps.Latlng");
		});

		it("should throw error when destinationLatlng is not an instance of google.maps.LatLng", function() {
			expect(function() {
				var startLatlng = new google.maps.LatLng(45.3, 1.3);
				SegmentService.createSimpleSegment(startLatlng, {});
			}).toThrowError("destination Latlng is not instance of google.maps.Latlng");
		});

		it("should throw error when calculate distance failed", function() {

			var startLatlng = new google.maps.LatLng(45.3, 1.3);
			var destinationLatlng = new google.maps.LatLng(45.4, 1.3);

			spyOn(RouteUtilsService, "calculateDistanceBetween2Points").and.throwError();
			spyOn(RouteUtilsService, "generateUUID").and.returnValue("110E8400-E29B-11D4-A716-446655440000");

			expect(SegmentService.createSimpleSegment(startLatlng, destinationLatlng)).toEqual({
				segmentId: "110E8400-E29B-11D4-A716-446655440000",
				points: [{
					latlng: {
						mb: 45.4,
						nb: 1.2999999999999545
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: "110E8400-E29B-11D4-A716-446655440000"
				}],
				distance: 0
			});
		});

		it("should return new simple segment", function() {

			var startLatlng = new google.maps.LatLng(45.3, 1.3);
			var destinationLatlng = new google.maps.LatLng(45.4, 1.3);

			spyOn(RouteUtilsService, "calculateDistanceBetween2Points").and.returnValue(2);
			spyOn(RouteUtilsService, "generateUUID").and.returnValue("110E8400-E29B-11D4-A716-446655440000");

			expect(SegmentService.createSimpleSegment(startLatlng, destinationLatlng)).toEqual({
				segmentId: "110E8400-E29B-11D4-A716-446655440000",
				points: [{
					latlng: {
						mb: 45.4,
						nb: 1.2999999999999545
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: "110E8400-E29B-11D4-A716-446655440000"
				}],
				distance: 2
			});
		});
	});

	describe("getLastSegment", function() {

		it("should throw error when segments is undefined", function() {
			expect(function() {
				SegmentService.getLastSegment(undefined);
			}).toThrowError("segments is undefined");
		});

		it("should throw error when segments is undefined", function() {
			expect(function() {
				SegmentService.getLastSegment([]);
			}).toThrowError("segments must contains at least 1 segment");
		});

		it("should return last segment", function() {
			expect(SegmentService.getLastSegment(mockSegments)).toEqual(mockSegments[mockSegments.length-1]);
		});

	});*/

});
