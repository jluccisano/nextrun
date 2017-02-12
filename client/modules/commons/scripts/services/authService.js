"use strict";

angular.module("nextrunApp.commons").factory("AuthService",
    function($cookieStore, HttpUtils) {

        var accessLevels = routingConfig.accessLevels,
            userRoles = routingConfig.userRoles,
            currentUser = $cookieStore.get("user") || {
                id: "",
                email: "",
                username: "",
                role: userRoles.public
            };

        $cookieStore.remove("user");

        function changeUser(user) {
            _.extend(currentUser, user);
        }

        return {
            authorize: function(accessLevel, role) {
                if (role === undefined) {
                    role = currentUser.role;
                }
                return accessLevel.bitMask & role.bitMask;
            },
            isLoggedIn: function(user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
            },
            register: function(user) {
                var promise = HttpUtils.post("/api/users/signup", user);
                promise.then(function(user) {
                    changeUser(user);
                });
                return promise;
            },
            login: function(user) {
                var promise = HttpUtils.post("/api/users/session", user);
                promise.then(function(user) {
                    changeUser(user);
                });
                return promise;
            },
            logout: function() {
                var promise = HttpUtils.post("/api/users/logout", undefined);
                promise.then(function() {
                    changeUser({
                        id: "",
                        email: "",
                        username: "",
                        role: userRoles.public
                    });
                });
                return promise;
            },
            forgotPassword: function(user) {
                return HttpUtils.post("/api/users/forgotpassword", user);
            },
            checkEmail: function(user) {
                return HttpUtils.post("/api/users/check/email", user);
            },
            updateProfile: function(user) {
                return HttpUtils.put("/api/users/update/profile", user);
            },
            updatePassword: function(data) {
                return HttpUtils.put("/api/users/update/password", data);
            },
            getUserProfile: function() {
                return HttpUtils.get("/api/users/settings");
            },
            deleteAccount: function() {
                var promise = HttpUtils.delete("/api/users/delete", undefined);
                promise.then(function() {
                    changeUser({
                        id: "",
                        email: "",
                        username: "",
                        role: userRoles.public
                    });
                });
                return promise;
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    });