"use strict";

angular.module("mockModule").value("mockCriteria", {
	sort: "_score",
	size: 20,
	from: 0,
	fulltext: "",
	departments: [],
	region: {
		name: "Ain",
		departments: ["67", "68"]
	},
	types: [],
	dateRanges: [{
		startDate: moment(),
		endDate: moment().add("days", 179)
	}],
	location: {},
	searchAround: true,
	distance: "15"
});