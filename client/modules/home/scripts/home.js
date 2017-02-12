"use strict";

var homeModule = angular.module("nextrunApp.home", [
    "ngRoute",
    "ui.bootstrap",
    "nextrunApp.commons",
    "nextrunApp.route"
]);

homeModule.config(
    function(
        $routeProvider,
        $locationProvider) {

        var access = routingConfig.accessLevels;

        $routeProvider.
        when("/", {
            templateUrl: "/partials/home/home",
            controller: "HomeController",
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