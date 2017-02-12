angular.module("nextrunApp.commons").directive('nrUniquePseudo', function() {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope: {
      participants: "=participants"
    },
    link: function(scope, el, attrs, ctrl) {

      ctrl.$parsers.push(function(viewValue) {

        if (viewValue) {

          var pseudoMatch = [];

          angular.forEach(scope.participants, function(participant) {

            if (participant.pseudo === viewValue) {
              pseudoMatch.push(participant.pseudo);
            }

          });

          if (pseudoMatch && pseudoMatch.length === 0) {
            ctrl.$setValidity('uniquePseudo', true);
          } else {
            ctrl.$setValidity('uniquePseudo', false);
          }

          return viewValue;
        }
      });
    }
  };
});