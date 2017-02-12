"use strict";

var raceModule = angular.module("nextrunApp.race", [
  "ngRoute",
  "google-maps",
  "highcharts-ng",
  "AngularGM",
  "textAngular",
  "gettext",
  "ui.bootstrap.modal",
  //"mgcrea.ngStrap.tooltip",
  "mgcrea.ngStrap.collapse",
  "mgcrea.ngStrap.tab",
  "mgcrea.ngStrap.datepicker",
  "mgcrea.ngStrap.timepicker",
  "nextrunApp.commons",
  "nextrunApp.route"
]);

raceModule.config(
  function(
    $routeProvider,
    $locationProvider) {

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
      templateUrl: "/partials/race/view",
      controller: "ViewRaceController",
      access: access.public
    }).
    when("/races/edit/:raceId", {
      templateUrl: "/partials/race/edit",
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

  });