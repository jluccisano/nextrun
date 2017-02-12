var nextrunApp = angular.module('nextrunApp', [
  'ngRoute',
  'ngAnimate',
  'nextrunControllers'
]);

/** Initialize i18n **/
jQuery.i18n.init({ lng: "fr" });


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
      when('/signup', {
          templateUrl: 'partials/signup',
          controller: 'SignupCtrl'
        }).
      otherwise({
          redirectTo: '/'
        });

  }]);