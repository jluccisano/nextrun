"use strict";

angular.module("nextrunApp.commons").factory("GmapsApiService",
    function($q) {

        return {
            Autocomplete: function(element, options) {
                return new google.maps.places.Autocomplete(element, options);
            },
            addListener: function(instace, eventName, handler) {
                return google.maps.event.addListener(instace, eventName, handler);
            },
            AutocompleteService: function() {
                return new google.maps.places.AutocompleteService();
            },
            PlacesService: function(attrContainer) {
                return new google.maps.places.PlacesService(attrContainer);
            },
            DirectionsService: function() {
                return new google.maps.DirectionsService();
            },
            ElevationService: function() {
                return new google.maps.ElevationService();
            },
            Polyline: function(params) {
                return new google.maps.Polyline(params);
            },
            LatLngBounds: function() {
                return new google.maps.LatLngBounds();
            },
            LatLng: function(latitude, longitude) {
                return new google.maps.LatLng(latitude, longitude);
            },
            getLocation: function(address) {
                var deferred = $q.defer();

                var result = {
                    success: false,
                    message: "",
                    location: {
                        latitude: "",
                        longitude: ""
                    }
                };

                var googleMap = new google.maps.Geocoder();
                googleMap.geocode({
                    'address': address
                }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {

                        result.success = true;
                        result.location.latitude = results[0].geometry.location.lat();
                        result.location.longitude = results[0].geometry.location.lng();

                        deferred.resolve(result);

                    } else {

                        result.message = 'Une erreur est survenue: ' + status;

                        deferred.reject(result);
                    }

                });
                return deferred.promise;
            }
        };
    });