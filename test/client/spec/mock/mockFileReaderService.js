"use strict";

angular.module("mockModule").factory("mockFileReaderService",
	function($q) {

		var succeedPromise = true;

		return {
			readAsDataUrl: function() {
				if (succeedPromise) {
					var result = {};
					return $q.when(result);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			setPromiseResponse: function(value) {
				succeedPromise = value;
			}
		};
	});