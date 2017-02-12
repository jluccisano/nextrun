"use strict";

var nextrunApp = angular.module("nextrunApp", [
  "ui.router",
  "gettext",
  "angular-loading-bar",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.typeahead",
  "nextrunApp.commons",
  "nextrunApp.auth",
  "nextrunApp.race",
  "nextrunApp.home",
  "ezfb",
  "jlareau.pnotify",
  "services.config"
]);

nextrunApp.config(
  function(
    $stateProvider,
    $locationProvider,
    $logProvider,
    $urlRouterProvider,
    $httpProvider,
    configuration,
    ezfbProvider) {

    var access = routingConfig.accessLevels;

    $stateProvider.state("credits", {
      url: "/credits",
      templateUrl: "/partials/main/credits",
      controller: "CreditController",
      data: {
        access: access.public
      }
    }).state("about", {
      url: "/about",
      templateUrl: "/partials/main/about",
      controller: "AboutController",
      data: {
        access: access.public
      }
    }).state("contacts", {
      url: "/contacts",
      templateUrl: "/partials/main/contacts",
      controller: "ContactsController",
      data: {
        access: access.public
      }
    });

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    if (configuration.debugEnabled === "false") {
        $logProvider.debugEnabled(false);
    }

    $httpProvider.interceptors.push("ErrorHandlerInterceptor");

    ezfbProvider.setInitParams({
      appId: "195803770591615"
    });

    ezfbProvider.setLocale("fr_FR");
  });

nextrunApp.run(function(
  $rootScope,
  $state,
  $anchorScroll,
  SharedMetaService,
  AuthService,
  notificationService,
  MetaService,
  gettextCatalog) {


  $rootScope.$on("$stateChangeStart", function(event, toState) {

    MetaService.loading();

    if (!AuthService.authorize(toState.data.access)) {
      if (AuthService.isLoggedIn()) {
        $state.go("home");
      } else {
        $state.go("login");
      }

      notificationService.info(gettextCatalog.getString("Vous n'êtes pas autorisé à consulter cette page"));
    }
  });

  gettextCatalog.currentLanguage = "en";
  gettextCatalog.debug = true;
});