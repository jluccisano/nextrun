"use strict";

var nextrunApp = angular.module("nextrunApp", [
  "ngRoute",
  "gettext",
  "ng.httpLoader",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.alert",
  "nextrunApp.commons",
  "nextrunApp.auth",
  "nextrunApp.race",
  "nextrunApp.home"
]);

nextrunApp.config(
  function(
    $routeProvider,
    $locationProvider,
    $httpProvider,
    httpMethodInterceptorProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.
    when("/credits", {
      templateUrl: "/partials/main/credits",
      controller: "CreditController",
      access: access.public
    }).
    when("/about", {
      templateUrl: "/partials/main/about",
      controller: "AboutController",
      access: access.public
    }).
    when("/contacts", {
      templateUrl: "/partials/main/contacts",
      controller: "ContactController",
      access: access.public
    }).
    when("/404", {
      templateUrl: "/partials/errors/404",
      access: access.public
    });

    $routeProvider.otherwise({
      redirectTo: "/404"
    });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push("ErrorHandlerInterceptor");

    httpMethodInterceptorProvider.whitelistDomain("/api/races/find/page/1");
  });

nextrunApp.run(function(
  $rootScope,
  $location,
  SharedMetaService,
  AuthService,
  AlertService,
  MetaService,
  gettextCatalog) {

  $rootScope.$on("$routeChangeStart", function(event, next) {

    MetaService.loading();

    if (!AuthService.authorize(next.access)) {
      if (AuthService.isLoggedIn()) {
        $location.path("/");
      } else {
        $location.path("/login");
      }

      AlertService.add(gettextCatalog.getString("Danger"), gettextCatalog.getString("Vous n'êtes pas autorisé à consulter cette page"), 3000);
    }
  });

  gettextCatalog.currentLanguage = 'en';
  gettextCatalog.debug = true;
});