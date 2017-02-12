"use strict";

angular.module("nextrunApp.commons").directive("nrHasLocation", function() {
  return {
    restrict: "A",
    prioriy: "1",
    require: "?ngModel",
    link: function(scope, element, attrs, ctrl) {
      function validate(viewValue) {
        ctrl.$setValidity("validLocation", false);
        return viewValue;
      }

      scope.$watch(attrs.details, function(newValue) {
        if (newValue !== undefined && newValue.location !== undefined && newValue.department !== undefined && newValue.name !== undefined) {
          ctrl.$setValidity("validLocation", true);
        } else {
          ctrl.$setValidity("validLocation", false);
          return undefined;
        }

      });

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.unshift(validate);
    }
  };
});