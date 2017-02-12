"use strict";

angular.module("nextrunApp.commons").factory("RouteService",
    function(HttpUtils) {
        return {
            create: function(data) {
                return HttpUtils.post("/api/routes/create", data);
            },
            find: function(page) {
                return HttpUtils.get("/api/routes/find/page/" + page);
            },
            update: function(id, data) {
                return HttpUtils.put("/api/routes/" + id + "/update", data);
            },
            delete: function(id) {
                return HttpUtils.delete("/api/routes/" + id + "/delete");
            },
            retrieve: function(id) {
                return HttpUtils.get("/api/routes/" + id);
            },
            saveOrUpdate: function(data) {
                if(data._id) {
                    return HttpUtils.put("/api/routes/" + id + "/update", data);
                } else {
                    return HttpUtils.post("/api/routes/new", data);
                }
            }
        };
    });