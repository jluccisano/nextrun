"use strict";

angular.module("nextrunApp").controller("CreditController",
    function(
        $location,
        MetaService) {

        MetaService.ready("Remerciements");
    });