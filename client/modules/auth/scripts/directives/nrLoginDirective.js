"use strict";

angular.module("nextrunApp.auth").directive("nrLogin", function() {
    return {
        templateUrl: "/partials/auth/login",
        restrict: "E",
    };
});