angular.module("nextrunApp.commons").directive('nrUniqueRace', function(RaceService) {
  return {
    require: 'ngModel',
    restrict: 'A',
    scope : {
      race: "=race"
    },
    link: function(scope, el, attrs, ctrl) {

      ctrl.$parsers.push(function(viewValue) {

        if (viewValue) {
          RaceService.checkIfRaceNameAvailable(scope.race._id, {
            name: viewValue
          }).then(function(response) {
            var races = response.data.items;
            if (races && races.length === 0) {
              ctrl.$setValidity('uniqueRace', true);
            } else {
              ctrl.$setValidity('uniqueRace', false);
            }
          });
          return viewValue;
        }
      });
    }
  };
});