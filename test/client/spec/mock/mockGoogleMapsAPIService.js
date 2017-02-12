"use strict";

angular.module("mockModule").factory("mockGoogleMapsAPIService",
	function() {

		return {
			Autocomplete: function() {
				return {
					setTypes: function() {

					},
					setBounds: function() {

					},
					setComponentRestrictions: function() {

					},
					getPlace: function() {
						return {
							name: "Montgaillard-Lauragais",
							address_components: undefined,
							geometry: {
								location: {
									lat: function() {
										return 45.3;
									},
									lng: function() {
										return 1.34;
									}
								}
							}
						};
					}
				};
			},
			addListener: function(handler) {
				//execute handler
				handler();
			},
			AutocompleteService: function() {
				return {
					getPlacePredictions: function(request, callback) {
						callback([{
							reference: "toto"
						}], "OK");
					}
				};
			},
			PlacesService: function() {
				return {
					getDetails: function(attrContainer, detailsresult) {
						detailsresult({
							formatted_address: "Montgaillard-Lauragais, France",
							name: "Montgaillard-Lauragais",
							geometry: {
								location: {
									lat: function() {
										return 45.3;
									},
									lng: function() {
										return 1.34;
									}
								}
							}
						}, "OK");
					}
				};
			},
			Polyline: function() {
				return {
					setMap: function() {}
				};
			},
			LatLngBounds: function() {
				return true;
			}
		};
	});