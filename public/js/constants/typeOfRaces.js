var TYPE_OF_RACES = new Enum({
	TRIATHLON: {
		i18n: "Triathlon",
		name: 'triathlon',
		distances: [{
			name: 'XS',
			i18n: 'XS - 400m/10km/2,5km'
		}, {
			name: 'S',
			i18n: 'S - 750m/20km/5km'
		}, {
			name: 'M',
			i18n: 'M - 1,5km/40km/10km'
		}, {
			name: 'L',
			i18n: 'L - 3km/80km/20km'
		}, {
			name: 'XL',
			i18n: 'XL - 4km/120km/30km'
		}, {
			name: 'XXL',
			i18n: 'XXL - 3,8km/180km/42,195km'
		}, {
			name: 'Half-Ironman',
			i18n: 'Half-Ironman - 1,9km/90km/21km'
		}, {
			name: 'Ironman',
			i18n: 'Ironman - 3,8km/180km/42,195km'
		}],
		routes: [{
			name: 'swimming',
			i18n: 'Natation'
		}, {
			name: 'cycling',
			i18n: 'Vélo'
		}, {
			name: 'running',
			i18n: 'Course à pied'
		}]
	},
	DUATHLON: {
		i18n: "Duathlon",
		name: 'duathlon',
		distances: [{
			name: 'XS',
			i18n: 'XS - 2,5km/10km/1,25km'
		}, {
			name: 'S',
			i18n: 'S - 5km/20km/2,5km'
		}, {
			name: 'M',
			i18n: 'M - 10km/40km/5km'
		}, {
			name: 'L',
			i18n: 'L - 20km/80km/10km'
		}, {
			name: 'XL',
			i18n: 'XL - 20km/120km/20km'
		}],
		routes: [{
			name: 'running1',
			i18n: 'CAP 1'
		}, {
			name: 'cycling',
			i18n: 'Vélo'
		}, {
			name: 'running2',
			i18n: 'CAP 2'
		}]
	},

	TRAIL: {
		i18n: "Trail",
		name: 'trail',
		distances: [{
			name: 'Course nature',
			i18n: 'Course nature - < à 21km'
		}, {
			name: 'Trail court',
			i18n: 'Trail court - > à 21km et < à 42km'
		}, {
			name: 'Trail',
			i18n: 'Trail - > à 42km et < à 80km'
		}, {
			name: 'Ultra-Trail',
			i18n: 'Ultra-Trail - > à 80km'
		}],
		routes: [{
			name: 'trail',
			i18n: 'Trail'
		}]
	},
	NIGHT_TRAIL: {
		i18n: "Trail de nuit",
		name: 'night_trail',
		distances: [{
			name: 'Course nature',
			i18n: 'Course nature - < à 21km'
		}, {
			name: 'Trail court',
			i18n: 'Trail court - > à 21km et < à 42km'
		}, {
			name: 'Trail',
			i18n: 'Trail - > à 42km et < à 80km'
		}, {
			name: 'Ultra-Trail',
			i18n: 'Ultra-Trail - > à 80km'
		}],
		routes: [{
			name: 'trail',
			i18n: 'Trail'
		}]
	},
	RUNNING: {
		i18n: "Course à pied",
		name: 'running',
		distances: [{
			name: '3km',
			i18n: '3km'
		}, {
			name: '5km',
			i18n: '5km'
		}, {
			name: '10km',
			i18n: '10km'
		}, {
			name: 'Semi-Marathon',
			i18n: 'Semi-Marathon - 21,1km'
		}, {
			name: 'Marathon',
			i18n: 'Marathon - 42,195km'
		}, {
			name: '100km',
			i18n: '100km'
		}],
		routes: [{
			name: 'running',
			i18n: 'Course à pied'
		}]
	},
	RIDING: {
		i18n: "Cyclo",
		name: 'riding',
		distances: [{
			name: 'Court',
			i18n: 'Court - < à 80km'
		}, {
			name: 'Moyen',
			i18n: 'Moyen - > à 80km et < à 120km'
		}, {
			name: 'Long',
			i18n: 'Long - > à 120km'
		}],
		routes: [{
			name: 'cycling',
			i18n: 'Vélo'
		}]
	},
	AQUATHLON: {
		i18n: "Aquathlon",
		name: 'aquathlon',
		distances: [

			{
				name: 'XS',
				i18n: 'XS - 0,5km/2,5km'
			}, {
				name: 'S',
				i18n: 'S - 1km/5km'
			}, {
				name: 'M',
				i18n: 'M - 2km/10km'
			}, {
				name: 'L',
				i18n: 'L - 3km/15km'
			}, {
				name: 'XL',
				i18n: 'XL - 4km/20km'
			}

		],
		routes: [{
			name: 'swimming',
			i18n: 'Natation'
		}, {
			name: 'running',
			i18n: 'Course à pied'
		}]
	},
	BIKENRUN: {
		i18n: "Bike & Run",
		name: 'bikenrun',
		distances: [

			{
				name: 'XS',
				i18n: 'XS - < à 0h45'
			}, {
				name: 'S',
				i18n: 'S - > à 0h45 et < à 1h15'
			}, {
				name: 'M',
				i18n: 'XS - > à 1h15 et < à 2h00'
			}, {
				name: 'L',
				i18n: 'L - > à 2h00'
			}
		],
		routes: [{
			name: 'running',
			i18n: 'Course à pied'
		}]
	},
	SNOW_TRIATHLON: {
		i18n: "Triathlon des neiges",
		name: 'snow_triathlon',
		distances: [{
			name: 'XS',
			i18n: 'XS - 2km/3,5km/3km'
		}, {
			name: 'S',
			i18n: 'S - 4km/7km/6km'
		}, {
			name: 'M',
			i18n: 'M - 8km/14km/12km'
		}],
		routes: [{
			name: 'cycling',
			i18n: 'Vélo'
		}, {
			name: 'running',
			i18n: 'Course à pied'
		}, {
			name: 'ski',
			i18n: 'Ski de Fond'
		}]
	},
	SNOW_DUATHLON: {
		i18n: "Duathlon des neiges",
		name: 'snow_duathlon',
		distances: [{
			name: 'XS',
			i18n: 'XS - 2km/3km/2km'
		}, {
			name: 'S',
			i18n: 'S - 4km/6km/4km'
		}, {
			name: 'M',
			i18n: 'M - 8km/12km/8km'
		}],
		routes: [{
			name: 'running1',
			i18n: 'CAP 1'
		}, {
			name: 'ski',
			i18n: 'Ski de Fond'
		}, {
			name: 'running2',
			i18n: 'CAP 2'
		}]
	},
	CROSS_TRIATHLON: {
		i18n: "Cross Triathlon",
		name: 'cross_triathlon',
		distances: [{
			name: 'XS',
			i18n: 'XS - 250m/5,5km/2km'
		}, {
			name: 'S',
			i18n: 'S - 500m/11km/4km'
		}, {
			name: 'M',
			i18n: 'M - 1km/22km/8km'
		}, {
			name: 'L',
			i18n: 'L - 2km/44km/16km'
		}, {
			name: 'XL',
			i18n: 'XL - 3km/66km/24km'
		}],
		routes: [{
			name: 'swimming',
			i18n: 'Natation'
		}, {
			name: 'mountainbike',
			i18n: 'Vélo Tout Terrain'
		}, {
			name: 'trail',
			i18n: 'Trail'
		}]
	},
	CROSS_DUATHLON: {
		i18n: "Cross Duathlon",
		name: 'cross_duathlon',
		distances: [{
			name: 'XS',
			i18n: 'XS - 2km/5,5km/1km'
		}, {
			name: 'S',
			i18n: 'S - 4km/11km/2km'
		}, {
			name: 'M',
			i18n: 'M - 8km/22km/4km'
		}, {
			name: 'L',
			i18n: 'L - 16km/44km/8km'
		}, {
			name: 'XL',
			i18n: 'XL - 24km/66km/12km'
		}],
		routes: [{
			name: 'running1',
			i18n: 'CAP 1'
		}, {
			name: 'mountainbike',
			i18n: 'Vélo tout Terrain'
		}, {
			name: 'running2',
			i18n: 'CAP 2'
		}]
	},

	//RAID

});

