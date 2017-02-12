var nextrunApp = angular.module('nextrunApp', [
  'ngCookies',
  'ngRoute',
  'ngAnimate',
  'nextrunControllers',
  'ui.bootstrap',
  'google-maps'
]);

/** Initialize i18n **/
jQuery.i18n.init({
  lng: "fr"
});


nextrunApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    'use strict';
    var access = routingConfig.accessLevels;

    $routeProvider.
    when('/', {
      templateUrl: '/partials/home',
      controller: 'HomeCtrl',
      access: access.anon
    }).
    when('/login', {
      templateUrl: '/partials/login',
      controller: 'LoginCtrl',
      access: access.anon
    }).
    when('/signup', {
      templateUrl: '/partials/signup',
      controller: 'SignupCtrl',
      access: access.anon
    }).
    when('/myraces', {
      templateUrl: '/partials/race/myraces',
      controller: 'MyRacesCtrl',
      access: access.user
    }).
    when('/users/settings', {
      templateUrl: '/partials/user/settings',
      controller: 'SettingsCtrl',
      access: access.user
    }).
    when('/races/create', {
      templateUrl: '/partials/race/create',
      controller: 'CreateRaceCtrl',
      access: access.user
    }).
    when('/races/edit/:raceId', {
      templateUrl: '/partials/race/edit',
      controller: 'EditRaceCtrl',
      access: access.user
    }).
    when('/edit/map', {
      templateUrl: '/partials/race/map',
      controller: 'MapCtrl',
      access: access.public
    }).
    when('/404', {
      templateUrl: '/errors/404',
      access: access.public
    });

    /*$routeProvider.otherwise({
      redirectTo: '/404'
    });*/

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q',
      function($location, $q) {
        function success(response) {
          return response;
        }

        function error(response) {

          if (response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }

        return function(promise) {
          return promise.then(success, error);
        }
      }
    ];

    $httpProvider.responseInterceptors.push(interceptor);


  }
]);

nextrunApp.run(['$rootScope', '$location', 'Auth',
  function($rootScope, $location, Auth) {
    'use strict';
    /*$rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.error = null;
        if (!Auth.authorize(next.access)) {
            if(Auth.isLoggedIn()) {
              $location.path('/');
            } else {
              $location.path('/login');
            }
        }
    });*/

  }
]);