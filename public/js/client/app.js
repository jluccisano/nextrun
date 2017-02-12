var nextrunApp = angular.module('nextrunApp', [
  'ngRoute',
  'ngAnimate',
  'nextrunControllers'
]);


nextrunApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
          templateUrl: 'partials/home',
          controller: 'HomeCtrl'
        }).
      when('/login', {
          templateUrl: 'partials/login',
          controller: 'LoginCtrl'
        }).
      otherwise({
          redirectTo: '/'
        });

  }]);