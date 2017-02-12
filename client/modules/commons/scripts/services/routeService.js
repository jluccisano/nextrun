"use strict";

angular.module("nextrunApp.commons").factory("RouteService",
    function(HttpUtils) {
        return {
            find: function(id, page) {
                return HttpUtils.get("/api/routes/" + id + "/find/page/" + page);
            },
            findAll: function(page) {
                return HttpUtils.get("/api/routes/find/page/" + page);
            },
            delete: function(id) {
                return HttpUtils.delete("/api/routes/" + id + "/delete");
            },
            retrieve: function(id) {
                return HttpUtils.get("/api/routes/" + id);
            },
            saveOrUpdate: function(data) {
                if (data._id) {
                    return HttpUtils.put("/api/routes/" + data._id + "/update", data);
                } else {
                    return HttpUtils.post("/api/routes/new", data);
                }
            },
            publish: function(id) {
                return HttpUtils.put("/api/routes/" + id + "/publish/", undefined);
            },
            unpublish: function(id) {
                return HttpUtils.put("/api/routes/" + id + "/unpublish/", undefined);
            },
        };
    });