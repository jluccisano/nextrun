"use strict";

angular.module("mockModule").factory("mockRaceService",
	function($q, mockRace, mockSuggestResponse) {

		var succeedPromise = false;

		return {
			create: function() {
				if (succeedPromise) {
					return $q.when({
						data: {
							raceId: mockRace._id
						}
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			retrieve: function() {
				if (succeedPromise) {
					return $q.when({
						data: {
							race: mockRace
						}
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			update: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			suggest: function() {
				if (succeedPromise) {
					return $q.when(mockSuggestResponse);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			search: function() {
				if (succeedPromise) {
					return $q.when(mockSuggestResponse);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			findAll: function() {
				if (succeedPromise) {
					return $q.when({
						data: {
							races: [mockRace]
						}
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			delete: function() {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			find: function() {
				if (succeedPromise) {
					return $q.when({
						data: {
							races: [mockRace]
						}
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			publish: function() {
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