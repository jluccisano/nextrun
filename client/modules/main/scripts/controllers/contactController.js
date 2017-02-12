"use strict";

angular.module("nextrunApp").controller("ContactController",
    function(
        $location,
        MetaService) {

        MetaService.ready("Contacts", $location.path(),"Contacts");
    });