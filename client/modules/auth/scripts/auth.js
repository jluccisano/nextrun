"use strict";

var authModule = angular.module("nextrunApp.auth", [
    "ui.router",
    "ngCookies",
    "gettext",
    "ui.bootstrap.modal",
    "mgcrea.ngStrap.helpers.dimensions",
    "mgcrea.ngStrap.scrollspy",
    "mgcrea.ngStrap.affix",
    "nextrunApp.commons",
    "jlareau.pnotify"
]);

authModule.config(
    function(
        $stateProvider,
        $locationProvider) {

        var access = routingConfig.accessLevels;

        $stateProvider.state("login", {
            url: "/login",
            templateUrl: "/partials/auth/login",
            controller: "LoginController",
            data: {
                access: access.public,
                fullscreen: false
            }
        }).state("signup", {
            url: "/signup",
            templateUrl: "/partials/auth/signup",
            controller: "SignupController",
            data: {
                access: access.public,
                fullscreen: false
            }
        }).state("settings", {
            url: "/users/settings",
            templateUrl: "/partials/auth/settings",
            controller: "SettingsController",
            data: {
                access: access.user,
                fullscreen: false
            }
        }).state("users", {
            url: "/users",
            templateUrl: "/partials/auth/users",
            controller: "UsersController",
            data: {
                access: access.admin,
                fullscreen: false
            }
        });

        $locationProvider.html5Mode(true);

    });