"use strict";

angular.module("nextrunApp.commons").factory("WorkoutService",
    function(HttpUtils) {
        return {
            find: function(id, page) {
                return HttpUtils.get("/api/workouts/" + id + "/find/page/" + page);
            },
            findAll: function(page) {
                return HttpUtils.get("/api/workouts/find/page/" + page);
            },
            delete: function(id) {
                return HttpUtils.delete("/api/workouts/" + id + "/delete");
            },
            retrieve: function(id) {
                return HttpUtils.get("/api/workouts/" + id);
            },
            saveOrUpdate: function(data) {
                if (data._id) {
                    return HttpUtils.put("/api/workouts/" + data._id + "/update", data);
                } else {
                    return HttpUtils.post("/api/workouts/new", data);
                }
            },
            updateParticipant: function(id, participant) {
                return HttpUtils.put("/api/workouts/" + id + "/participants/" + participant._id + "/update/", participant);
            },
            addParticipant: function(id, participant) {
                return HttpUtils.put("/api/workouts/" + id + "/participants/new/", participant);
            },
            deleteParticipant: function(id, participant) {
                return HttpUtils.delete("/api/workouts/" + id + "/participants/" + participant._id + "/delete");
            },
            checkIfParticipantAvailable: function(id, data) {
                return HttpUtils.post("/api/workouts/" + id + "/participants/available/", data);
            },
            updateRoute: function(workoutId, routeId) {
                return HttpUtils.put("/api/workouts/" + workoutId + "/route/" + routeId + "/update");
            },
            unlinkRoute: function(workoutId, routeId) {
                return HttpUtils.put("/api/workouts/" + workoutId + "/route/" + routeId + "/unlink");
            },
        };
    });