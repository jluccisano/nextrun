"use strict";

var raceModule = angular.module("nextrunApp.race", [
  "ngRoute",
  "ngAnimate",
  "ngSanitize",
  "uiGmapgoogle-maps",
  "highcharts-ng",
  "frapontillo.bootstrap-switch",
  "textAngular",
  "gettext",
  "ui.bootstrap.pagination",
  "ui.bootstrap.accordion",
  "ui.bootstrap.tabs",
  "ui.bootstrap.collapse",
  "ui.bootstrap.dropdown",
  "ui.bootstrap.modal",
  "mgcrea.ngStrap.datepicker",
  "mgcrea.ngStrap.timepicker",
  "mgcrea.ngStrap.affix",
  "mgcrea.ngStrap.scrollspy",
  "mgcrea.ngStrap.helpers.dimensions",
  "nextrunApp.commons",
  "nextrunApp.route",
  "ezfb"
]);


raceModule.config(
  function(
    $routeProvider,
    $locationProvider,
    ezfbProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.
    when("/myraces", {
      templateUrl: "/partials/race/myraces",
      controller: "MyRacesController",
      access: access.user
    }).
    when("/races/create", {
      templateUrl: "/partials/race/create",
      controller: "CreateRaceController",
      access: access.public
    }).
    when("/races/home", {
      templateUrl: "/partials/race/home",
      controller: "RaceHomeController",
      access: access.public
    }).
    when("/races/view/:raceId", {
      templateUrl: "/partials/race/race",
      controller: "ViewRaceController",
      access: access.public
    }).
    when("/races/edit/:raceId", {
      templateUrl: "/partials/race/race",
      controller: "EditRaceController",
      access: access.user
    }).
    when("/races/search", {
      templateUrl: "/partials/race/search",
      controller: "SearchRaceController",
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


    ezfbProvider.setInitParams({
      appId: '195803770591615'
    });

    ezfbProvider.setLocale('fr_FR');

  });