"use strict";

var authModule = angular.module("nextrunApp.auth", ["ui.bootstrap",
  "ngRoute",
  "ngCookies",
  "pascalprecht.translate",
  "nextrunApp.commons"
]);

authModule.config(
  function(
    $routeProvider,
    $locationProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.
    when("/login", {
      templateUrl: "/partials/auth/login",
      controller: "LoginController",
      access: access.public
    }).
    when("/signup", {
      templateUrl: "/partials/auth/signup",
      controller: "SignupController",
      access: access.public
    }).
    when("/users/settings", {
      templateUrl: "/partials/auth/settings",
      controller: "SettingsController",
      access: access.user
    });

    $routeProvider.otherwise({
      redirectTo: "/404"
    });

    $locationProvider.html5Mode(true);

  });