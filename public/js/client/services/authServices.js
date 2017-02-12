angular.module('nextrunApp')
    .factory('Auth', ['$http', '$cookieStore',
        function($http, $cookieStore) {
            'use strict';
            var accessLevels = routingConfig.accessLevels,
                userRoles = routingConfig.userRoles,
                currentUser = $cookieStore.get('user') || {
                    id: '',
                    email: '',
                    username: '',
                    role: userRoles.public
                };

            $cookieStore.remove('user');

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
                register: function(user, success, error) {
                    $http.post('/api/users/signup', user).success(function(res) {
                        changeUser(res);
                        success();
                    }).error(error);
                },
                login: function(user, success, error) {
                    $http.post('/api/users/session', user).success(function(user) {
                        changeUser(user);
                        success(user);
                    }).error(error);
                },
                logout: function(success, error) {
                    $http.post('/api/users/logout').success(function() {
                        changeUser({
                            id: '',
                            email: '',
                            username: '',
                            role: userRoles.public
                        });
                        success();
                    }).error(error);
                },
                forgotpassword: function(user, success, error) {
                    $http.post('/api/users/forgotpassword', user).success(function() {
                        success();
                    }).error(error);
                },
                checkEmail: function(user, success, error) {
                    $http.post('/api/users/check/email', user).success(function() {
                        success();
                    }).error(error);
                },
                updateProfile: function(user, success, error) {
                    $http.put('/api/users/update/profile', user).success(function(user) {
                        success(user);
                    }).error(error);
                },
                updatePassword: function(id, data, success, error) {
                    $http.put('/api/users/update/password', data).success(function(user) {
                        success(user);
                    }).error(error);
                },
                getUserProfile: function(success, error) {
                    $http.get('/api/users/settings').success(function(user) {
                        success(user);
                    }).error(error);
                },
                deleteAccount: function(id, success, error) {
                    $http.delete('/api/users/delete').success(function() {
                        changeUser({
                            id: '',
                            email: '',
                            username: '',
                            role: userRoles.public
                        });
                        success();
                    }).error(error);
                },
                accessLevels: accessLevels,
                userRoles: userRoles,
                user: currentUser
            };
        }
    ]);