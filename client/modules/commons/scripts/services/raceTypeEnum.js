"use strict";

angular.module("nextrunApp.commons").factory("RaceTypeEnum",
	function($filter) {

		var typeOfRaces = [{
			name: "Triathlon",
			distances: [{
				name: "XS",
				label: "XS - 400m/10km/2,5km"
			}, {
				name: "S",
				label: "S - 750m/20km/5km"
			}, {
				name: "M",
				label: "M - 1,5km/40km/10km"
			}, {
				name: "L",
				label: "L - 3km/80km/20km"
			}, {
				name: "XL",
				label: "XL - 4km/120km/30km"
			}, {
				name: "XXL",
				label: "XXL - 3,8km/180km/42,195km"
			}, {
				name: "Half-Ironman",
				label: "Half-Ironman - 1,9km/90km/21km"
			}, {
				name: "Ironman",
				label: "Ironman - 3,8km/180km/42,195km"
			}],
			routes: ["Natation", "Vélo", "Course à pied"]
		}, {
			name: "Duathlon",
			distances: [{
				name: "XS",
				label: "XS - 2,5km/10km/1,25km"
			}, {
				name: "S",
				label: "S - 5km/20km/2,5km"
			}, {
				name: "M",
				label: "M - 10km/40km/5km"
			}, {
				name: "L",
				label: "L - 20km/80km/10km"
			}, {
				name: "XL",
				label: "XL - 20km/120km/20km"
			}],
			routes: ["CAP 1", "Vélo", "CAP 2"]
		}, {
			name: "Trail",
			distances: [{
				name: "Course nature",
				label: "Course nature - < à 21km"
			}, {
				name: "Trail court",
				label: "Trail court - > à 21km et < à 42km"
			}, {
				name: "Trail",
				label: "Trail - > à 42km et < à 80km"
			}, {
				name: "Ultra-Trail",
				label: "Ultra-Trail - > à 80km"
			}],
			routes: ["Trail"]
		}, {
			name: "Trail de nuit",
			distances: [{
				name: "Course nature",
				label: "Course nature - < à 21km"
			}, {
				name: "Trail court",
				label: "Trail court - > à 21km et < à 42km"
			}, {
				name: "Trail",
				label: "Trail - > à 42km et < à 80km"
			}, {
				name: "Ultra-Trail",
				label: "Ultra-Trail - > à 80km"
			}],
			routes: ["Trail"]
		}, {
			name: "Course à pied",
			distances: [{
				name: "3km",
				label: "3km"
			}, {
				name: "5km",
				label: "5km"
			}, {
				name: "10km",
				label: "10km"
			}, {
				name: "Semi-Marathon",
				label: "Semi-Marathon - 21,1km"
			}, {
				name: "Marathon",
				label: "Marathon - 42,195km"
			}, {
				name: "100km",
				label: "100km"
			}],
			routes: ["Course à pied"]
		}, {
			name: "Cyclo",
			distances: [{
				name: "Court",
				label: "Court - < à 80km"
			}, {
				name: "Moyen",
				label: "Moyen - > à 80km et < à 120km"
			}, {
				name: "Long",
				label: "Long - > à 120km"
			}],
			routes: ["Vélo"]
		}, {
			name: "Aquathlon",
			distances: [
				{
					name: "XS",
					label: "XS - 0,5km/2,5km"
				}, {
					name: "S",
					label: "S - 1km/5km"
				}, {
					name: "M",
					label: "M - 2km/10km"
				}, {
					name: "L",
					label: "L - 3km/15km"
				}, {
					name: "XL",
					label: "XL - 4km/20km"
				}
			],
			routes: ["Natation", "Course à pied"]
		}, {
			name: "Bike & Run",
			distances: [
				{
					name: "XS",
					label: "XS - < à 0h45"
				}, {
					name: "S",
					label: "S - > à 0h45 et < à 1h15"
				}, {
					name: "M",
					label: "XS - > à 1h15 et < à 2h00"
				}, {
					name: "L",
					label: "L - > à 2h00"
				}
			],
			routes: ["Course à pied + Vélo"]
		}, {
			name: "Triathlon des neiges",
			distances: [{
				name: "XS",
				label: "XS - 2km/3,5km/3km"
			}, {
				name: "S",
				label: "S - 4km/7km/6km"
			}, {
				name: "M",
				label: "M - 8km/14km/12km"
			}],
			routes: ["Vélo", "Course à pied", "Ski de Fond"]
		}, {
			name: "Duathlon des neiges",
			distances: [{
				name: "XS",
				label: "XS - 2km/3km/2km"
			}, {
				name: "S",
				label: "S - 4km/6km/4km"
			}, {
				name: "M",
				label: "M - 8km/12km/8km"
			}],
			routes: ["CAP 1", "Ski de Fond", "CAP 2"]
		}, {
			name: "Cross Triathlon",
			distances: [{
				name: "XS",
				label: "XS - 250m/5,5km/2km"
			}, {
				name: "S",
				label: "S - 500m/11km/4km"
			}, {
				name: "M",
				label: "M - 1km/22km/8km"
			}, {
				name: "L",
				label: "L - 2km/44km/16km"
			}, {
				name: "XL",
				label: "XL - 3km/66km/24km"
			}],
			routes: ["Natation", "Vélo Tout Terrain", "Trail"]
		}, {
			name: "Cross Duathlon",
			distances: [{
				name: "XS",
				label: "XS - 2km/5,5km/1km"
			}, {
				name: "S",
				label: "S - 4km/11km/2km"
			}, {
				name: "M",
				label: "M - 8km/22km/4km"
			}, {
				name: "L",
				label: "L - 16km/44km/8km"
			}, {
				name: "XL",
				label: "XL - 24km/66km/12km"
			}],
			routes: ["CAP 1" , "Vélo tout Terrain", "CAP 2"]
		}];

		return {
			getValues: function() {
				return typeOfRaces;
			},
			getRaceTypeByName: function(name) {
				return $filter('filter')(typeOfRaces, {name: name})[0];
			}
		};
	});