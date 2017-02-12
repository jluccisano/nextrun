"use strict";

angular.module("nextrunApp.commons").factory("DepartmentEnum",
	function() {

		var DEPARTMENTS = new Enum({
			AIN: {
				code: "01",
				name: "Ain",
				region: "Rhône-Alpes",
				center: {
					latitude: 46.324172,
					longitude: 5.135284
				}
			},
			AISNE: {
				code: "02",
				name: "Aisne",
				region: "Picardie",
				center: {
					latitude: 49.553726,
					longitude: 3.459869
				}
			},
			CORSE_DU_SUD: {
				code: "2A",
				name: "Corse du Sud",
				region: "Corse",
				center: {
					latitude: 41.853196,
					longitude: 8.997391
				}
			},
			HAUTE_CORSE: {
				code: "2B",
				name: "Haute-Corse",
				region: "Corse",
				center: {
					latitude: 42.468045,
					longitude: 9.238678
				}
			},
			ALLIER: {
				code: "03",
				name: "Allier",
				region: "Auvergne",
				center: {
					latitude: 46.418926,
					longitude: 3.281754
				}
			},
			ALPES_DE_HAUTE_PROVENCE: {
				code: "04",
				name: "Alpes de Haute-Provence",
				region: "Provence-Alpes-Côte d\"Azur",
				center: {
					latitude: 44.162504,
					longitude: 6.244904
				}
			},
			HAUTES_ALPES: {
				code: "05",
				name: "Hautes-Alpes",
				region: "Provence-Alpes-Côte d\"Azur",
				center: {
					latitude: 44.6413,
					longitude: 6.31398
				}
			},
			ALPES_MARITIMES: {
				code: "06",
				name: "Alpes-Maritimes",
				region: "Provence-Alpes-Côte d\"Azur",
				center: {
					latitude: 43.931528,
					longitude: 7.1819
				}
			},
			ARDECHE: {
				code: "07",
				name: "Ardèche",
				region: "Rhône-Alpes",
				center: {
					latitude: 44.750634,
					longitude: 4.432159
				}
			},
			ARDENNES: {
				code: "08",
				name: "Ardennes",
				region: "Champagne",
				center: {
					latitude: 49.624946,
					longitude: 4.613434
				}
			},
			ARIEGE: {
				code: "09",
				name: "Ariège",
				region: "Midi-Pyrénées",
				center: {
					latitude: 42.958433,
					longitude: 1.441544
				}
			},
			AUBE: {
				code: "10",
				name: "Aube",
				region: "Champagne",
				center: {
					latitude: 48.312428,
					longitude: 4.157501
				}
			},
			AUDE: {
				code: "11",
				name: "Aude",
				region: "Languedoc-Roussillon",
				center: {
					latitude: 43.115019,
					longitude: 2.383621
				}
			},
			AVEYRON: {
				code: "12",
				name: "Aveyron",
				region: "Midi-Pyrénées",
				center: {
					latitude: 44.359248,
					longitude: 2.568629
				}
			},
			BOUCHES_DU_RHONE: {
				code: "13",
				name: "Bouches du Rhône",
				region: "Provence-Alpes-Côte d\"Azur",
				center: {
					latitude: 43.645205,
					longitude: 5.020446
				}
			},
			CALVADOS: {
				code: "14",
				name: "Calvados",
				region: "Basse-Normandie",
				center: {
					latitude: 49.074610,
					longitude: -0.408835
				}
			},
			CANTAL: {
				code: "15",
				name: "Cantal",
				region: "Auvergne",
				center: {
					latitude: 45.094237,
					longitude: 2.673228
				}
			},
			CHARENTE: {
				code: "16",
				name: "Charente",
				region: "Poitou-Charente",
				center: {
					latitude: 45.662427,
					longitude: 0.189825
				}
			},
			CHARENTE_MARITIME: {
				code: "17",
				name: "Charente Maritime",
				region: "Poitou-Charente",
				center: {
					latitude: 45.774196,
					longitude: -0.698698
				}
			},
			CHER: {
				code: "18",
				name: "Cher",
				region: "Centre",
				center: {
					latitude: 47.084676,
					longitude: 2.423964
				}
			},
			CORREZE: {
				code: "19",
				name: "Corrèze",
				region: "Limousin",
				center: {
					latitude: 0,
					longitude: 0
				}
			},
			COTE_DOR: {
				code: "21",
				name: "Côte d\"Or",
				region: "Bourgogne",
				center: {
					latitude: 45.261645,
					longitude: 1.799338
				}
			},
			COTES_DARMOR: {
				code: "22",
				name: "Côtes d\"Armor",
				region: "Bretagne",
				center: {
					latitude: 0,
					longitude: 0
				}
			},
			CREUSE: {
				code: "23",
				name: "Creuse",
				region: "Limousin",
				center: {
					latitude: 48.402972,
					longitude: -2.787485
				}
			},
			DORDOGNE: {
				code: "24",
				name: "Dordogne",
				region: "Aquitaine",
				center: {
					latitude: 44.931368,
					longitude: 0.620635
				}
			},
			DOUBS: {
				code: "25",
				name: "Doubs",
				region: "Franche-Comté",
				center: {
					latitude: 47.141537,
					longitude: 6.350242
				}
			},
			DROME: {
				code: "26",
				name: "Drôme",
				region: "Rhône-Alpes",
				center: {
					latitude: 44.661400,
					longitude: 5.153510
				}
			},
			EURE: {
				code: "27",
				name: "Eure",
				region: "Haute-Normandie",
				center: {
					latitude: 49.122611,
					longitude: 1.052665
				}
			},
			EURE_ET_LOIR: {
				code: "28",
				name: "Eure-et-Loir",
				region: "Centre",
				center: {
					latitude: 48.405504,
					longitude: 1.416317
				}
			},
			FINISTERE: {
				code: "29",
				name: "Finistère",
				region: "Bretagne",
				center: {
					latitude: 48.249350,
					longitude: -3.994772
				}
			},
			GARD: {
				code: "30",
				name: "Gard",
				region: "Languedoc",
				center: {
					latitude: 43.862957,
					longitude: 4.399786
				}
			},
			HAUTE_GARONNE: {
				code: "31",
				name: "Haute-Garonne",
				region: "Midi-Pyrénées",
				center: {
					latitude: 43.468868,
					longitude: 1.141754
				}
			},
			GERS: {
				code: "32",
				name: "Gers",
				region: "Midi-Pyrénées",
				center: {
					latitude: 43.663665,
					longitude: 0.574458
				}
			},
			GIRONDE: {
				code: "33",
				name: "Gironde",
				region: "Aquitaine",
				center: {
					latitude: 44.821461,
					longitude: -0.533568
				}
			},
			HERAULT: {
				code: "34",
				name: "Hérault",
				region: "Languedoc",
				center: {
					latitude: 43.618334,
					longitude: 3.367045
				}
			},
			ILLE_ET_VILAINE: {
				code: "35",
				name: "Ille-et-Vilaine",
				region: "Bretagne",
				center: {
					latitude: 48.125367,
					longitude: -1.641630
				}
			},
			INDRE: {
				code: "36",
				name: "Indre",
				region: "Centre",
				center: {
					latitude: 46.735061,
					longitude: 1.579938
				}
			},
			INDRE_ET_LOIRE: {
				code: "37",
				name: "Indre-et-Loire",
				region: "Centre",
				center: {
					latitude: 47.409495,
					longitude: 0.676434
				}
			},
			ISERE: {
				code: "38",
				name: "Isère",
				region: "Rhône-Alpes",
				center: {
					latitude: 45.173579,
					longitude: 5.729479
				}
			},
			JURA: {
				code: "39",
				name: "Jura",
				region: "Franche-Comté",
				center: {
					latitude: 46.691084,
					longitude: 5.786931
				}
			},
			LANDES: {
				code: "40",
				name: "Landes",
				region: "Aquitaine",
				center: {
					latitude: 44.045452,
					longitude: -0.819785
				}
			},
			LOIR_ET_CHER: {
				code: "41",
				name: "Loir-et-Cher",
				region: "Centre",
				center: {
					latitude: 47.633908,
					longitude: 1.320805
				}
			},
			LOIRE: {
				code: "42",
				name: "Loire",
				region: "Rhône-Alpes",
				center: {
					latitude: 45.507975,
					longitude: 4.279566
				}
			},
			HAUTE_LOIRE: {
				code: "43",
				name: "Haute-Loire",
				region: "Auvergne",
				center: {
					latitude: 45.053779,
					longitude: 3.842813
				}
			},
			LOIRE_ATLANTIQUE: {
				code: "44",
				name: "Loire-Atlantique",
				region: "Pays-de-la-Loire",
				center: {
					latitude: 47.213843,
					longitude: -1.502460
				}
			},
			LOIRET: {
				code: "45",
				name: "Loiret",
				region: "Centre",
				center: {
					latitude: 47.904785,
					longitude: 2.608321
				}
			},
			LOT: {
				code: "46",
				name: "Lot",
				region: "Midi-Pyrénées",
				center: {
					latitude: 44.668982,
					longitude: 1.608566
				}
			},
			LOT_ET_GARONNE: {
				code: "47",
				name: "Lot-et-Garonne",
				region: "Aquitaine",
				center: {
					latitude: 44.287595,
					longitude: 0.374077
				}
			},
			LOZERE: {
				code: "48",
				name: "Lozère",
				region: "Languedoc",
				center: {
					latitude: 44.526034,
					longitude: 3.485662
				}
			},
			MAINE_ET_LOIRE: {
				code: "49",
				name: "Maine-et-Loire",
				region: "Pays-de-la-Loire",
				center: {
					latitude: 47.448900,
					longitude: -0.570805
				}
			},
			MANCHE: {
				code: "50",
				name: "Manche",
				region: "Normandie",
				center: {
					latitude: 48.895345,
					longitude: -1.281735
				}
			},
			MARNE: {
				code: "51",
				name: "Marne",
				region: "Champagne",
				center: {
					latitude: 48.940797,
					longitude: 4.322137
				}
			},
			HAUTE_MARNE: {
				code: "52",
				name: "Haute-Marne",
				region: "Champagne",
				center: {
					latitude: 48.141192,
					longitude: 5.154453
				}
			},
			MAYENNE: {
				code: "53",
				name: "Mayenne",
				region: "Pays-de-la-Loire",
				center: {
					latitude: 47.451686,
					longitude: -0.526860
				}
			},
			MEURTHE_ET_MOSELLE: {
				code: "54",
				name: "Meurthe-et-Moselle",
				region: "Lorraine",
				center: {
					latitude: 48.723838,
					longitude: 6.162051
				}
			},
			MEUSE: {
				code: "55",
				name: "Meuse",
				region: "Lorraine",
				center: {
					latitude: 49.127189,
					longitude: 5.382278
				}
			},
			MORBIHAN: {
				code: "56",
				name: "Morbihan",
				region: "Bretagne",
				center: {
					latitude: 47.902047,
					longitude: -2.758784
				}
			},
			MOSELLE: {
				code: "57",
				name: "Moselle",
				region: "Lorraine",
				center: {
					latitude: 49.025426,
					longitude: 6.595664
				}
			},
			NIEVRE: {
				code: "58",
				name: "Nièvre",
				region: "Bourgogne",
				center: {
					latitude: 47.148617,
					longitude: 3.585092
				}
			},
			NORD: {
				code: "59",
				name: "Nord",
				region: "Nord",
				center: {
					latitude: 50.693731,
					longitude: 2.970973
				}
			},
			OISE: {
				code: "60",
				name: "Oise",
				region: "Picardie",
				center: {
					latitude: 49.316528,
					longitude: 2.468694
				}
			},
			ORNE: {
				code: "61",
				name: "Orne",
				region: "Basse-Normandie",
				center: {
					latitude: 48.658825,
					longitude: 0.115679
				}
			},
			PAS_DE_CALAIS: {
				code: "62",
				name: "Pas-de-Calais",
				region: "Nord",
				center: {
					latitude: 50.452973,
					longitude: 2.371892
				}
			},
			PUY_DE_DOME: {
				code: "63",
				name: "Puy-de-Dôme",
				region: "Auvergne",
				center: {
					latitude: 45.771728,
					longitude: 3.124682
				}
			},
			PYRENEES_ATLANTIQUES: {
				code: "64",
				name: "Pyrénées-Atlantiques",
				region: "Aquitaine",
				center: {
					latitude: 43.268179,
					longitude: -0.664279
				}
			},
			HAUTES_PYRENEES: {
				code: "65",
				name: "Hautes-Pyrénées",
				region: "Midi-Pyrénées",
				center: {
					latitude: 43.104229,
					longitude: 0.175959
				}
			},
			PYRENEES_ORIENTALES: {
				code: "66",
				name: "Pyrénées-Orientales",
				region: "Languedoc",
				center: {
					latitude: 42.619209,
					longitude: 2.467587
				}
			},
			BAS_RHIN: {
				code: "67",
				name: "Bas-Rhin",
				region: "Alsace",
				center: {
					latitude: 48.598214,
					longitude: 7.691452
				}
			},
			HAUT_RHIN: {
				code: "68",
				name: "Haut-Rhin",
				region: "Alsace",
				center: {
					latitude: 47.761518,
					longitude: 7.338690
				}
			},
			RHONE: {
				code: "69",
				name: "Rhône",
				region: "Rhône-Alpes",
				center: {
					latitude: 45.673624,
					longitude: 4.870888
				}
			},
			HAUTE_SAONE: {
				code: "70",
				name: "Haute-Saône",
				region: "Franche-Comté",
				center: {
					latitude: 47.626323,
					longitude: 6.093195
				}
			},
			SAONE_ET_LOIRE: {
				code: "71",
				name: "Saône-et-Loire",
				region: "Bourgogne",
				center: {
					latitude: 46.709622,
					longitude: 4.642818
				}
			},
			SARTHE: {
				code: "72",
				name: "Sarthe",
				region: "Pays-de-la-Loire",
				center: {
					latitude: 48.009257,
					longitude: 0.187596
				}
			},
			SAVOIE: {
				code: "73",
				name: "Savoie",
				region: "Rhône-Alpes",
				center: {
					latitude: 45.524947,
					longitude: 6.475145
				}
			},
			HAUTE_SAVOIE: {
				code: "74",
				name: "Haute-Savoie",
				region: "Rhône-Alpes",
				center: {
					latitude: 46.099732,
					longitude: 6.468988
				}
			},
			PARIS: {
				code: "75",
				name: "Paris",
				region: "Ile-de-France",
				center: {
					latitude: 48.856431,
					longitude: 2.347232
				}
			},
			SEINE_MARITIME: {
				code: "76",
				name: "Seine-Maritime",
				region: "Haute-Normandie",
				center: {
					latitude: 49.639142,
					longitude: 1.070904
				}
			},
			SEINE_ET_MARNE: {
				code: "77",
				name: "Seine-et-Marne",
				region: "Ile-de-France",
				center: {
					latitude: 48.647124,
					longitude: 2.981160
				}
			},
			YVELINES: {
				code: "78",
				name: "Yvelines",
				region: "Ile-de-France",
				center: {
					latitude: 48.776937,
					longitude: 1.873354
				}
			},
			DEUX_SEVRES: {
				code: "79",
				name: "Deux-Sèvres",
				region: "Poitou-Charente",
				center: {
					latitude: 46.572161,
					longitude: -0.264733
				}
			},
			SOMME: {
				code: "80",
				name: "Somme",
				region: "Picardie",
				center: {
					latitude: 49.900910,
					longitude: 2.302340
				}
			},
			TARN: {
				code: "81",
				name: "Tarn",
				region: "Midi-Pyrénées",
				center: {
					latitude: 43.885989,
					longitude: 2.170418
				}
			},
			TARN_ET_GARONNE: {
				code: "82",
				name: "Tarn-et-Garonne",
				region: "Midi-Pyrénées",
				center: {
					latitude: 44.046713,
					longitude: 1.310303
				}
			},
			VAR: {
				code: "83",
				name: "Var",
				region: "Provence-Alpes-Côte d\"Azur",
				center: {
					latitude: 43.510086,
					longitude: 6.258967
				}
			},
			VAUCLUSE: {
				code: "84",
				name: "Vaucluse",
				region: "Provence-Alpes-Côte d\"Azur",
				center: {
					latitude: 44.007126,
					longitude: 5.197715
				}
			},
			VENDEE: {
				code: "85",
				name: "Vendée",
				region: "Pays-de-la-Loire",
				center: {
					latitude: 46.667293,
					longitude: -1.295977
				}
			},
			VIENNE: {
				code: "86",
				name: "Vienne",
				region: "Poitou-Charente",
				center: {
					latitude: 46.569662,
					longitude: 0.378321
				}
			},
			HAUTE_VIENNE: {
				code: "87",
				name: "Haute-Vienne",
				region: "Limousin",
				center: {
					latitude: 45.864626,
					longitude: 1.248192
				}
			},
			VOSGES: {
				code: "88",
				name: "Vosges",
				region: "Lorraine",
				center: {
					latitude: 48.178907,
					longitude: 6.333206
				}
			},
			YONNE: {
				code: "89",
				name: "Yonne",
				region: "Bourgogne",
				center: {
					latitude: 47.837701,
					longitude: 3.470768
				}
			},
			TERRITOIRE_DE_BELFORT: {
				code: "90",
				name: "Territoire-de-Belfort",
				region: "Franche-Comté",
				center: {
					latitude: 47.633413,
					longitude: 6.886647
				}
			},
			ESSONNE: {
				code: "91",
				name: "Essonne",
				region: "Ile-de-France",
				center: {
					latitude: 48.497139,
					longitude: 2.232220
				}
			},
			HAUTS_DE_SEINE: {
				code: "92",
				name: "Hauts-de-Seine",
				region: "Ile-de-France",
				center: {
					latitude: 48.851227,
					longitude: 2.207676
				}
			},
			SEINE_ST_DENIS: {
				code: "93",
				name: "Seine-St-Denis",
				region: "Ile-de-France",
				center: {
					latitude: 48.929108,
					longitude: 2.357787
				}
			},
			VAL_DE_MARNE: {
				code: "94",
				name: "Val-de-Marne",
				region: "Ile-de-France",
				center: {
					latitude: 48.777165,
					longitude: 2.461472
				}
			},
			VAL_DOISE: {
				code: "95",
				name: "Val-d\"Oise",
				region: "Ile-de-France",
				center: {
					latitude: 49.072840,
					longitude: 2.124515
				}
			},
		});

		return {
			values: DEPARTMENTS.enums,
			DEPARTMENTS: DEPARTMENTS,
			getDepartmentByCode: function(code) {

				switch (code.toString().toUpperCase()) {
					case "01":
						if (true) {
							return DEPARTMENTS.AIN.value;
						}
						break;
					case "02":
						if (true) {
							return DEPARTMENTS.AISNE.value;
						}
						break;
					case "2A":
						if (true) {
							return DEPARTMENTS.CORSE_DU_SUD.value;
						}
						break;
					case "2B":
						if (true) {
							return DEPARTMENTS.HAUTE_CORSE.value;
						}
						break;
					case "03":
						if (true) {
							return DEPARTMENTS.ALLIER.value;
						}
						break;
					case "04":
						if (true) {
							return DEPARTMENTS.ALPES_DE_HAUTE_PROVENCE.value;
						}
						break;
					case "05":
						if (true) {
							return DEPARTMENTS.HAUTES_ALPES.value;
						}
						break;
					case "06":
						if (true) {
							return DEPARTMENTS.ALPES_MARITIMES.value;
						}
						break;
					case "07":
						if (true) {
							return DEPARTMENTS.ARDECHE.value;
						}
						break;
					case "08":
						if (true) {
							return DEPARTMENTS.ARDENNES.value;
						}
						break;
					case "09":
						if (true) {
							return DEPARTMENTS.ARIEGE.value;
						}
						break;
					case "10":
						if (true) {
							return DEPARTMENTS.AUBE.value;
						}
						break;
					case "11":
						if (true) {
							return DEPARTMENTS.AUDE.value;
						}
						break;
					case "12":
						if (true) {
							return DEPARTMENTS.AVEYRON.value;
						}
						break;
					case "13":
						if (true) {
							return DEPARTMENTS.BOUCHES_DU_RHONE.value;
						}
						break;
					case "14":
						if (true) {
							return DEPARTMENTS.CALVADOS.value;
						}
						break;
					case "15":
						if (true) {
							return DEPARTMENTS.CANTAL.value;
						}
						break;
					case "16":
						if (true) {
							return DEPARTMENTS.CHARENTE.value;
						}
						break;
					case "17":
						if (true) {
							return DEPARTMENTS.CHARENTE_MARITIME.value;
						}
						break;
					case "18":
						if (true) {
							return DEPARTMENTS.CHER.value;
						}
						break;
					case "19":
						if (true) {
							return DEPARTMENTS.CORREZE.value;
						}
						break;
					case "21":
						if (true) {
							return DEPARTMENTS.COTE_DOR.value;
						}
						break;
					case "22":
						if (true) {
							return DEPARTMENTS.COTES_DARMOR.value;
						}
						break;
					case "23":
						if (true) {
							return DEPARTMENTS.CREUSE.value;
						}
						break;
					case "24":
						if (true) {
							return DEPARTMENTS.DORDOGNE.value;
						}
						break;
					case "25":
						if (true) {
							return DEPARTMENTS.DOUBS.value;
						}
						break;
					case "26":
						if (true) {
							return DEPARTMENTS.DROME.value;
						}
						break;
					case "27":
						if (true) {
							return DEPARTMENTS.EURE.value;
						}
						break;
					case "28":
						if (true) {
							return DEPARTMENTS.EURE_ET_LOIR.value;
						}
						break;
					case "29":
						if (true) {
							return DEPARTMENTS.FINISTERE.value;
						}
						break;
					case "30":
						if (true) {
							return DEPARTMENTS.GARD.value;
						}
						break;
					case "31":
						if (true) {
							return DEPARTMENTS.HAUTE_GARONNE.value;
						}
						break;
					case "32":
						if (true) {
							return DEPARTMENTS.GERS.value;
						}
						break;
					case "33":
						if (true) {
							return DEPARTMENTS.GIRONDE.value;
						}
						break;
					case "34":
						if (true) {
							return DEPARTMENTS.HERAULT.value;
						}
						break;
					case "35":
						if (true) {
							return DEPARTMENTS.ILLE_ET_VILAINE.value;
						}
						break;
					case "36":
						if (true) {
							return DEPARTMENTS.INDRE.value;
						}
						break;
					case "37":
						if (true) {
							return DEPARTMENTS.INDRE_ET_LOIRE.value;
						}
						break;
					case "38":
						if (true) {
							return DEPARTMENTS.ISERE.value;
						}
						break;
					case "39":
						if (true) {
							return DEPARTMENTS.JURA.value;
						}
						break;
					case "40":
						if (true) {
							return DEPARTMENTS.LANDES.value;
						}
						break;
					case "41":
						if (true) {
							return DEPARTMENTS.LOIR_ET_CHER.value;
						}
						break;
					case "42":
						if (true) {
							return DEPARTMENTS.LOIRE.value;
						}
						break;
					case "43":
						if (true) {
							return DEPARTMENTS.HAUTE_LOIRE.value;
						}
						break;
					case "44":
						if (true) {
							return DEPARTMENTS.LOIRE_ATLANTIQUE.value;
						}
						break;
					case "45":
						if (true) {
							return DEPARTMENTS.LOIRET.value;
						}
						break;
					case "46":
						if (true) {
							return DEPARTMENTS.LOT.value;
						}
						break;
					case "47":
						if (true) {
							return DEPARTMENTS.LOT_ET_GARONNE.value;
						}
						break;
					case "48":
						if (true) {
							return DEPARTMENTS.LOZERE.value;
						}
						break;
					case "49":
						if (true) {
							return DEPARTMENTS.MAINE_ET_LOIRE.value;
						}
						break;
					case "50":
						if (true) {
							return DEPARTMENTS.MANCHE.value;
						}
						break;
					case "51":
						if (true) {
							return DEPARTMENTS.MARNE.value;
						}
						break;
					case "52":
						if (true) {
							return DEPARTMENTS.HAUTE_MARNE.value;
						}
						break;
					case "53":
						if (true) {
							return DEPARTMENTS.MAYENNE.value;
						}
						break;
					case "54":
						if (true) {
							return DEPARTMENTS.MEURTHE_ET_MOSELLE.value;
						}
						break;
					case "55":
						if (true) {
							return DEPARTMENTS.MEUSE.value;
						}
						break;
					case "56":
						if (true) {
							return DEPARTMENTS.MORBIHAN.value;
						}
						break;
					case "57":
						if (true) {
							return DEPARTMENTS.MOSELLE.value;
						}
						break;
					case "58":
						if (true) {
							return DEPARTMENTS.NIEVRE.value;
						}
						break;
					case "59":
						if (true) {
							return DEPARTMENTS.NORD.value;
						}
						break;
					case "60":
						if (true) {
							return DEPARTMENTS.OISE.value;
						}
						break;
					case "61":
						if (true) {
							return DEPARTMENTS.ORNE.value;
						}
						break;
					case "62":
						if (true) {
							return DEPARTMENTS.PAS_DE_CALAIS.value;
						}
						break;
					case "63":
						if (true) {
							return DEPARTMENTS.PUY_DE_DOME.value;
						}
						break;
					case "64":
						if (true) {
							return DEPARTMENTS.PYRENEES_ATLANTIQUES.value;
						}
						break;
					case "65":
						if (true) {
							return DEPARTMENTS.HAUTES_PYRENEES.value;
						}
						break;
					case "66":
						if (true) {
							return DEPARTMENTS.PYRENEES_ORIENTALES.value;
						}
						break;
					case "67":
						if (true) {
							return DEPARTMENTS.BAS_RHIN.value;
						}
						break;
					case "68":
						if (true) {
							return DEPARTMENTS.HAUT_RHIN.value;
						}
						break;
					case "69":
						if (true) {
							return DEPARTMENTS.RHONE.value;
						}
						break;
					case "70":
						if (true) {
							return DEPARTMENTS.HAUTE_SAONE.value;
						}
						break;
					case "71":
						if (true) {
							return DEPARTMENTS.SAONE_ET_LOIRE.value;
						}
						break;
					case "72":
						if (true) {
							return DEPARTMENTS.SARTHE.value;
						}
						break;
					case "73":
						if (true) {
							return DEPARTMENTS.SAVOIE.value;
						}
						break;
					case "74":
						if (true) {
							return DEPARTMENTS.HAUTE_SAVOIE.value;
						}
						break;
					case "75":
						if (true) {
							return DEPARTMENTS.PARIS.value;
						}
						break;
					case "76":
						if (true) {
							return DEPARTMENTS.SEINE_MARITIME.value;
						}
						break;
					case "77":
						if (true) {
							return DEPARTMENTS.SEINE_ET_MARNE.value;
						}
						break;
					case "78":
						if (true) {
							return DEPARTMENTS.YVELINES.value;
						}
						break;
					case "79":
						if (true) {
							return DEPARTMENTS.DEUX_SEVRES.value;
						}
						break;
					case "80":
						if (true) {
							return DEPARTMENTS.SOMME.value;
						}
						break;
					case "81":
						if (true) {
							return DEPARTMENTS.TARN.value;
						}
						break;
					case "82":
						if (true) {
							return DEPARTMENTS.TARN_ET_GARONNE.value;
						}
						break;
					case "83":
						if (true) {
							return DEPARTMENTS.VAR.value;
						}
						break;
					case "84":
						if (true) {
							return DEPARTMENTS.VAUCLUSE.value;
						}
						break;
					case "85":
						if (true) {
							return DEPARTMENTS.VENDEE.value;
						}
						break;
					case "86":
						if (true) {
							return DEPARTMENTS.VIENNE.value;
						}
						break;
					case "87":
						if (true) {
							return DEPARTMENTS.HAUTE_VIENNE.value;
						}
						break;
					case "88":
						if (true) {
							return DEPARTMENTS.VOSGES.value;
						}
						break;
					case "89":
						if (true) {
							return DEPARTMENTS.YONNE.value;
						}
						break;
					case "90":
						if (true) {
							return DEPARTMENTS.TERRITOIRE_DE_BELFORT.value;
						}
						break;
					case "91":
						if (true) {
							return DEPARTMENTS.ESSONNE.value;
						}
						break;
					case "92":
						if (true) {
							return DEPARTMENTS.HAUTS_DE_SEINE.value;
						}
						break;
					case "93":
						if (true) {
							return DEPARTMENTS.SEINE_ST_DENIS.value;
						}
						break;
					case "94":
						if (true) {
							return DEPARTMENTS.VAL_DE_MARNE.value;
						}
						break;
					case "95":
						if (true) {
							return DEPARTMENTS.VAL_DOISE.value;
						}
						break;
				}
			}
		};
	});