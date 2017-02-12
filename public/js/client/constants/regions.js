var REGIONS = new Enum({
	ALSACE: {
		name: 'Ain',
		departments: ['67', '68'],
	},
	AQUITAINE: {
		name: 'Aquitaine',
		departments: ['24', '33', '40', '47', '64'],
	},
	AUVERGNE: {
		name: 'Auvergne',
		departments: ['03', '15', '43', '63'],
	},
	BOURGOGNE: {
		name: 'Bourgogne',
		departments: ['21', '58', '71', '89'],
	},
	BRETAGNE: {
		name: 'Bretagne',
		departments: ['22', '29', '35', '56'],
	},
	CENTRE: {
		name: 'Centre',
		departments: ['18', '28', '36', '37', '41', '45'],
	},
	CHAMPAGNE_ARDENNE: {
		name: 'Champagne-Ardenne',
		departments: ['08', '10', '51', '52'],
	},
	CORSE: {
		name: 'Corse',
		departments: ['2A', '2B'],
	},
	FRANCHE_COMTE: {
		name: 'Franche-Comté',
		departments: ['25', '39', '70', '90'],
	},
	GUADELOUPE: {
		name: 'Guadeloupe',
		departments: ['971'],
	},
	GUYANE: {
		name: 'Guyane',
		departments: ['973'],
	},
	IDF: {
		name: 'Ile de France',
		departments: ['75', '91', '92', '93', '77', '94', '95', '78'],
	},
	LANGUEDOC_ROUSSILLON: {
		name: 'Languedoc-Roussillon',
		departments: ['11', '30', '34', '48', '66'],
	},
	LIMOUSIN: {
		name: 'Limousin',
		departments: ['19', '23', '87'],
	},
	LORRAINE: {
		name: 'Lorraine',
		departments: ['54', '55', '57', '88'],
	},
	MARTINIQUE: {
		name: 'Martinique',
		departments: ['972'],
	},
	MAYOTTE: {
		name: 'Mayotte',
		departments: ['976'],
	},
	MIDI_PYRENEES: {
		name: 'Midi-Pyrénées',
		departments: ['09', '12', '31', '32', '46', '65', '81', '82'],
	},
	NPDC: {
		name: 'Nord-Pas-de-Calais',
		departments: ['59', '62'],
	},
	BASSE_NORMANDIE: {
		name: 'Basse-Normandie',
		departments: ['14', '50', '61'],
	},
	HAUTE_NORMANDIE: {
		name: 'Haute-Normandie',
		departments: ['27', '76'],
	},
	PAYS_DE_LA_LOIRE: {
		name: 'Pays de la Loire',
		departments: ['44', '49', '53', '72', '85'],
	},
	PICARDIE: {
		name: 'Picardie',
		departments: ['02', '60', '80'],
	},
	POITOU_CHARENTES: {
		name: 'Poitou-Charentes',
		departments: ['16', '17', '79', '86'],
	},
	PACA: {
		name: 'Provence-Alpes-Côte d\'Azur',
		departments: ['04', '05', '06', '13', '83', '84'],
	},
	REUNION: {
		name: 'La Réunion',
		departments: ['974'],
	},
	RHONE_ALPES: {
		name: 'Rhône-Alpes',
		departments: ['01','07','26','38','42','69','73','74'],
	},
});


var getRegionByName = function(DEPARTMENTS, code) {
	switch (code.toString()) {
		case '01':
			if (true) {
				return DEPARTMENTS.AIN.value;
			}
			break;
	}
};