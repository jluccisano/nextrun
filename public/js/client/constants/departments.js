var DEPARTMENTS = new Enum({
	AIN: {
		code: '01',
		name: 'Ain',
		region: 'Rhône-Alpes'
	},
	AISNE: {
		code: '02',
		name: 'Aisne',
		region: 'Picardie'
	},
	CORSE_DU_SUD: {
		code: '2A',
		name: 'Corse du Sud',
		region: 'Corse'
	},
	HAUTE_CORSE: {
		code: '2B',
		name: 'Haute-Corse',
		region: 'Corse'
	},
	ALLIER: {
		code: '03',
		name: 'Allier',
		region: 'Auvergne'
	},
	ALPES_DE_HAUTE_PROVENCE: {
		code: '04',
		name: 'Alpes de Haute-Provence',
		region: 'Provence-Alpes-Côte d\'Azur'
	},
	HAUTES_ALPES: {
		code: '05',
		name: 'Hautes-Alpes',
		region: 'Provence-Alpes-Côte d\'Azur'
	},
	ALPES_MARITIMES: {
		code: '06',
		name: 'Alpes-Maritimes',
		region: 'Provence-Alpes-Côte d\'Azur'
	},
	ARDECHE: {
		code: '07',
		name: 'Ardèche',
		region: 'Rhône-Alpes'
	},
	ARDENNES: {
		code: '08',
		name: 'Ardennes',
		region: 'Champagne'
	},
	ARIEGE: {
		code: '09',
		name: 'Ariège',
		region: 'Midi-Pyrénées'
	},
	AUBE: {
		code: '10',
		name: 'Aube',
		region: 'Champagne'
	},
	AUDE: {
		code: '11',
		name: 'Aude',
		region: 'Languedoc'
	},
	AVEYRON: {
		code: '12',
		name: 'Aveyron',
		region: 'Midi-Pyrénées'
	},
	BOUCHES_DU_RHONE: {
		code: '13',
		name: 'Bouches du Rhône',
		region: 'Provence-Alpes-Côte d\'Azur'
	},
	CALVADOS: {
		code: '14',
		name: 'Calvados',
		region: 'Basse-Normandie'
	},
	CANTAL: {
		code: '15',
		name: 'Cantal',
		region: 'Auvergne'
	},
	CHARENTE: {
		code: '16',
		name: 'Charente',
		region: 'Poitou-Charente'
	},
	CHARENTE_MARITIME: {
		code: '17',
		name: 'Charente Maritime',
		region: 'Poitou-Charente'
	},
	CHER: {
		code: '18',
		name: 'Cher',
		region: 'Centre'
	},
	CORREZE: {
		code: '19',
		name: 'Corrèze',
		region: 'Limousin'
	},
	COTE_DOR: {
		code: '21',
		name: 'Côte d\'Or',
		region: 'Bourgogne'
	},
	COTES_DARMOR: {
		code: '22',
		name: 'Côtes d\'Armor',
		region: 'Bretagne'
	},
	CREUSE: {
		code: '23',
		name: 'Creuse',
		region: 'Limousin'
	},
	DORDOGNE: {
		code: '24',
		name: 'Dordogne',
		region: 'Aquitaine'
	},
	DOUBS: {
		code: '25',
		name: 'Doubs',
		region: 'Franche-Comté'
	},
	DROME: {
		code: '26',
		name: 'Drôme',
		region: 'Rhône-Alpes'
	},
	EURE: {
		code: '27',
		name: 'Eure',
		region: 'Haute-Normandie'
	},
	EURE_ET_LOIR: {
		code: '28',
		name: 'Eure-et-Loir',
		region: 'Centre'
	},
	FINISTERE: {
		code: '29',
		name: 'Finistère',
		region: 'Bretagne'
	},
	GARD: {
		code: '30',
		name: 'Gard',
		region: 'Languedoc'
	},
	HAUTE_GARONNE: {
		code: '31',
		name: 'Haute-Garonne',
		region: 'Midi-Pyrénées'
	},
	GERS: {
		code: '32',
		name: 'Gers',
		region: 'Midi-Pyrénées'
	},
	GIRONDE: {
		code: '33',
		name: 'Gironde',
		region: 'Aquitaine'
	},
	HERAULT: {
		code: '34',
		name: 'Hérault',
		region: 'Languedoc'
	},
	ILLE_ET_VILAINE: {
		code: '35',
		name: 'Ille-et-Vilaine',
		region: 'Bretagne'
	},
	INDRE: {
		code: '36',
		name: 'Indre',
		region: 'Centre'
	},
	INDRE_ET_LOIRE: {
		code: '37',
		name: 'Indre-et-Loire',
		region: 'Centre'
	},
	ISERE: {
		code: '38',
		name: 'Isère',
		region: 'Rhône-Alpes'
	},
	JURA: {
		code: '39',
		name: 'Jura',
		region: 'Franche-Comté'
	},
	LANDES: {
		code: '40',
		name: 'Landes',
		region: 'Aquitaine'
	},
	LOIR_ET_CHER: {
		code: '41',
		name: 'Loir-et-Cher',
		region: 'Centre'
	},
	LOIRE: {
		code: '42',
		name: 'Loire',
		region: 'Rhône-Alpes'
	},
	HAUTE_LOIRE: {
		code: '43',
		name: 'Haute-Loire',
		region: 'Auvergne'
	},
	LOIRE_ATLANTIQUE: {
		code: '44',
		name: 'Loire-Atlantique',
		region: 'Pays-de-la-Loire'
	},
	LOIRET: {
		code: '45',
		name: 'Loiret',
		region: 'Centre'
	},
	LOT: {
		code: '46',
		name: 'Lot',
		region: 'Midi-Pyrénées'
	},
	LOT_ET_GARONNE: {
		code: '47',
		name: 'Lot-et-Garonne',
		region: 'Aquitaine'
	},
	LOZERE: {
		code: '48',
		name: 'Lozère',
		region: 'Languedoc'
	},
	MAINE_ET_LOIRE: {
		code: '49',
		name: 'Maine-et-Loire',
		region: 'Pays-de-la-Loire'
	},
	MANCHE: {
		code: '50',
		name: 'Manche',
		region: 'Normandie'
	},
	MARNE: {
		code: '51',
		name: 'Marne',
		region: 'Champagne'
	},
	HAUTE_MARNE: {
		code: '52',
		name: 'Haute-Marne',
		region: 'Champagne'
	},
	MAYENNE: {
		code: '53',
		name: 'Mayenne',
		region: 'Pays-de-la-Loire'
	},
	MEURTHE_ET_MOSELLE: {
		code: '54',
		name: 'Meurthe-et-Moselle',
		region: 'Lorraine'
	},
	MEUSE: {
		code: '55',
		name: 'Meuse',
		region: 'Lorraine'
	},
	MORBIHAN: {
		code: '56',
		name: 'Morbihan',
		region: 'Bretagne'
	},
	MOSELLE: {
		code: '57',
		name: 'Moselle',
		region: 'Lorraine'
	},
	NIEVRE: {
		code: '58',
		name: 'Nièvre',
		region: 'Bourgogne'
	},
	NORD: {
		code: '59',
		name: 'Nord',
		region: 'Nord'
	},
	OISE: {
		code: '60',
		name: 'Oise',
		region: 'Picardie'
	},
	ORNE: {
		code: '61',
		name: 'Orne',
		region: 'Basse-Normandie'
	},
	PAS_DE_CALAIS: {
		code: '62',
		name: 'Pas-de-Calais',
		region: 'Nord'
	},
	PUY_DE_DOME: {
		code: '63',
		name: 'Puy-de-Dôme',
		region: 'Auvergne'
	},
	PYRENEES_ATLANTIQUES: {
		code: '64',
		name: 'Pyrénées-Atlantiques',
		region: 'Aquitaine'
	},
	HAUTES_PYRENEES: {
		code: '65',
		name: 'Hautes-Pyrénées',
		region: 'Midi-Pyrénées'
	},
	PYRENEES_ORIENTALES: {
		code: '66',
		name: 'Pyrénées-Orientales',
		region: 'Languedoc'
	},
	BAS_RHIN: {
		code: '67',
		name: 'Bas-Rhin',
		region: 'Alsace'
	},
	HAUT_RHIN: {
		code: '68',
		name: 'Haut-Rhin',
		region: 'Alsace'
	},
	RHONE: {
		code: '69',
		name: 'Rhône',
		region: 'Rhône-Alpes'
	},
	HAUTE_SAONE: {
		code: '70',
		name: 'Haute-Saône',
		region: 'Franche-Comté'
	},
	SAONE_ET_LOIRE: {
		code: '71',
		name: 'Saône-et-Loire',
		region: 'Bourgogne'
	},
	SARTHE: {
		code: '72',
		name: 'Sarthe',
		region: 'Pays-de-la-Loire'
	},
	SAVOIE: {
		code: '73',
		name: 'Savoie',
		region: 'Rhône-Alpes'
	},
	HAUTE_SAVOIE: {
		code: '74',
		name: 'Haute-Savoie',
		region: 'Rhône-Alpes'
	},
	PARIS: {
		code: '75',
		name: 'Paris',
		region: 'Ile-de-France'
	},
	SEINE_MARITIME: {
		code: '76',
		name: 'Seine-Maritime',
		region: 'Haute-Normandie'
	},
	SEINE_ET_MARNE: {
		code: '77',
		name: 'Seine-et-Marne',
		region: 'Ile-de-France'
	},
	YVELINES: {
		code: '78',
		name: 'Yvelines',
		region: 'Ile-de-France'
	},
	DEUX_SEVRES: {
		code: '79',
		name: 'Deux-Sèvres',
		region: 'Poitou-Charente'
	},
	SOMME: {
		code: '80',
		name: 'Somme',
		region: 'Picardie'
	},
	TARN: {
		code: '81',
		name: 'Tarn',
		region: 'Midi-Pyrénées'
	},
	TARN_ET_GARONNE: {
		code: '82',
		name: 'Tarn-et-Garonne',
		region: 'Midi-Pyrénées'
	},
	VAR: {
		code: '83',
		name: 'Var',
		region: 'Provence-Alpes-Côte d\'Azur'
	},
	VAUCLUSE: {
		code: '84',
		name: 'Vaucluse',
		region: 'Provence-Alpes-Côte d\'Azur'
	},
	VENDEE: {
		code: '85',
		name: 'Vendée',
		region: 'Pays-de-la-Loire'
	},
	VIENNE: {
		code: '86',
		name: 'Vienne',
		region: 'Poitou-Charente'
	},
	HAUTE_VIENNE: {
		code: '87',
		name: 'Haute-Vienne',
		region: 'Limousin'
	},
	VOSGES: {
		code: '88',
		name: 'Vosges',
		region: 'Lorraine'
	},
	YONNE: {
		code: '89',
		name: 'Yonne',
		region: 'Bourgogne'
	},
	TERRITOIRE_DE_BELFORT: {
		code: '90',
		name: 'Territoire-de-Belfort',
		region: 'Franche-Comté'
	},
	ESSONNE: {
		code: '91',
		name: 'Essonne',
		region: 'Ile-de-France'
	},
	HAUTS_DE_SEINE: {
		code: '92',
		name: 'Hauts-de-Seine',
		region: 'Ile-de-France'
	},
	SEINE_ST_DENIS: {
		code: '93',
		name: 'Seine-St-Denis',
		region: 'Ile-de-France'
	},
	VAL_DE_MARNE: {
		code: '94',
		name: 'Val-de-Marne',
		region: 'Ile-de-France'
	},
	VAL_DOISE: {
		code: '95',
		name: 'Val-d\'Oise',
		region: 'Ile-de-France'
	},
});


