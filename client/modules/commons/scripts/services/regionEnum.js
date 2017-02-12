"use strict";

angular.module("nextrunApp.commons").factory("RegionEnum",
	function($filter) {
		//FIXME remove this enum and use filter with departmentEnum only
		var regions = [{
			name: "Toute la France",
			departments: [],
		}, {
			name: "Ain",
			departments: ["67", "68"]
		}, {
			name: "Aquitaine",
			departments: ["24", "33", "40", "47", "64"]
		}, {
			name: "Auvergne",
			departments: ["03", "15", "43", "63"]
		}, {
			name: "Bourgogne",
			departments: ["21", "58", "71", "89"]
		}, {
			name: "Bretagne",
			departments: ["22", "29", "35", "56"]
		}, {
			name: "Centre",
			departments: ["18", "28", "36", "37", "41", "45"]
		}, {
			name: "Champagne-Ardenne",
			departments: ["08", "10", "51", "52"]
		}, {
			name: "Corse",
			departments: ["2A", "2B"]
		}, {
			name: "Franche-Comté",
			departments: ["25", "39", "70", "90"]
		}, {
			name: "Guadeloupe",
			departments: ["971"]
		}, {
			name: "Guyane",
			departments: ["973"]
		}, {
			name: "Ile de France",
			departments: ["75", "91", "92", "93", "77", "94", "95", "78"]
		}, {
			name: "Languedoc-Roussillon",
			departments: ["11", "30", "34", "48", "66"]
		}, {
			name: "Limousin",
			departments: ["19", "23", "87"]
		}, {
			name: "Lorraine",
			departments: ["54", "55", "57", "88"]
		}, {
			name: "Martinique",
			departments: ["972"]
		}, {
			name: "Mayotte",
			departments: ["976"]
		}, {
			name: "Midi-Pyrénées",
			departments: ["09", "12", "31", "32", "46", "65", "81", "82"]
		}, {
			name: "Nord-Pas-de-Calais",
			departments: ["59", "62"]
		}, {
			name: "Basse-Normandie",
			departments: ["14", "50", "61"]
		}, {
			name: "Haute-Normandie",
			departments: ["27", "76"]
		}, {
			name: "Pays de la Loire",
			departments: ["44", "49", "53", "72", "85"]
		}, {
			name: "Picardie",
			departments: ["02", "60", "80"]
		}, {
			name: "Poitou-Charentes",
			departments: ["16", "17", "79", "86"]
		}, {
			name: "Provence-Alpes-Côte d\"Azur",
			departments: ["04", "05", "06", "13", "83", "84"]
		}, {
			name: "La Réunion",
			departments: ["974"]
		}, {
			name: "Rhône-Alpes",
			departments: ["01", "07", "26", "38", "42", "69", "73", "74"]
		}];


		return {
			getValues: function() {
				return regions;
			},
			getRegionByName: function(name) {

				if(name === "*") {
					return regions[0];
				}

				return $filter("filter")(regions, {
					name: name
				})[0];
			}
		};
	});