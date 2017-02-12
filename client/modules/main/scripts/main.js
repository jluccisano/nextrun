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
  "nextrunApp.workout",
  "ezfb",
  "jlareau.pnotify",
  "services.config",
  "ct.ui.router.extras"
]);

nextrunApp.config(
  function(
    $stateProvider,
    $locationProvider,
    $logProvider,
    $urlRouterProvider,
    $httpProvider,
    configuration,
    ezfbProvider,
    cfpLoadingBarProvider,
    notificationServiceProvider) {

    var access = routingConfig.accessLevels;

    $stateProvider.state("credits", {
      url: "/credits",
      templateUrl: "/partials/main/credits",
      controller: "CreditController",
      data: {
        access: access.public,
        fullscreen: false
      }
    }).state("about", {
      url: "/about",
      templateUrl: "/partials/main/about",
      controller: "AboutController",
      data: {
        access: access.public,
        fullscreen: false
      }
    }).state("contact", {
      url: "/contact",
      templateUrl: "/partials/main/contact",
      controller: "ContactController",
      data: {
        access: access.public,
        fullscreen: false
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

    cfpLoadingBarProvider.includeSpinner = true;

    notificationServiceProvider.setDefaults({
      history: false,
      delay: 3000,
      closer: false,
      closer_hover: false
    }).setDefaultStack("bottom_right").setStack('bottom_right', 'stack-bottomright', {
      dir1: 'up',
      dir2: 'left',
      firstpos1: 25,
      firstpos2: 25
    });

  });

nextrunApp.run(function(
  $rootScope,
  $state,
  $anchorScroll,
  $cookieStore,
  $previousState,
  SharedMetaService,
  AuthService,
  MetaService,
  gettextCatalog) {


  $rootScope.$on("$stateChangeStart", function(event, toState) {

    MetaService.loading();

    if (angular.isDefined(toState.data.fullscreen)) {
      $rootScope.fullscreen = toState.data.fullscreen;
    }

    $previousState.memo("previousState");

    if (!AuthService.authorize(toState.data.access)) {
      event.preventDefault();
      if (AuthService.isLoggedIn()) {
        $state.go("home");
      } else {
        $cookieStore.remove("user");
        //fixme use previous state if possible
        AuthService.saveAttemptUrl(toState);
        $state.go("login");
      }
    }
  });

  gettextCatalog.currentLanguage = "en";
  gettextCatalog.debug = true;
});