var getDepartmentByCode = function(DEPARTMENTS, code) {
	switch (code.toString()) {
		case '01':
			if (true) {
				return DEPARTMENTS.AIN.value;
			}
			break;
		case '02':
			if (true) {
				return DEPARTMENTS.AISNE.value;
			}
			break;
		case '2A':
			if (true) {
				return DEPARTMENTS.CORSE_DU_SUD.value;
			}
			break;
		case '2B':
			if (true) {
				return DEPARTMENTS.HAUTE_CORSE.value;
			}
			break;
		case '03':
			if (true) {
				return DEPARTMENTS.ALLIER.value;
			}
			break;
		case '04':
			if (true) {
				return DEPARTMENTS.ALPES_DE_HAUTE_PROVENCE.value;
			}
			break;
		case '05':
			if (true) {
				return DEPARTMENTS.HAUTES_ALPES.value;
			}
			break;
		case '06':
			if (true) {
				return DEPARTMENTS.ALPES_MARITIMES.value;
			}
			break;
		case '07':
			if (true) {
				return DEPARTMENTS.ARDECHE.value;
			}
			break;
		case '08':
			if (true) {
				return DEPARTMENTS.ARDENNES.value;
			}
			break;
		case '09':
			if (true) {
				return DEPARTMENTS.ARIEGE.value;
			}
			break;
		case '10':
			if (true) {
				return DEPARTMENTS.AUBE.value;
			}
			break;
		case '11':
			if (true) {
				return DEPARTMENTS.AUDE.value;
			}
			break;
		case '12':
			if (true) {
				return DEPARTMENTS.AVEYRON.value;
			}
			break;
		case '13':
			if (true) {
				return DEPARTMENTS.BOUCHES_DU_RHONE.value;
			}
			break;
		case '14':
			if (true) {
				return DEPARTMENTS.CALVADOS.value;
			}
			break;
		case '15':
			if (true) {
				return DEPARTMENTS.CANTAL.value;
			}
			break;
		case '16':
			if (true) {
				return DEPARTMENTS.CHARENTE.value;
			}
			break;
		case '17':
			if (true) {
				return DEPARTMENTS.CHARENTE_MARITIME.value;
			}
			break;
		case '18':
			if (true) {
				return DEPARTMENTS.CHER.value;
			}
			break;
		case '19':
			if (true) {
				return DEPARTMENTS.CORREZE.value;
			}
			break;
		case '21':
			if (true) {
				return DEPARTMENTS.COTE_DOR.value;
			}
			break;
		case '22':
			if (true) {
				return DEPARTMENTS.COTES_DARMOR.value;
			}
			break;
		case '23':
			if (true) {
				return DEPARTMENTS.CREUSE.value;
			}
			break;
		case '24':
			if (true) {
				return DEPARTMENTS.DORDOGNE.value;
			}
			break;
		case '25':
			if (true) {
				return DEPARTMENTS.DOUBS.value;
			}
			break;
		case '26':
			if (true) {
				return DEPARTMENTS.DROME.value;
			}
			break;
		case '27':
			if (true) {
				return DEPARTMENTS.EURE.value;
			}
			break;
		case '28':
			if (true) {
				return DEPARTMENTS.EURE_ET_LOIR.value;
			}
			break;
		case '29':
			if (true) {
				return DEPARTMENTS.FINISTERE.value;
			}
			break;
		case '30':
			if (true) {
				return DEPARTMENTS.GARD.value;
			}
			break;
		case '31':
			if (true) {
				return DEPARTMENTS.HAUTE_GARONNE.value;
			}
			break;
		case '32':
			if (true) {
				return DEPARTMENTS.GERS.value;
			}
			break;
		case '33':
			if (true) {
				return DEPARTMENTS.GIRONDE.value;
			}
			break;
		case '34':
			if (true) {
				return DEPARTMENTS.HERAULT.value;
			}
			break;
		case '35':
			if (true) {
				return DEPARTMENTS.ILLE_ET_VILAINE.value;
			}
			break;
		case '36':
			if (true) {
				return DEPARTMENTS.INDRE.value;
			}
			break;
		case '37':
			if (true) {
				return DEPARTMENTS.INDRE_ET_LOIRE.value;
			}
			break;
		case '38':
			if (true) {
				return DEPARTMENTS.ISERE.value;
			}
			break;
		case '39':
			if (true) {
				return DEPARTMENTS.JURA.value;
			}
			break;
		case '40':
			if (true) {
				return DEPARTMENTS.LANDES.value;
			}
			break;
		case '41':
			if (true) {
				return DEPARTMENTS.LOIR_ET_CHER.value;
			}
			break;
		case '42':
			if (true) {
				return DEPARTMENTS.LOIRE.value;
			}
			break;
		case '43':
			if (true) {
				return DEPARTMENTS.HAUTE_LOIRE.value;
			}
			break;
		case '44':
			if (true) {
				return DEPARTMENTS.LOIRE_ATLANTIQUE.value;
			}
			break;
		case '45':
			if (true) {
				return DEPARTMENTS.LOIRET.value;
			}
			break;
		case '46':
			if (true) {
				return DEPARTMENTS.LOT.value;
			}
			break;
		case '47':
			if (true) {
				return DEPARTMENTS.LOT_ET_GARONNE.value;
			}
			break;
		case '48':
			if (true) {
				return DEPARTMENTS.LOZERE.value;
			}
			break;
		case '49':
			if (true) {
				return DEPARTMENTS.MAINE_ET_LOIRE.value;
			}
			break;
		case '50':
			if (true) {
				return DEPARTMENTS.MANCHE.value;
			}
			break;
		case '51':
			if (true) {
				return DEPARTMENTS.MARNE.value;
			}
			break;
		case '52':
			if (true) {
				return DEPARTMENTS.HAUTE_MARNE.value;
			}
			break;
		case '53':
			if (true) {
				return DEPARTMENTS.MAYENNE.value;
			}
			break;
		case '54':
			if (true) {
				return DEPARTMENTS.MEURTHE_ET_MOSELLE.value;
			}
			break;
		case '55':
			if (true) {
				return DEPARTMENTS.MEUSE.value;
			}
			break;
		case '56':
			if (true) {
				return DEPARTMENTS.MORBIHAN.value;
			}
			break;
		case '57':
			if (true) {
				return DEPARTMENTS.MOSELLE.value;
			}
			break;
		case '58':
			if (true) {
				return DEPARTMENTS.NIEVRE.value;
			}
			break;
		case '59':
			if (true) {
				return DEPARTMENTS.NORD.value;
			}
			break;
		case '60':
			if (true) {
				return DEPARTMENTS.OISE.value;
			}
			break;
		case '61':
			if (true) {
				return DEPARTMENTS.ORNE.value;
			}
			break;
		case '62':
			if (true) {
				return DEPARTMENTS.PAS_DE_CALAIS.value;
			}
			break;
		case '63':
			if (true) {
				return DEPARTMENTS.PUY_DE_DOME.value;
			}
			break;
		case '64':
			if (true) {
				return DEPARTMENTS.PYRENEES_ATLANTIQUES.value;
			}
			break;
		case '65':
			if (true) {
				return DEPARTMENTS.HAUTES_PYRENEES.value;
			}
			break;
		case '66':
			if (true) {
				return DEPARTMENTS.PYRENEES_ORIENTALES.value;
			}
			break;
		case '67':
			if (true) {
				return DEPARTMENTS.BAS_RHIN.value;
			}
			break;
		case '68':
			if (true) {
				return DEPARTMENTS.HAUT_RHIN.value;
			}
			break;
		case '69':
			if (true) {
				return DEPARTMENTS.RHONE.value;
			}
			break;
		case '70':
			if (true) {
				return DEPARTMENTS.HAUTE_SAONE.value;
			}
			break;
		case '71':
			if (true) {
				return DEPARTMENTS.SAONE_ET_LOIRE.value;
			}
			break;
		case '72':
			if (true) {
				return DEPARTMENTS.SARTHE.value;
			}
			break;
		case '73':
			if (true) {
				return DEPARTMENTS.SAVOIE.value;
			}
			break;
		case '74':
			if (true) {
				return DEPARTMENTS.HAUTE_SAVOIE.value;
			}
			break;
		case '75':
			if (true) {
				return DEPARTMENTS.PARIS.value;
			}
			break;
		case '76':
			if (true) {
				return DEPARTMENTS.SEINE_MARITIME.value;
			}
			break;
		case '77':
			if (true) {
				return DEPARTMENTS.SEINE_ET_MARNE.value;
			}
			break;
		case '78':
			if (true) {
				return DEPARTMENTS.YVELINES.value;
			}
			break;
		case '79':
			if (true) {
				return DEPARTMENTS.DEUX_SEVRES.value;
			}
			break;
		case '80':
			if (true) {
				return DEPARTMENTS.SOMME.value;
			}
			break;
		case '81':
			if (true) {
				return DEPARTMENTS.TARN.value;
			}
			break;
		case '82':
			if (true) {
				return DEPARTMENTS.TARN_ET_GARONNE.value;
			}
			break;
		case '83':
			if (true) {
				return DEPARTMENTS.VAR.value;
			}
			break;
		case '84':
			if (true) {
				return DEPARTMENTS.VAUCLUSE.value;
			}
			break;
		case '85':
			if (true) {
				return DEPARTMENTS.VENDEE.value;
			}
			break;
		case '86':
			if (true) {
				return DEPARTMENTS.VIENNE.value;
			}
			break;
		case '87':
			if (true) {
				return DEPARTMENTS.HAUTE_VIENNE.value;
			}
			break;
		case '88':
			if (true) {
				return DEPARTMENTS.VOSGES.value;
			}
			break;
		case '89':
			if (true) {
				return DEPARTMENTS.YONNE.value;
			}
			break;
		case '90':
			if (true) {
				return DEPARTMENTS.TERRITOIRE_DE_BELFORT.value;
			}
			break;
		case '91':
			if (true) {
				return DEPARTMENTS.ESSONNE.value;
			}
			break;
		case '92':
			if (true) {
				return DEPARTMENTS.HAUTS_DE_SEINE.value;
			}
			break;
		case '93':
			if (true) {
				return DEPARTMENTS.SEINE_ST_DENIS.value;
			}
			break;
		case '94':
			if (true) {
				return DEPARTMENTS.VAL_DE_MARNE.value;
			}
			break;
		case '95':
			if (true) {
				return DEPARTMENTS.VAL_DOISE.value;
			}
			break;
	}
};