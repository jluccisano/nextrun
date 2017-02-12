angular.module('nextrunApp').directive('hasLocation', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (viewValue) {
          // it is valid
          ctrl.$setValidity('hasLocation', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('hasLocation', false);
          return undefined;
        }
      });
    }
  };
});