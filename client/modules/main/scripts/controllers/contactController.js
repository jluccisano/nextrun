"use strict";

angular.module("nextrunApp").controller("ContactController",
    function(
        $location,
        MetaService,
        gettextCatalog) {

        MetaService.ready(gettextCatalog.getString("Contacts"), $location.path(), gettextCatalog.getString("Contacts"));
    });