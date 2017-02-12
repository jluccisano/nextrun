angular.module("nextrunApp.commons").directive('nrUniqueParticipant', function(WorkoutService) {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope : {
      workout: "=workout"
    },
    link: function(scope, el, attrs, ctrl) {

      ctrl.$parsers.push(function(viewValue) {

        if (viewValue) {
          WorkoutService.checkIfParticipantAvailable(scope.workout._id, {
            email: viewValue
          }).then(function(response) {
            var workouts = response.data.items;
            if (workouts && workouts.length === 0) {
              ctrl.$setValidity('uniqueParticipant', true);
            } else {
              ctrl.$setValidity('uniqueParticipant', false);
            }
          });
          return viewValue;
        }
      });
    }
  };
});