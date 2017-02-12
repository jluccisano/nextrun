angular.module('mockModule').factory('mockGoogleMapsAPIServices',
	function() {
		'use strict';

		return {
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
							address_components: undefined,
							geometry: {
								location: {
									lat: function() {
										return 45.3
									},
									lng: function() {
										return 1.34
									}
								}
							}
						}
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
							}
						}, 'OK');
					}
				}
			},
			Polyline: function(params) {
				return {
					setMap: function(map) {

					}
				}
			},
			LatLngBounds: function() {
				return true;
			}
		}
	});