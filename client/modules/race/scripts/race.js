"use strict";

var raceModule = angular.module("nextrunApp.race", [
  "ngRoute",
  "ngAnimate",
  "toggle-switch",
  "google-maps",
  "highcharts-ng",
  "textAngular",
  "gettext",
  "ui.bootstrap.pagination",
  "ui.bootstrap.modal",
  "ui.bootstrap.accordion",
  //"ui.bootstrap.datepicker",
  "ui.bootstrap.timepicker",
  //"mgcrea.ngStrap.tab",
  "ui.bootstrap.tabs",
  "mgcrea.ngStrap.datepicker",
  //"mgcrea.ngStrap.timepicker",
  "xeditable",
  "nextrunApp.commons",
  "nextrunApp.route"
]);

raceModule.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';
});


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
      templateUrl: "/partials/race/edit2",
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