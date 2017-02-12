angular.module('mockModule').factory('mockAuthServices', ['$q', 'mockUser',
	function($q, mockUser) {
		'use strict';

		var succeedPromise = false;

		return {
			login: function(user) {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			logout: function(user) {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			register: function(user) {
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
			forgotPassword: function(user) {
				if(succeedPromise) {
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
		}
	}
]);