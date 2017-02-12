var nextrunApp = angular.module('nextrunApp', [
  'ngCookies',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'google-maps',
  'highcharts-ng',
  'ui.bootstrap.datetimepicker',
  'ui.dateTimeInput',
  'AngularGM',
  'textAngular',
  'ngSanitize',
  'ngAutocomplete',
  'angularSpinner'
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
      access: access.public
    }).
    when('/login', {
      templateUrl: '/partials/login',
      controller: 'LoginCtrl',
      access: access.public
    }).
    when('/signup', {
      templateUrl: '/partials/signup',
      controller: 'SignupCtrl',
      access: access.public
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
      access: access.public
    }).
    when('/races/home', {
      templateUrl: '/partials/race/home',
      controller: 'RaceHomeCtrl',
      access: access.public
    }).
    when('/races/view/:raceId', {
      templateUrl: '/partials/race/view',
      controller: 'ViewRaceCtrl',
      access: access.public
    }).
    when('/races/edit/:raceId', {
      templateUrl: '/partials/race/edit',
      controller: 'EditRaceCtrl',
      access: access.user
    }).
    when('/races/search', {
      templateUrl: '/partials/race/search',
      controller: 'SearchRaceCtrl',
      access: access.public
    }).
    when('/credits', {
      templateUrl: '/partials/credits',
      controller: 'CreditCtrl',
      access: access.public
    }).
    when('/about', {
      templateUrl: '/partials/about',
      controller: 'AboutCtrl',
      access: access.public
    }).
    when('/contacts', {
      templateUrl: '/partials/contacts',
      controller: 'ContactCtrl',
      access: access.public
    }).
    when('/races/departments/:departments', {
      templateUrl: '/partials/race/search',
      controller: 'SearchRaceCtrl',
      access: access.public
    }).when('/404', {
      templateUrl: '/partials/errors/404',
      access: access.public
    });

    $routeProvider.otherwise({
      redirectTo: '/404'
    });

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

nextrunApp.run(['$rootScope', '$location', 'Auth', 'Alert',
  function($rootScope, $location, Auth, Alert) {
    'use strict';

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      
      $rootScope.error = null;

      if (!Auth.authorize(next.access)) {
        if (Auth.isLoggedIn()) {
          $location.path('/');
        } else {
          $location.path('/login');
        }

        Alert.add("danger", "Vous n'êtes pas autorisé à consulter cette page", 3000);
      }
    });

  }
]);