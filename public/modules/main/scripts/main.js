"use strict";

var nextrunApp = angular.module("nextrunApp", [
  "ngRoute",
  "ui.bootstrap",
  "pascalprecht.translate",
  "nextrunApp.auth",
  "nextrunApp.race",
  "nextrunApp.home",
  "nextrunApp.commons"
]);

nextrunApp.config(
  function(
    $routeProvider,
    $locationProvider,
    $translateProvider) {

    $translateProvider.preferredLanguage("fr-FR");

    $translateProvider.useLoader("$translatePartialLoader", {
      urlTemplate: "/locales/{lang}/{part}.json"
    });

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

  });

nextrunApp.run(function(
  $rootScope,
  $location,
  $translate,
  $translatePartialLoader,
  SharedMetaService,
  AuthService,
  AlertService,
  MetaService) {

  $rootScope.$on("$routeChangeStart", function(event, next) {

    //loading state
    MetaService.loading();

    if (!AuthService.authorize(next.access)) {
      if (AuthService.isLoggedIn()) {
        $location.path("/");
      } else {
        $location.path("/login");
      }

      AlertService.add("danger", "Vous n'êtes pas autorisé à consulter cette page", 3000);
    }
  });

  $rootScope.$on("$translatePartialLoaderStructureChanged", function() {
    $translatePartialLoader.addPart("common");
    $translate.refresh();
  });

});