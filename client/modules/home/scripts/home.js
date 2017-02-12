"use strict";

var homeModule = angular.module("nextrunApp.home", [
    "ui.router",
    "ui.bootstrap.tpls",
    "ui.bootstrap.transition",
    "ui.bootstrap.carousel",
    "mgcrea.ngStrap.select",
    "gettext",
    "nextrunApp.commons",
    "nextrunApp.route",
    "jlareau.pnotify",
]);

homeModule.config(
    function(
        $stateProvider,
        $locationProvider) {

        var access = routingConfig.accessLevels;

        $stateProvider.state("home", {
            url: "/",
            templateUrl: "/partials/home/home",
            controller: "HomeController",
            data: {
                access: access.public
            }
        }).state("contacts", {
            url: "/contacts",
            templateUrl: "/partials/home/contacts",
            controller: "ContactsController",
            data: {
                access: access.admin
            }
        });

        $locationProvider.html5Mode(true);
    });