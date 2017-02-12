angular.module('nextrunApp')
    .factory('RaceServices', function($http) {
        'use strict';
        return {
            create: function(data, success, error) {
                $http.post('/races/create', data).success(function() {
                    success();
                }).error(error);
            },
            find: function(userId, page, success, error) {
                $http.get('/races/find/page/' + page).success(function(races) {
                    success(races);
                }).error(error);
            },
            update: function(id, data, success, error) {
                $http.put('/races/' + id + '/update', data).success(function() {
                    success();
                }).error(error);
            },
            delete: function(id, success, error) {
                $http.delete('/races/' + id + '/delete').success(function() {
                    success();
                }).error(error);
            },
            retrieve: function(id, success, error) {
                $http.get('/races/' + id).success(function(race) {
                    success(race);
                }).error(error);
            }
        };
    });