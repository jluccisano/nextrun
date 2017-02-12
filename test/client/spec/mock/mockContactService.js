"use strict";

angular.module("mockModule").factory("mockContactService",
	function($q) {

		var succeedPromise = false;

		return {
			addContact: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			sendFeedback: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			setPromiseResponse: function(value) {
				succeedPromise = value;
			}
		};
	});