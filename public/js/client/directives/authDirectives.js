angular.module('nextrunApp')
.directive('accessLevel', ['Auth', function(Auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                if(user.role)
                    userRole = user.role;
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {
                if(al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
                if(userRole && accessLevel) {
                    if(!Auth.authorize(accessLevel, userRole))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);

angular.module('nextrunApp').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);

angular.module('nextrunApp').directive('match', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      
      scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function(value){
        ctrl.$setValidity('match', value[0] === value[1] );
      }, true);

    }
  }
}]);

angular.module('nextrunApp').directive('uniqueEmail', ['$http','Auth','Alert', function($http,Auth,Alert) {  
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      
              scope.busy = false;
              scope.$watch(attrs.ngModel, function(value) {
                
                // hide old error messages
                ctrl.$setValidity('isTaken', true);
                ctrl.$setValidity('invalidChars', true);
                
                if (!value) {
                  // don't send undefined to the server during dirty check
                  // empty username is caught by required directive
                  return;
                }
                
                scope.busy = true;

                Auth.checkEmail({
                        email: value
                },
                function(res) {
                    scope.busy = false;

                },
                function(error) {
                     // display new error message
                    //if (data.isTaken) {
                      ctrl.$setValidity('isTaken', false);
                    //} else if (data.invalidChars) {
                    //  ctrl.$setValidity('invalidChars', false);
                    //}

                    scope.busy = false;
                });
            })
        }
    }
}]);
