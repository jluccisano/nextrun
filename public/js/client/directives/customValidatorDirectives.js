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
        if (newValue !== undefined && newValue.geometry !== undefined) {
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

angular.module('nextrunApp').directive('isDate', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
      function validate(value) {

        //var d = Date.parse(value);
        var m = moment(value, "DD MMMM YYYY");

        // it is a date
        if (m.isValid()) { // d.valueOf() could also work
          ngModel.$setValidity('validDate', true);
          return value;
        } else {
          ngModel.$setValidity('validDate', false);
          return undefined;
        }
      }
     // ctrl.$parsers.unshift(validate);
     // ctrl.$formatters.unshift(validate)
      scope.$watch(function() {
        return ngModel.$viewValue;
      }, validate);
    }
  };
});