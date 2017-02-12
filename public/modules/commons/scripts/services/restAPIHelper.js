"use strict";

angular.module("nextrunApp.commons").factory("RestAPIHelper",
	function($http, $q) {

		return {
			sendGET: function(url) {
				var deferred = $q.defer();
				$http.get(url).success(function(result) {
					deferred.resolve(result);
				}).error(function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			},
			sendPUT: function(url, data) {
				var deferred = $q.defer();
				$http.put(url, data).success(function(result) {
					deferred.resolve(result);
				}).error(function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			},
			sendPOST: function(url, data) {
				var deferred = $q.defer();
				$http.post(url, data).success(function(result) {
					deferred.resolve(result);
				}).error(function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			},
			sendDELETE: function(url) {
				var deferred = $q.defer();
				$http.delete(url).success(function(result) {
					deferred.resolve(result);
				}).error(function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			}

		};
	});