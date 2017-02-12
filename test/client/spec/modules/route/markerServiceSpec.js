'use strict';

describe('Marker Services', function() {

	var $scope, MarkerServices, mockMarkers;

	beforeEach(module('routeBuilder', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _MockFactory_, _MarkerServices_) {
		$scope = _$rootScope_.$new();
		MarkerServices = _MarkerServices_;
		mockMarkers = _MockFactory_.getMockMarkers();
	}));

	describe('createMarker', function() {

		it('should throw error when latLng is not an instance of google.maps.LatLng', function() {
			expect(function() {
				MarkerServices.createMarker(undefined, 'icon.png', 'icon title');
			}).toThrowError('latLng is not instance of google.maps.Latlng');
		});

		it('should create new marker with success', function() {
			expect(MarkerServices.createMarker(new google.maps.LatLng(45.0, 1.0), 'icon.png', 'icon title')).toEqual({
				latitude: 45,
				longitude: 1,
				icon: 'icon.png',
				title: 'icon title'
			});
		});
	});

	describe('getLastMarker', function() {

		it('should throw error when markers is undefined', function() {
			expect(function() {
				MarkerServices.getLastMarker(undefined);
			}).toThrowError('markers array must contain at least one element');
		});

		it('should throw error when markers length is equal to 0', function() {
			expect(function() {
				MarkerServices.getLastMarker([]);
			}).toThrowError('markers array must contain at least one element');
		});

		it('should get last marker with success', function() {

			expect(MarkerServices.getLastMarker(mockMarkers)).toEqual({
				latitude: 45,
				longitude: 1,
				icon: 'icon.png',
				title: 'icon title'
			});
		});
	});

	describe('removeLastMarker', function() {

		it('should throw error when markers is not a valid array', function() {
			expect(function() {
				MarkerServices.removeLastMarker([]);
			}).toThrowError('markers array must contain at least one element');
		});

		it('should remove last marker with success', function() {

			var markers = mockMarkers;

			MarkerServices.removeLastMarker(markers);

			expect(markers.length).toEqual(1);
			expect(markers[0]).toEqual({
				latitude: 44,
				longitude: 1,
				icon: 'icon.png',
				title: 'icon title'
			});

		});

	});

});