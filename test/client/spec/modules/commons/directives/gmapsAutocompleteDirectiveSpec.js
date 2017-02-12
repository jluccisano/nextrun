'use strict';
describe('ngAutocomplete Directive', function() {

	var $scope, $compile, element, mockGoogleMapsAPIServices;

	beforeEach(module('gmAutocomplete', function($provide) {

		mockGoogleMapsAPIServices = {
			Autocomplete: function(element, options) {
				return {
					setTypes: function(array) {

					},
					setBounds: function(array) {

					},
					setComponentRestrictions: function(array) {

					},
					getPlace: function() {
						return {
							name: 'Montgaillard-Lauragais',
							geometry: {
								location: {
									lat: function() {
										return 45.3
									},
									lng: function() {
										return 1.34
									}
								}
							},
							address_components: [{
								types: ["administrative_area_level_2"],
								short_name: "31"
							}, {
								types: ["country"],
								short_name: "FR"
							}]
						};
					}
				}
			},
			addListener: function(instance, eventName, handler) {
				//execute handler
				handler();
			},
			AutocompleteService: function() {
				return {
					getPlacePredictions: function(request, callback) {
						callback([{
							reference: 'toto'
						}], 'OK');
					}
				}
			},
			PlacesService: function(element) {
				return {
					getDetails: function(attrContainer, detailsresult) {
						detailsresult({
							formatted_address: 'Montgaillard-Lauragais, France',
							geometry: {
								location: {
									lat: function() {
										return 45.3
									},
									lng: function() {
										return 1.34
									}
								}
							},
							address_components: [{
								types: ["administrative_area_level_2"],
								short_name: "31"
							}, {
								types: ["country"],
								short_name: "FR"
							}]
						}, 'OK');
					}
				}
			}
		}
		spyOn(mockGoogleMapsAPIServices, 'Autocomplete').and.callThrough();
		spyOn(mockGoogleMapsAPIServices, 'addListener').and.callThrough();
		spyOn(mockGoogleMapsAPIServices, 'PlacesService').and.callThrough();
		spyOn(mockGoogleMapsAPIServices, 'AutocompleteService').and.callThrough();

		$provide.value('GoogleMapsAPIServices', mockGoogleMapsAPIServices);
	}));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	describe('ngAutocomplete', function() {

		beforeEach(inject(function(_$compile_, _$rootScope_) {
			var template = '<input name="location" ng-model="race.pin.name" options="options" details="details" ng-autocomplete>';
			element = angular.element(template);
			$compile(element)($scope);
		}));

		it('test with watchenter = false ', function() {

			$scope.options = {
				country: "fr",
				types: "(cities)",
				watchEnter: false
			};

			$scope.$digest();

		});

		it('test with watchEnter = true ', function() {


			$scope.options = {
				country: "fr",
				types: "(cities)",
				bounds: [],
				watchEnter: true
			};

			$scope.$digest();

			element.triggerHandler('focusout');

			$scope.options = {
				country: undefined,
				types: undefined,
				watchEnter: true
			};

			$scope.$digest();

			expect($scope.details).toEqual({
				name: 'Montgaillard-Lauragais',
				department: {
					code: '31',
					name: 'Haute-Garonne',
					region: 'Midi-Pyrénées',
					center: {
						latitude: 43.468868,
						longitude: 1.141754
					}
				},
				location: {
					lat: 45.3,
					lon: 1.34
				}
			});
		});
	});


});