var getRaceTypeByName = function(TYPE_OF_RACES, name) {
	switch (name.toString().toUpperCase()) {
		case 'TRIATHLON':
			if (true) {
				return TYPE_OF_RACES.TRIATHLON.value;
			}
			break;
		case 'DUATHLON':
			if (true) {
				return TYPE_OF_RACES.DUATHLON.value;
			}
			break;
		case 'TRAIL':
			if (true) {
				return TYPE_OF_RACES.TRAIL.value;
			}
			break;
		case 'NIGHT_TRAIL':
			if (true) {
				return TYPE_OF_RACES.NIGHT_TRAIL.value;
			}
			break;
		case 'RUNNING':
			if (true) {
				return TYPE_OF_RACES.RUNNING.value;
			}
			break;
		case 'RIDING':
			if (true) {
				return TYPE_OF_RACES.RIDING.value;
			}
			break;
		case 'AQUATHLON':
			if (true) {
				return TYPE_OF_RACES.AQUATHLON.value;
			}
			break;
		case 'BIKENRUN':
			if (true) {
				return TYPE_OF_RACES.BIKENRUN.value;
			}
			break;
		case 'SNOW_TRIATHLON':
			if (true) {
				return TYPE_OF_RACES.SNOW_TRIATHLON.value;
			}
			break;
		case 'SNOW_DUATHLON':
			if (true) {
				return TYPE_OF_RACES.SNOW_DUATHLON.value;
			}
			break;
		case 'CROSS_TRIATHLON':
			if (true) {
				return TYPE_OF_RACES.CROSS_TRIATHLON.value;
			}
			break;
		case 'CROSS_DUATHLON':
			if (true) {
				return TYPE_OF_RACES.CROSS_DUATHLON.value;
			}
			break;
	}
};