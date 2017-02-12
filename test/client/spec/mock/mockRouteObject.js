"use strict";

angular.module("mockModule").value("mockRoute", {
	isVisible: false,
	editMode: true,
	segments: [{
		segmentId: 1,
		points: [{
			latlng: {
				mb: 43.1,
				nb: 1.6
			},
			elevation: 0,
			distanceFromStart: 0,
			grade: 0,
			segmentId: 2
		}],
		distance: 0
	}],
	description: "",
	distance: 0,
	descendant: 0,
	ascendant: 0,
	minElevation: 0,
	maxElevation: 0,
	elevationPoints: [],
	type: "",
	travelMode: google.maps.TravelMode.DRIVING,
	zoom: 13,
	fit: true,
	markers: [],
	polylines: [],
	center: {},
	options: {},
	events: {},
	chartConfig: {}
});