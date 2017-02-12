"use strict";

angular.module("nextrunApp.commons").factory("GmapsApiService",
    function() {

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
            PlacesServices: function(attrContainer) {
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
            }
        };
    });