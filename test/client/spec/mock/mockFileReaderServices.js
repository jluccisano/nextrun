angular.module('mockModule').factory('mockFileReaderServices', ['$q',
	function($q) {
		'use strict';

		var succeedPromise = true;

		return {
			readAsDataUrl: function(file, scope) {
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
		}
	}
]);