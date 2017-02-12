"use strict";

angular.module("nextrunApp").controller("CreditController",
    function(
        $location,
        MetaService) {

        MetaService.ready("Remerciements", "Liste des frameworks open source utilisés pour développer le site Nextrun");
    });