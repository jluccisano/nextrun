"use strict";

angular.module("nextrunApp.commons").factory("GmapsApiService",
    function($q) {

        var getDetails = function(result) {

            var place = {};

            if (result.name) {
                place.name = result.name;
            }

            if (result.types && result.types.length > 0) {
                place.place_type = result.types[0];
            }

            if (result.geometry) {
                place.location = {
                    latitude: result.geometry.location.lat(),
                    longitude: result.geometry.location.lng()
                };
            }

            if (result.address_components) {
                angular.forEach(result.address_components, function(component) {

                    angular.forEach(component.types, function(type) {

                        if ("locality" === type) {
                            place.locality = component.short_name;
                        }

                        if ("administrative_area_level_2" === type) {
                            place.administrative_area_level_2 = component.short_name;
                        }

                        if ("administrative_area_level_1" === type) {
                            place.administrative_area_level_1 = component.short_name;
                        }

                        if ("country" === type) {
                            place.country = component.short_name;
                        }

                    });
                });

            }
            return place;
        };

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
            getPlace: function(latlng) {
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
                    "latLng": latlng
                }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var details = getDetails(results[1]);
                            deferred.resolve(details);
                        }
                    } else {
                        result.message = 'Une erreur est survenue: ' + status;

                        deferred.reject(result);
                    }

                });
                return deferred.promise;
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