var nextrunApp = angular.module('nextrunApp', [
  'ngRoute',
  'nextrunAnimations',
  'nextrunControllers'
]);

nextrunApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
          templateUrl: 'partials/home',
          controller: 'HomeCtrl'
        }).
      otherwise({
          redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
  }]);