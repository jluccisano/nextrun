angular.module('mockModule').factory('mockRaceServices', ['mockRace', 'mockSuggestResponse', '$q',
	function(mockRace, mockSuggestResponse, $q) {
		'use strict';

		var succeedPromise = false;

		return {
			create: function(data) {
				if (succeedPromise) {
					return $q.when({
						raceId: mockRace._id
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			retrieve: function(raceId) {
				if (succeedPromise) {
					return $q.when({
						race: mockRace
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			update: function(raceId, race) {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			suggest: function(query_string) {
				if (succeedPromise) {
					return $q.when(mockSuggestResponse);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			search: function(criteria) {
				if (succeedPromise) {
					return $q.when(mockSuggestResponse);
				} else {
					return $q.reject("Something went wrong");
				}
			},
			findAll: function() {
				if (succeedPromise) {
					return $q.when({
						races: [mockRace]
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			delete: function(id) {
				if (succeedPromise) {
					return $q.when();
				} else {
					return $q.reject("Something went wrong");
				}
			},
			find: function(currentPage) {
				if (succeedPromise) {
					return $q.when({
						races: [mockRace]
					});
				} else {
					return $q.reject("Something went wrong");
				}
			},
			publish: function(value) {
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
