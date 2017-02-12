"use strict";

angular.module("nextrunApp.commons").directive("multiselectDropdown", [

    function() {
        return function(scope, element, attributes) {

            var buildButtonText = function(options) {
                if (options.length === 0) {
                    return "Types d'épreuves <b class='caret'></b>";
                } else if (options.length > 2) {
                    return options.length + " sélectionnés <b class='caret'></b>";
                } else {
                    var selected = "";
                    options.each(function() {
                        selected += jQuery(this).text() + ", ";
                    });
                    return selected.substr(0, selected.length - 2) + " <b class='caret'></b>";
                }
            };

            element = $(element[0]); // Get the element as a jQuery element

            // Below setup the dropdown:
            element.multiselect({
                enableFiltering: false,
                maxHeight: 200,
                filterBehavior: "both",
                includeSelectAllOption: false,
                selectAllText: "Toute la France",
                selectAllValue: "Toute la France",
                buttonContainer: "<div class='input-group btn-group'/>",
                buttonText: buildButtonText,
            });
            // Watch for any changes to the length of our select element
            scope.$watch(function() {
                return element[0].length;
            }, function() {
                element.multiselect("rebuild");
            });

            // Watch for any changes from outside the directive and refresh
            scope.$watch(attributes.ngModel, function() {
                element.multiselect("refresh");
            });
        };
    }
]);