'use strict';

describe('GPX Services', function() {

	var $scope, GpxServices, RouteUtils, mockSegments, SegmentServices, ElevationServices, GoogleMapsAPIServices;

	beforeEach(module('mockModule'));

	beforeEach(module('routeBuilder', function($provide) {

		var mockXmlParserService = {
			xml2json: function(gpx) {
				return {
					gpx: {
						trk: {
							trkseg: {
								trkpt: [{
									_lat: 43.24246,
									_lon: 1.9221,
									ele: 294
								}, {
									_lat: 43.24584,
									_lon: 1.92577,
									ele: 304
								}, {
									_lat: 43.24875,
									_lon: 1.9305,
									ele: 334
								}, {
									_lat: 43.24895,
									_lon: 1.93205,
									ele: 336
								}]
							}
						}
					}
				}
			}
		};

		var mockGoogleMapsAPIServices = {
			ElevationService: function() {
				return true;
			},
			LatLng: function(lat, lng) {
				return new google.maps.LatLng(lat, lng);
			}
		}

		spyOn(mockXmlParserService, 'xml2json').and.callThrough();
		spyOn(mockGoogleMapsAPIServices, "ElevationService").and.callThrough();


		$provide.value('XmlParserService', mockXmlParserService);
		$provide.value('GoogleMapsAPIServices', mockGoogleMapsAPIServices);
	}));

	beforeEach(inject(function(_$rootScope_, _GpxServices_, _MockFactory_, _RouteUtils_, _SegmentServices_, _ElevationServices_, _GoogleMapsAPIServices_) {
		$scope = _$rootScope_.$new();
		GpxServices = _GpxServices_;
		RouteUtils = _RouteUtils_;
		SegmentServices = _SegmentServices_;
		ElevationServices = _ElevationServices_;
		GoogleMapsAPIServices = _GoogleMapsAPIServices_;
		mockSegments = _MockFactory_.getMockSegments();
	}));


	describe('getTrkpts', function() {

		it('should throw error when gpxToJson is invalid', function() {
			expect(function() {
				GpxServices.getTrkpts({});
			}).toThrowError("parse.gpx.error");
		});

		it('get trkpts with success', function() {

			var gpxToJson = {
				gpx: {
					trk: {
						trkseg: {
							trkpt: [{
								_lat: 43.24246,
								_lon: 1.9221,
								ele: 294
							}, {
								_lat: 43.24584,
								_lon: 1.92577,
								ele: 304
							}, {
								_lat: 43.24875,
								_lon: 1.9305,
								ele: 334
							}, {
								_lat: 43.24895,
								_lon: 1.93205,
								ele: 336
							}]
						}
					}
				}
			};

			expect(GpxServices.getTrkpts(gpxToJson)).toEqual(gpxToJson.gpx.trk.trkseg.trkpt);
		});
	});

	describe('splitTrkptsToSegments', function() {

		it('should throw error when trkpts is invalid', function() {
			expect(function() {
				GpxServices.splitTrkptsToSegments([]);
			}).toThrowError('trkpts must contain at least one element');
		});

		it('get trkpts with success', function() {

			var trkpts = [{
				_lat: 43.24246,
				_lon: 1.9221,
				ele: 294
			}, {
				_lat: 43.24584,
				_lon: 1.92577,
				ele: 304
			}, {
				_lat: 43.24875,
				_lon: 1.9305,
				ele: 334
			}, {
				_lat: 43.24895,
				_lon: 1.93205,
				ele: 336
			}];

			spyOn(SegmentServices, "calculateDistanceFromStartForEachPointOfSegment").and.returnValue(5);
			spyOn(RouteUtils, 'generateUUID').and.returnValue("110E8400-E29B-11D4-A716-446655440000");
			spyOn(GoogleMapsAPIServices, 'LatLng').and.returnValue(new google.maps.LatLng(45.0, 1.0));

			expect(GpxServices.splitTrkptsToSegments(trkpts)).toEqual([]);
		});


	});



	describe('convertGPXToRoute', function() {


		it('Convert gpx with success', function() {

			var gpx = '<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="byHand" version="1.1"' +
				'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
				'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' +
				'<trkpt lat="39.921055008" lon="3.054223107">' +
				'<ele>12.863281</ele>' +
				'<time>2005-05-16T11:49:06Z</time>' +
				'<desc>lat.=38.102184, lon.=13.397982, Alt.=53.848454m. Speed=1.218126m/h.</desc>' +
				'<name>Cala Sant Vicenç - Mallorca</name>' +
				'<sym>City</sym>' +
				'</trkpt>' +
				'</gpx>';

			spyOn(GpxServices, "splitTrkptsToSegments").and.returnValue(mockSegments);

			spyOn(GpxServices, "getTrkpts").and.returnValue([{
				_lat: 43.24246,
				_lon: 1.9221,
				ele: 294
			}, {
				_lat: 43.24584,
				_lon: 1.92577,
				ele: 304
			}, {
				_lat: 43.24875,
				_lon: 1.9305,
				ele: 334
			}, {
				_lat: 43.24895,
				_lon: 1.93205,
				ele: 336
			}]);

			spyOn(RouteUtils, 'generateUUID').and.returnValue("110E8400-E29B-11D4-A716-446655440000");


			spyOn(SegmentServices, 'findSamplesPointIntoSegment').and.returnValue([{
				latlng: {
					mb: 45.3,
					nb: 1.3
				},
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: '110E8400-E29B-11D4-A716-446655440000'
			}, {
				latlng: {
					mb: 45.0,
					nb: 1.0
				},
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: '110E8400-E29B-11D4-A716-446655440000'
			}]);

			spyOn(ElevationServices, 'getAllLatlngFromPoints');

			spyOn(ElevationServices, 'getElevationFromLocation').and.callFake(function(request, callback) {
				callback([{
					elevation: 300
				}, {
					elevation: 400
				}], 'OK');
			});

			spyOn(ElevationServices, "getLastElevationPoint").and.returnValue({
				latlng: {
					mb: 45.2,
					nb: 1.2
				},
				elevation: 200,
				distanceFromStart: 0,
				grade: 0,
				segmentId: '110E8400-E29B-11D4-A716-446655440000'
			});

			spyOn(ElevationServices, "calculateElevationDataAlongRoute");
			spyOn(ElevationServices, "addPointsToElevationChart");
			spyOn(ElevationServices, "setGrade");

			expect(GpxServices.convertGPXtoRoute(gpx)).toEqual({
				segments: [{
					segmentId: '110E8400-E29B-11D4-A716-446655440000',
					points: [{
						latlng: {
							mb: 45.4,
							nb: 1.4
						},
						elevation: 0,
						distanceFromStart: 0,
						grade: 0,
						segmentId: '110E8400-E29B-11D4-A716-446655440000'
					}],
					distance: 2
				}],
				elevationPoints: [{
					latlng: {
						mb: 45.3,
						nb: 1.3
					},
					elevation: 300,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}, {
					latlng: {
						mb: 45,
						nb: 1
					},
					elevation: 400,
					distanceFromStart: 0,
					grade: 0,
					segmentId: '110E8400-E29B-11D4-A716-446655440000'
				}],
				chartConfig: {
					series: []
				}
			});

		});
	});

});