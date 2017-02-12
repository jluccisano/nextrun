"use strict";

angular.module("mockModule").factory("mockAuthService",
	function($q, mockUser) {
		
		var succeedPromise = false;

		return {
			login: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			logout: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			register: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			getUserProfile: function() {
				if (succeedPromise) {
					return $q.when(mockUser);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			updateProfile: function() {
				if (succeedPromise) {
					return $q.when(mockUser);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			updatePassword: function() {
				if (succeedPromise) {
					return $q.when(mockUser);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			deleteAccount: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			forgotPassword: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			isLoggedIn: function() {
				return true;
			},
			setPromiseResponse: function(value) {
				succeedPromise = value;
			}
		};
	});