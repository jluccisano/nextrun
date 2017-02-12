angular.module('nextrunApp').directive('hasLocation', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ctrl) {
      function validate(viewValue) {
        ctrl.$setValidity('validLocation', false);

        return viewValue;
      }

      scope.$watch('details', function(newValue, oldValue) {
        if (newValue !== undefined && newValue.geometry !== undefined && newValue.department !== undefined && newValue.name !== undefined) {
          ctrl.$setValidity('validLocation', true);
        } else {
          ctrl.$setValidity('validLocation', false);
          return undefined;
        }

      });

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.unshift(validate)
    }
  };
});