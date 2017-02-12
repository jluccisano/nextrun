"use strict";
angular.module("nextrunApp.commons").value("redirectToUrlAfterLogin", {
    name: "home",
    params: {}
});

angular.module("nextrunApp.commons").factory("AuthService",
    function($cookieStore, HttpUtils, redirectToUrlAfterLogin, $state) {

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
            angular.extend(currentUser, user);
        }

        return {
            find: function(page) {
                return HttpUtils.get("/api/users/find/page/" + page);
            },
            delete: function(id) {
                return HttpUtils.delete("/api/users/" + id + "/delete");
            },
            authorize: function(accessLevel) {
                var role = currentUser.role;
                return accessLevel.bitMask & role.bitMask;
            },
            isAdmin: function(user) {
                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.admin.title;
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
                promise.then(function(response) {
                    changeUser(response.data);
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
            saveAttemptUrl: function(state) {
                if (state) {
                    redirectToUrlAfterLogin = {
                        url: state.url,
                        name: state.name,
                        params: state.params
                    };
                } else {
                    redirectToUrlAfterLogin = {
                        url: $state.current.url,
                        name: $state.current.name,
                        params: $state.params
                    };

                }
            },
            redirectToAttemptedUrl: function() {
                $state.go(redirectToUrlAfterLogin.name, redirectToUrlAfterLogin.params);
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    });