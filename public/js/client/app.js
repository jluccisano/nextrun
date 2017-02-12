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
      when('/myraces', {
          templateUrl: 'partials/race/myraces',
          controller: 'MyRacesCtrl'
        }).
      when('/users/settings', {
          templateUrl: 'partials/user/settings',
          controller: 'SettingsCtrl'
        }).
      otherwise({
          redirectTo: '/'
        });

  }]);

nextrunApp.run(['$rootScope','$templateCache', function($rootScope, $templateCache) {

  $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        //$rootScope.menuUrl = null;
        //$rootScope.menuUrl = "partials/menu";
        //$rootScope.refresh();
        //$templateCache.put('partials/menu');

    });

}]);