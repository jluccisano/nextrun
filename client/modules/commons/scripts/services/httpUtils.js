"use strict";
angular.module("nextrunApp.commons").factory("HttpUtils", function($http) {

    return {
        get: function(url, timeout) {
            return $http({
                method: "GET",
                url: url,
                headers: {
                    "Accept": "application/json"
                },
                cache: false,
                timeout: timeout
            });
        },
        post: function(url, body) {
            return $http({
                method: "POST",
                url: url,
                data: body,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                cache: false
            });
        },
        delete: function(url) {
            return $http({
                method: "DELETE",
                url: url,
                headers: {
                    "Accept": "application/json"
                },
                cache: false
            });
        },
        put: function(url, body) {
            return $http({
                method: "PUT",
                url: url,
                data: body,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                cache: false
            });
        }
    };
});