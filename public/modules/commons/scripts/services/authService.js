"use strict";

angular.module("nextrunApp.commons").factory("AuthService",
    function($cookieStore, RestAPIHelper) {

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
                return RestAPIHelper.sendPOST("/api/users/signup", user);
            },
            login: function(user) {
                var promise = RestAPIHelper.sendPOST("/api/users/session", user);
                promise.then(function(user) {
                    changeUser(user);
                });
                return promise;
            },
            logout: function() {
                var promise = RestAPIHelper.sendPOST("/api/users/logout", undefined);
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
                return RestAPIHelper.sendPOST("/api/users/forgotpassword", user);
            },
            checkEmail: function(user) {
                return RestAPIHelper.sendPOST("/api/users/check/email", user);
            },
            updateProfile: function(user) {
                return RestAPIHelper.sendPUT("/api/users/update/profile", user);
            },
            updatePassword: function(data) {
                return RestAPIHelper.sendPUT("/api/users/update/password", data);
            },
            getUserProfile: function() {
                return RestAPIHelper.sendGET("/api/users/settings");
            },
            deleteAccount: function() {
                var promise = RestAPIHelper.sendDELETE("/api/users/delete", undefined);
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