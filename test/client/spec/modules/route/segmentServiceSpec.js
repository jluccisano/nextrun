'use strict';

describe('Segment Services', function() {

	var $scope, SegmentServices, RouteUtils, mockLegs, mockPath, mockSegment, mockSegments, mockPoint;

	beforeEach(module('routeBuilder', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _SegmentServices_, _RouteUtils_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		SegmentServices = _SegmentServices_;
		RouteUtils = _RouteUtils_;
		mockLegs = _MockFactory_.getMockLegs();
		mockPath = _MockFactory_.getMockPath();
		mockSegment = _MockFactory_.getMockSegment();
		mockSegments = _MockFactory_.getMockSegments();
		mockPoint = _MockFactory_.getMockPoint();
	}));

	describe('calculateDistanceOfSegment', function() {

		it('should throw error when legs is undefined', function() {
			expect(function() {
				SegmentServices.calculateDistanceOfSegment(undefined)
			}).toThrowError('legs is undefined');
		});

		it('should return distance segment', function() {
			expect(SegmentServices.calculateDistanceOfSegment(mockLegs)).toBe(2);
		});
	});

	describe('createSegment', function() {

		it('should throw error when path is undefined', function() {
			expect(function() {
				SegmentServices.createSegment(undefined, undefined, false);
			}).toThrowError('path is undefined');
		});

		it('should throw error when legs is undefined', function() {
			expect(function() {
				SegmentServices.createSegment(mockPath, undefined, false);
			}).toThrowError('legs is undefined');
		});

		it('should return a segment', function() {
			spyOn(RouteUtils, 'generateUUID').and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			spyOn(SegmentServices, 'calculateDistanceOfSegment').and.returnValue(2);
			expect(SegmentServices.createSegment(mockPath, mockLegs, true)).toEqual({
				segmentId: '110E8400-E29B-11D4-A716-446655440000',
				points: [{
					latlng: {
						mb: 45.3,
						nb: 1.2999999999999545
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}, {
					latlng: {
						mb: 45.4,
						nb: 1.3999999999999773
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}],
				distance: 2
			});
		});

		it('should return a segment skipping the firstpoint', function() {
			spyOn(RouteUtils, 'generateUUID').and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			spyOn(SegmentServices, 'calculateDistanceOfSegment').and.returnValue(2);
			expect(SegmentServices.createSegment(mockPath, mockLegs, false)).toEqual({
				segmentId: '110E8400-E29B-11D4-A716-446655440000',
				points: [{
					latlng: {
						mb: 45.4,
						nb: 1.3999999999999773
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}],
				distance: 2
			});
		});
	});

	describe('getLastPointOfLastSegment', function() {

		it('should throw error when segments is undefined', function() {
			expect(function() {
				SegmentServices.getLastPointOfLastSegment(undefined);
			}).toThrowError('segments is undefined');
		});

		it('should throw error when segments is undefined', function() {
			expect(function() {
				SegmentServices.getLastPointOfLastSegment([]);
			}).toThrowError('segments must contains at least 1 segment');
		});

		it('should return last point of last segment', function() {
			expect(SegmentServices.getLastPointOfLastSegment(mockSegments)).toEqual({
				latlng: {
					mb: 45.4,
					nb: 1.4
				},
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: '110E8400-E29B-11D4-A716-446655440000'
			});
		});
	});

	describe('calculateDistanceFromStartForEachPointOfSegment', function() {

		it('should throw error when segmentPoints is undefined', function() {
			expect(function() {
				SegmentServices.calculateDistanceFromStartForEachPointOfSegment(undefined, undefined);
			}).toThrowError('segmentPoints is undefined');
		});

		it('should return segment point with a good distance from start set', function() {
			spyOn(RouteUtils, "calculateDistanceBetween2Points").and.returnValue(2);
			expect(SegmentServices.calculateDistanceFromStartForEachPointOfSegment(mockSegment.points, mockPoint)).toEqual([{
				latlng: {
					mb: 45.3,
					nb: 1.3
				},
				elevation: 0,
				distanceFromStart: 2,
				grade: 0,
				segmentId: '110E8400-E29B-11D4-A716-446655440000'
			}, {
				latlng: {
					mb: 45.4,
					nb: 1.4
				},
				elevation: 0,
				distanceFromStart: 4,
				grade: 0,
				segmentId: '110E8400-E29B-11D4-A716-446655440000'
			}]);
		});
	});

	describe('createSimpleSegment', function() {

		it('should throw error when startLatlng is undefined', function() {
			expect(function() {
				var destinationLatlng = new google.maps.LatLng(45.4, 1.3);
				SegmentServices.createSimpleSegment(undefined, destinationLatlng);
			}).toThrowError('start Latlng is undefined');
		});

		it('should throw error when destinationLatlng is undefined', function() {
			expect(function() {
				var startLatlng = new google.maps.LatLng(45.3, 1.3);
				SegmentServices.createSimpleSegment(startLatlng, undefined);
			}).toThrowError('destination Latlng is undefined');
		});

		it('should throw error when startLatlng is not an instance of google.maps.LatLng', function() {
			expect(function() {
				var destinationLatlng = new google.maps.LatLng(45.4, 1.3);
				SegmentServices.createSimpleSegment({}, destinationLatlng);
			}).toThrowError('start Latlng is not instance of google.maps.Latlng');
		});

		it('should throw error when destinationLatlng is not an instance of google.maps.LatLng', function() {
			expect(function() {
				var startLatlng = new google.maps.LatLng(45.3, 1.3);
				SegmentServices.createSimpleSegment(startLatlng, {});
			}).toThrowError('destination Latlng is not instance of google.maps.Latlng');
		});

		it('should throw error when calculate distance failed', function() {

			var startLatlng = new google.maps.LatLng(45.3, 1.3);
			var destinationLatlng = new google.maps.LatLng(45.4, 1.3);

			spyOn(RouteUtils, "calculateDistanceBetween2Points").and.throwError();
			spyOn(RouteUtils, 'generateUUID').and.returnValue("110E8400-E29B-11D4-A716-446655440000");

			expect(SegmentServices.createSimpleSegment(startLatlng, destinationLatlng)).toEqual({
				segmentId: '110E8400-E29B-11D4-A716-446655440000',
				points: [{
					latlng: {
						mb: 45.4,
						nb: 1.2999999999999545
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}],
				distance: 0
			});
		});

		it('should return new simple segment', function() {

			var startLatlng = new google.maps.LatLng(45.3, 1.3);
			var destinationLatlng = new google.maps.LatLng(45.4, 1.3);

			spyOn(RouteUtils, "calculateDistanceBetween2Points").and.returnValue(2);
			spyOn(RouteUtils, 'generateUUID').and.returnValue("110E8400-E29B-11D4-A716-446655440000");

			expect(SegmentServices.createSimpleSegment(startLatlng, destinationLatlng)).toEqual({
				segmentId: '110E8400-E29B-11D4-A716-446655440000',
				points: [{
					latlng: {
						mb: 45.4,
						nb: 1.2999999999999545
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}],
				distance: 2
			});
		});
	});

	describe('getLastSegment', function() {

		it('should throw error when segments is undefined', function() {
			expect(function() {
				SegmentServices.getLastSegment(undefined);
			}).toThrowError('segments is undefined');
		});

		it('should throw error when segments is undefined', function() {
			expect(function() {
				SegmentServices.getLastSegment([]);
			}).toThrowError('segments must contains at least 1 segment');
		});

		it('should return last segment', function() {
			expect(SegmentServices.getLastSegment(mockSegments)).toEqual(mockSegments[mockSegments.length-1]);
		});

	});

});
