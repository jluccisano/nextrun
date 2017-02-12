"use strict";

angular.module("nextrunApp.commons").factory("RaceService",
    function(RestAPIHelper) {

        return {
            create: function(data) {
                return RestAPIHelper.sendPOST("/api/races/create", data);
            },
            find: function(page) {
                return RestAPIHelper.sendGET("/api/races/find/page/" + page);
            },
            update: function(id, data) {
                return RestAPIHelper.sendPUT("/api/races/" + id + "/update", data);
            },
            delete: function(id) {
                return RestAPIHelper.sendDELETE("/api/races/" + id + "/delete");
            },
            retrieve: function(id) {
                return RestAPIHelper.sendGET("/api/races/" + id);
            },
            publish: function(id, value) {
                return RestAPIHelper.sendPUT("/api/races/" + id + "/publish/" + value, undefined);
            },
            search: function(criteria) {
                return RestAPIHelper.sendPOST("/api/races/search/", {
                    "criteria": criteria
                });
            },
            findAll: function() {
                return RestAPIHelper.sendGET("/api/races/");
            },
            suggest: function(criteria) {
                return RestAPIHelper.sendPOST("/api/races/autocomplete/", {
                    "criteria": criteria
                });
            }
        };
    });