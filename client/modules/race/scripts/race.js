"use strict";

var raceModule = angular.module("nextrunApp.race", [
  "ui.router",
  "ngSanitize",
  "google-maps",
  "highcharts-ng",
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
  "ezfb",
  "jlareau.pnotify",
  "lr.upload",
  "ngImgCrop",
  "base64"
]);

raceModule.config(
  function(
    $stateProvider,
    $locationProvider,
    ezfbProvider) {

    var access = routingConfig.accessLevels;

    $stateProvider.state("races", {
      url: "/races/home",
      templateUrl: "/partials/race/home",
      controller: "RaceHomeController",
      data: {
        access: access.public,
        fullscreen: false
      }
    }).state("myraces", {
      url: "/users/:id/races",
      templateUrl: "/partials/race/races",
      controller: "RacesController",
      data: {
        access: access.user
      }
    }).state("allraces", {
      url: "/races",
      templateUrl: "/partials/race/allraces",
      controller: "RacesController",
      data: {
        access: access.admin
      },
    }).state("create", {
      url: "/races/create",
      templateUrl: "/partials/race/create",
      controller: "CreateRaceController",
      data: {
        access: access.public,
        fullscreen: false
      },
    }).state("view", {
      url: "/races/view/:id",
      templateUrl: "/partials/race/race",
      controller: "ViewRaceController",
      data: {
        access: access.public,
        fullscreen: false
      },
      resolve: {
        raceId: ['$stateParams',
          function($stateParams) {
            return $stateParams.id;
          }
        ]
      }
    }).state("edit", {
      url: "/races/edit/:id",
      templateUrl: "/partials/race/race",
      controller: "EditRaceController",
      data: {
        access: access.user,
        fullscreen: false
      },
      resolve: {
        raceId: ['$stateParams',
          function($stateParams) {
            return $stateParams.id;
          }
        ]
      }
    }).state("search", {
      url: "/races/search",
      templateUrl: "/partials/race/search",
      controller: "SearchRaceController",
      data: {
        access: access.public,
        fullscreen: false
      }
    });

    $locationProvider.html5Mode(true);


    ezfbProvider.setInitParams({
      appId: "195803770591615"
    });

    ezfbProvider.setLocale("fr_FR");

   

  });