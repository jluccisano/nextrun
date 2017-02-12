"use strict";

angular.module("nextrunApp").controller("CreditController",
    function(
        $location,
        MetaService) {

        MetaService.ready("title.credits", $location.path(), "title.credits.description");

    });