angular.module('mockModule').factory('mockContactServices', ['$q',
	function($q) {
		'use strict';

		var succeedPromise = false;

		return {
			addContact: function(contact) {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			sendFeedback: function(feedback) {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			setPromiseResponse: function(value) {
				succeedPromise = value;
			}
		}
	}
]);