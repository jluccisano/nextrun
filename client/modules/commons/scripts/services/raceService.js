"use strict";

angular.module("nextrunApp.commons").factory("RaceService",
    function(HttpUtils) {
        return {
            create: function(data) {
                return HttpUtils.post("/api/races/create", data);
            },
            checkIfRaceNameAvailable: function(id, data) {
                return HttpUtils.post("/api/races/" + id + "/name/available/", data);
            },
            find: function(id, page) {
                return HttpUtils.get("/api/races/" + id + "/find/page/" + page);
            },
            findAll: function(page) {
                return HttpUtils.get("/api/races/find/page/" + page);
            },
            update: function(id, data) {
                return HttpUtils.put("/api/races/" + id + "/update", data);
            },
            updateRoute: function(raceId, routeId) {
                return HttpUtils.put("/api/races/" + raceId + "/route/" + routeId + "/update");
            },
            delete: function(id) {
                return HttpUtils.delete("/api/races/" + id + "/delete");
            },
            retrieve: function(id) {
                return HttpUtils.get("/api/races/" + id);
            },
            publish: function(id) {
                return HttpUtils.put("/api/races/" + id + "/publish/", undefined);
            },
            unpublish: function(id) {
                return HttpUtils.put("/api/races/" + id + "/unpublish/", undefined);
            },
            search: function(criteria) {
                return HttpUtils.post("/api/races/search/", {
                    "criteria": criteria
                });
            },
            suggest: function(criteria) {
                return HttpUtils.post("/api/races/autocomplete/", {
                    "criteria": criteria
                });
            },
            autocomplete: function(text) {
                return HttpUtils.post("/api/races/autocomplete/", {
                    "text": text
                });
            },
            uploadImage: function(id, file) {
                return HttpUtils.post("/api/races/" + id + "/upload/", file);
            },
            download: function(id) {
                return HttpUtils.post("/api/races/" + id + "/download/");
            }

        };
    });