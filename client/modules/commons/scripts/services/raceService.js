"use strict";

angular.module("nextrunApp.commons").factory("RaceService",
    function(HttpUtils) {
        return {
            create: function(data) {
                return HttpUtils.post("/api/races/create", data);
            },
            find: function(page) {
                return HttpUtils.get("/api/races/find/page/" + page);
            },
            update: function(id, data) {
                return HttpUtils.put("/api/races/" + id + "/update", data);
            },
            delete: function(id) {
                return HttpUtils.delete("/api/races/" + id + "/delete");
            },
            retrieve: function(id) {
                return HttpUtils.get("/api/races/" + id);
            },
            publish: function(id, value) {
                return HttpUtils.put("/api/races/" + id + "/publish/" + value, undefined);
            },
            search: function(criteria) {
                return HttpUtils.post("/api/races/search/", {
                    "criteria": criteria
                });
            },
            findAll: function() {
                return HttpUtils.get("/api/races/");
            },
            suggest: function(criteria) {
                return HttpUtils.post("/api/races/autocomplete/", {
                    "criteria": criteria
                });
            }
        };
    });