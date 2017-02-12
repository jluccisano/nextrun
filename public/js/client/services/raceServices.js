angular.module('nextrunApp')
    .factory('RaceServices', function($http) {
        'use strict';
        return {
            create: function(data, success, error) {
                $http.post('/api/races/create', data).success(function(response) {
                    success(response);
                }).error(error);
            },
            find: function(page, success, error) {
                $http.get('/api/races/find/page/' + page).success(function(races) {
                    success(races);
                }).error(error);
            },
            update: function(id, data, success, error) {
                $http.put('/api/races/' + id + '/update', data).success(function() {
                    success();
                }).error(error);
            },
            delete: function(id, success, error) {
                $http.delete('/api/races/' + id + '/delete').success(function() {
                    success();
                }).error(error);
            },
            retrieve: function(id, success, error) {
                $http.get('/api/races/' + id).success(function(race) {
                    success(race);
                }).error(error);
            },
            publish: function(id, value, success, error) {
                $http.put('/api/races/' + id + '/publish/' + value).success(function() {
                    success();
                }).error(error);
            },
            search: function(department, success, error) {
                $http.get('/api/races/search/' + 'department/' + department).success(function(races) {
                    success(races);
                }).error(error);
            }
        };
    });