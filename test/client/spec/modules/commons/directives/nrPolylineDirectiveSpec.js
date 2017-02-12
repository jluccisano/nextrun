'use strict';

describe('map Directive', function() {

	var $scope, $compile, $timeout, element, mockGoogleMapsAPIServices;

	beforeEach(module('google-maps', function($provide) {

		mockGoogleMapsAPIServices = {
			Polyline: function(params) {
				return {
					setMap: function(map) {

					}
				}
			},
			LatLngBounds: function() {
				return {
					extend: function(point) {
						return {};
					}
				};
			},
			LatLng: function(latitude, longitude) {
				return {
					lat: 45.34,
					lon: 1.34
				};
			}
		}
		spyOn(mockGoogleMapsAPIServices, "Polyline").and.callThrough();
		spyOn(mockGoogleMapsAPIServices, "LatLngBounds").and.callThrough();
		spyOn(mockGoogleMapsAPIServices, "LatLng").and.callThrough();

		$provide.value('GoogleMapsAPIServices', mockGoogleMapsAPIServices);
	}));

	beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {

		$compile = _$compile_;
		$scope = _$rootScope_.$new();
		$timeout = _$timeout_;

		var googleMapElement = $compile("<google-map center='map.center' zoom='map.zoom'></google-map>")($scope);
		var googleMapController = googleMapElement.controller('googleMap');

		spyOn(googleMapController, 'getMap').and.callFake(function() {
			return {
				fitBounds: function() {
					return true;
				}
			}
		})

		var polylineElement = angular.element("<polylinecustom polylines='route.polylines'/>");
		googleMapElement.append(polylineElement);
		polylineElement = $compile(polylineElement)($scope);
	}));

	describe('map', function() {
		it('should return a invalid http', function() {
			$scope.route = {
				polylines: [{
					id: 1,
					path: [{
						latitude: 45.3,
						longitude: 1.2
					}],
					stroke: {
						color: "red",
						weight: 5
					},
					editable: false,
					draggable: false,
					geodesic: false,
					visible: true

				}]
			};

			$scope.map = {
				center: {
					latitude: 45,
					longitude: -73
				},
				zoom: 8
			};

			$scope.$digest();

			$timeout.flush();

			expect(mockGoogleMapsAPIServices.Polyline).toHaveBeenCalled();

			$scope.route.polylines.push({
				id: 2,
				path: [{
					latitude: 45.3,
					longitude: 1.2
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

			$scope.$digest();

			expect(mockGoogleMapsAPIServices.Polyline).toHaveBeenCalled();

		});
	});
});