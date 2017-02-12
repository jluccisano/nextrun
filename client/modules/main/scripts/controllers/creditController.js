"use strict";

angular.module("nextrunApp").controller("CreditController",
    function(
        $location,
        MetaService,
        gettextCatalog) {

        MetaService.ready(gettextCatalog.getString("Remerciements"), $location.path(), gettextCatalog.getString("Remerciements"));
    });