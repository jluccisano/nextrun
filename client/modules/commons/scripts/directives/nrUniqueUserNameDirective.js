angular.module("nextrunApp.commons").directive('nrUniqueUserName', function(AuthService) {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope : {
      user: "=user"
    },
    link: function(scope, el, attrs, ctrl) {

      ctrl.$parsers.push(function(viewValue) {

        if (viewValue) {
          AuthService.checkIfUserNameAvailable(scope.user.id, {
            name: viewValue
          }).then(function(response) {
            var users = response.data.items;
            if (users && users.length === 0) {
              ctrl.$setValidity('uniqueUserName', true);
            } else {
              ctrl.$setValidity('uniqueUserName', false);
            }
          });
          return viewValue;
        }
      });
    }
  };
});