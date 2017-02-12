"use strict";

angular.module("mockModule").value("mockRace", {
	_id: "1234",
	name: "La ronde du cassoulet",
	type: {
		name: "running",
		i18n: "Course à Pied"
	},
	pin: {
		location: {
			lat: 45.34,
			lon: 1.7
		},
		name: "Castelnaudary",
		department: {
			code: "11",
			name: "Aude",
			region: "Languedoc-Roussillon",
			center: {
				latitude: 41.853196,
				longitude: 8.997391
			}
		}
	},
	plan: {
		address: {
			latlng: {
				lat: 45.34,
				lon: 1.7
			}
		}
	},
	date: new Date(),
	edition: "1",
	distanceType: {
		name: "10km",
		i18n: "10km"
	},
	routes: [{
		elevationPoints: [{
			latlng: {
				mb: 43.1,
				nb: 1.6
			},
			elevation: 300,
			distanceFromStart: 0,
			grade: 3,
			segmentId: 2
		}],
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

	}]
});