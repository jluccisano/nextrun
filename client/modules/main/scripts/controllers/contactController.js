"use strict";

angular.module("nextrunApp").controller("ContactController",
    function(
        $location,
        MetaService) {

        MetaService.ready("title.contacts", $location.path(), "message.contacts.description");
    });