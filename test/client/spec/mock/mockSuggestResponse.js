"use strict";

angular.module("mockModule").value("mockSuggestResponse", {
	hits: {
		total: 1,
		hits: [{
			fields: {
				partial1: [{
					_id: "12345",
					name: "duathlon de Castelnaudary"
				}]
			}
		}]
	},
	facets: {
		typeFacets: {
			terms: [{
				count: 1,
				term: "duathlon"
			}]
		},
		departmentFacets: {
			terms: [{
				count: 1,
				term: "11"
			}]
		}
	}
});