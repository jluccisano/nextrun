"use strict";

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * + ng-model - autocomplete textbox value
 *
 * + details - more detailed autocomplete result, includes address parts, latlng, etc. (Optional)
 *
 * + options - configuration for the autocomplete (Optional)
 *
 *       + types: type,        String, values can be "geocode", "establishment", "(regions)", or "(cities)"
 *       + bounds: bounds,     Google maps LatLngBounds Object, biases results to bounds, but may return results outside these bounds
 *       + country: country    String, ISO 3166-1 Alpha-2 compatible country code. examples; "ca", "us", "gb"
 *       + watchEnter:         Boolean, true; on Enter select top autocomplete result. false(default); enter ends autocomplete
 *
 * example:
 *
 *    options = {
 *        types: "(cities)",
 *        country: "ca"
 *    }
 **/
angular.module("nextrunApp.commons").directive("gmapsAutocomplete",
  function(GmapsApiService) {

    return {
      restrict: "A",
      require: "ngModel",
      scope: {
        ngModel: "=",
        options: "=",
        details: "=?"
      },

      link: function(scope, element, attrs, controller) {

        scope.gPlace = undefined;

        //options for autocomplete
        var opts;
        //convert options provided to opts

        //function to get retrieve the autocompletes first result using the AutocompleteService 
        scope.getPlace = function(result) {
          var autocompleteService = GmapsApiService.AutocompleteService();
          if (result.name.length > 0) {
            autocompleteService.getPlacePredictions({
                input: result.name,
                offset: result.name.length
              },
              function listentoresult(list) {
                if (list === null || list.length === 0) {

                  scope.$apply(function() {
                    scope.details = null;
                  });

                } else {
                  var placesService = GmapsApiService.PlacesService(element[0]);
                  placesService.getDetails({
                      "reference": list[0].reference
                    },
                    function detailsresult(detailsResult, placesServiceStatus) {

                      if (placesServiceStatus === google.maps.GeocoderStatus.OK) {
                        scope.$apply(function() {

                          controller.$setViewValue(detailsResult.formatted_address);
                          element.val(detailsResult.formatted_address);

                          scope.details = scope.getDetails(detailsResult);

                          //on focusout the value reverts, need to set it again.
                          element.on("focusout", function() {
                            element.val(detailsResult.formatted_address);
                            element.unbind("focusout");
                          });

                        });
                      }
                    }
                  );
                }
              });
          }
        };

        scope.getDetails = function(result) {

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



        var initOpts = function() {

          opts = {};
          if (scope.options) {

            if (scope.options.watchEnter) {
              scope.watchEnter = true;
            } else {
              scope.watchEnter = false;
            }

            if (scope.options.types) {
              opts.types = [];
              opts.types.push(scope.options.types);
              scope.gPlace.setTypes(opts.types);
            } else {
              scope.gPlace.setTypes([]);
            }

            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds;
              scope.gPlace.setBounds(opts.bounds);
            } else {
              scope.gPlace.setBounds(null);
            }

            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              };
              scope.gPlace.setComponentRestrictions(opts.componentRestrictions);
            } else {
              scope.gPlace.setComponentRestrictions(null);
            }
          }
        };

        if (scope.gPlace === undefined) {
          scope.gPlace = GmapsApiService.Autocomplete(element[0], {});
        }
        GmapsApiService.addListener(scope.gPlace, "place_changed", function() {
          var result = scope.gPlace.getPlace();
          if (result !== undefined) {
            if (result.address_components !== undefined) {

              scope.$apply(function() {

                scope.details = scope.getDetails(result);

                controller.$setViewValue(element.val());
              });
            } else {
              if (!scope.watchEnter) {
                scope.getPlace(result);
              }
            }
          }
        });



        controller.$render = function() {
          var location = controller.$viewValue;
          element.val(location);
        };

        //watch options provided to directive
        scope.watchOptions = function() {
          return scope.options;
        };
        scope.$watch(scope.watchOptions, function() {
          initOpts();
        }, true);

      }
    };
  });