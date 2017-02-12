"use strict";

angular.module("nextrunApp.commons").factory("DepartmentEnum",
	function($filter) {

		var departments = [{
			code: "01",
			name: "Ain",
			region: "Rhône-Alpes",
			center: {
				latitude: 46.324172,
				longitude: 5.135284
			}
		}, {
			code: "02",
			name: "Aisne",
			region: "Picardie",
			center: {
				latitude: 49.553726,
				longitude: 3.459869
			}
		}, {
			code: "2A",
			name: "Corse du Sud",
			region: "Corse",
			center: {
				latitude: 41.853196,
				longitude: 8.997391
			}
		}, {
			code: "2B",
			name: "Haute-Corse",
			region: "Corse",
			center: {
				latitude: 42.468045,
				longitude: 9.238678
			}
		}, {
			code: "03",
			name: "Allier",
			region: "Auvergne",
			center: {
				latitude: 46.418926,
				longitude: 3.281754
			}
		}, {
			code: "04",
			name: "Alpes de Haute-Provence",
			region: "Provence-Alpes-Côte d\"Azur",
			center: {
				latitude: 44.162504,
				longitude: 6.244904
			}
		}, {
			code: "05",
			name: "Hautes-Alpes",
			region: "Provence-Alpes-Côte d\"Azur",
			center: {
				latitude: 44.6413,
				longitude: 6.31398
			}
		}, {
			code: "06",
			name: "Alpes-Maritimes",
			region: "Provence-Alpes-Côte d\"Azur",
			center: {
				latitude: 43.931528,
				longitude: 7.1819
			}
		}, {
			code: "07",
			name: "Ardèche",
			region: "Rhône-Alpes",
			center: {
				latitude: 44.750634,
				longitude: 4.432159
			}
		}, {
			code: "08",
			name: "Ardennes",
			region: "Champagne",
			center: {
				latitude: 49.624946,
				longitude: 4.613434
			}
		}, {
			code: "09",
			name: "Ariège",
			region: "Midi-Pyrénées",
			center: {
				latitude: 42.958433,
				longitude: 1.441544
			}
		}, {
			code: "10",
			name: "Aube",
			region: "Champagne",
			center: {
				latitude: 48.312428,
				longitude: 4.157501
			}
		}, {
			code: "11",
			name: "Aude",
			region: "Languedoc-Roussillon",
			center: {
				latitude: 43.115019,
				longitude: 2.383621
			}
		}, {
			code: "12",
			name: "Aveyron",
			region: "Midi-Pyrénées",
			center: {
				latitude: 44.359248,
				longitude: 2.568629
			}
		}, {
			code: "13",
			name: "Bouches du Rhône",
			region: "Provence-Alpes-Côte d\"Azur",
			center: {
				latitude: 43.645205,
				longitude: 5.020446
			}
		}, {
			code: "14",
			name: "Calvados",
			region: "Basse-Normandie",
			center: {
				latitude: 49.074610,
				longitude: -0.408835
			}
		}, {
			code: "15",
			name: "Cantal",
			region: "Auvergne",
			center: {
				latitude: 45.094237,
				longitude: 2.673228
			}
		}, {
			code: "16",
			name: "Charente",
			region: "Poitou-Charente",
			center: {
				latitude: 45.662427,
				longitude: 0.189825
			}
		}, {
			code: "17",
			name: "Charente Maritime",
			region: "Poitou-Charente",
			center: {
				latitude: 45.774196,
				longitude: -0.698698
			}
		}, {
			code: "18",
			name: "Cher",
			region: "Centre",
			center: {
				latitude: 47.084676,
				longitude: 2.423964
			}
		}, {
			code: "19",
			name: "Corrèze",
			region: "Limousin",
			center: {
				latitude: 0,
				longitude: 0
			}
		}, {
			code: "21",
			name: "Côte d\"Or",
			region: "Bourgogne",
			center: {
				latitude: 45.261645,
				longitude: 1.799338
			}
		}, {
			code: "22",
			name: "Côtes d\"Armor",
			region: "Bretagne",
			center: {
				latitude: 0,
				longitude: 0
			}
		}, {
			code: "23",
			name: "Creuse",
			region: "Limousin",
			center: {
				latitude: 48.402972,
				longitude: -2.787485
			}
		}, {
			code: "24",
			name: "Dordogne",
			region: "Aquitaine",
			center: {
				latitude: 44.931368,
				longitude: 0.620635
			}
		}, {
			code: "25",
			name: "Doubs",
			region: "Franche-Comté",
			center: {
				latitude: 47.141537,
				longitude: 6.350242
			}
		}, {
			code: "26",
			name: "Drôme",
			region: "Rhône-Alpes",
			center: {
				latitude: 44.661400,
				longitude: 5.153510
			}
		}, {
			code: "27",
			name: "Eure",
			region: "Haute-Normandie",
			center: {
				latitude: 49.122611,
				longitude: 1.052665
			}
		}, {
			code: "28",
			name: "Eure-et-Loir",
			region: "Centre",
			center: {
				latitude: 48.405504,
				longitude: 1.416317
			}
		}, {
			code: "29",
			name: "Finistère",
			region: "Bretagne",
			center: {
				latitude: 48.249350,
				longitude: -3.994772
			}
		}, {
			code: "30",
			name: "Gard",
			region: "Languedoc",
			center: {
				latitude: 43.862957,
				longitude: 4.399786
			}
		}, {
			code: "31",
			name: "Haute-Garonne",
			region: "Midi-Pyrénées",
			center: {
				latitude: 43.468868,
				longitude: 1.141754
			}
		}, {
			code: "32",
			name: "Gers",
			region: "Midi-Pyrénées",
			center: {
				latitude: 43.663665,
				longitude: 0.574458
			}
		}, {
			code: "33",
			name: "Gironde",
			region: "Aquitaine",
			center: {
				latitude: 44.821461,
				longitude: -0.533568
			}
		}, {
			code: "34",
			name: "Hérault",
			region: "Languedoc",
			center: {
				latitude: 43.618334,
				longitude: 3.367045
			}
		}, {
			code: "35",
			name: "Ille-et-Vilaine",
			region: "Bretagne",
			center: {
				latitude: 48.125367,
				longitude: -1.641630
			}
		}, {
			code: "36",
			name: "Indre",
			region: "Centre",
			center: {
				latitude: 46.735061,
				longitude: 1.579938
			}
		}, {
			code: "37",
			name: "Indre-et-Loire",
			region: "Centre",
			center: {
				latitude: 47.409495,
				longitude: 0.676434
			}
		}, {
			code: "38",
			name: "Isère",
			region: "Rhône-Alpes",
			center: {
				latitude: 45.173579,
				longitude: 5.729479
			}
		}, {
			code: "39",
			name: "Jura",
			region: "Franche-Comté",
			center: {
				latitude: 46.691084,
				longitude: 5.786931
			}
		}, {
			code: "40",
			name: "Landes",
			region: "Aquitaine",
			center: {
				latitude: 44.045452,
				longitude: -0.819785
			}
		}, {
			code: "41",
			name: "Loir-et-Cher",
			region: "Centre",
			center: {
				latitude: 47.633908,
				longitude: 1.320805
			}
		}, {
			code: "42",
			name: "Loire",
			region: "Rhône-Alpes",
			center: {
				latitude: 45.507975,
				longitude: 4.279566
			}
		}, {
			code: "43",
			name: "Haute-Loire",
			region: "Auvergne",
			center: {
				latitude: 45.053779,
				longitude: 3.842813
			}
		}, {
			code: "44",
			name: "Loire-Atlantique",
			region: "Pays-de-la-Loire",
			center: {
				latitude: 47.213843,
				longitude: -1.502460
			}
		}, {
			code: "45",
			name: "Loiret",
			region: "Centre",
			center: {
				latitude: 47.904785,
				longitude: 2.608321
			}
		}, {
			code: "46",
			name: "Lot",
			region: "Midi-Pyrénées",
			center: {
				latitude: 44.668982,
				longitude: 1.608566
			}
		}, {
			code: "47",
			name: "Lot-et-Garonne",
			region: "Aquitaine",
			center: {
				latitude: 44.287595,
				longitude: 0.374077
			}
		}, {
			code: "48",
			name: "Lozère",
			region: "Languedoc",
			center: {
				latitude: 44.526034,
				longitude: 3.485662
			}
		}, {
			code: "49",
			name: "Maine-et-Loire",
			region: "Pays-de-la-Loire",
			center: {
				latitude: 47.448900,
				longitude: -0.570805
			}
		}, {
			code: "50",
			name: "Manche",
			region: "Normandie",
			center: {
				latitude: 48.895345,
				longitude: -1.281735
			}
		}, {
			code: "51",
			name: "Marne",
			region: "Champagne",
			center: {
				latitude: 48.940797,
				longitude: 4.322137
			}
		}, {
			code: "52",
			name: "Haute-Marne",
			region: "Champagne",
			center: {
				latitude: 48.141192,
				longitude: 5.154453
			}
		}, {
			code: "53",
			name: "Mayenne",
			region: "Pays-de-la-Loire",
			center: {
				latitude: 47.451686,
				longitude: -0.526860
			}
		}, {
			code: "54",
			name: "Meurthe-et-Moselle",
			region: "Lorraine",
			center: {
				latitude: 48.723838,
				longitude: 6.162051
			}
		}, {
			code: "55",
			name: "Meuse",
			region: "Lorraine",
			center: {
				latitude: 49.127189,
				longitude: 5.382278
			}
		}, {
			code: "56",
			name: "Morbihan",
			region: "Bretagne",
			center: {
				latitude: 47.902047,
				longitude: -2.758784
			}
		}, {
			code: "57",
			name: "Moselle",
			region: "Lorraine",
			center: {
				latitude: 49.025426,
				longitude: 6.595664
			}
		}, {
			code: "58",
			name: "Nièvre",
			region: "Bourgogne",
			center: {
				latitude: 47.148617,
				longitude: 3.585092
			}
		}, {
			code: "59",
			name: "Nord",
			region: "Nord",
			center: {
				latitude: 50.693731,
				longitude: 2.970973
			}
		}, {
			code: "61",
			name: "Orne",
			region: "Basse-Normandie",
			center: {
				latitude: 48.658825,
				longitude: 0.115679
			}
		}, {
			code: "60",
			name: "Oise",
			region: "Picardie",
			center: {
				latitude: 49.316528,
				longitude: 2.468694
			}
		}, {
			code: "62",
			name: "Pas-de-Calais",
			region: "Nord",
			center: {
				latitude: 50.452973,
				longitude: 2.371892
			}
		}, {
			code: "63",
			name: "Puy-de-Dôme",
			region: "Auvergne",
			center: {
				latitude: 45.771728,
				longitude: 3.124682
			}
		}, {
			code: "64",
			name: "Pyrénées-Atlantiques",
			region: "Aquitaine",
			center: {
				latitude: 43.268179,
				longitude: -0.664279
			}
		}, {
			code: "65",
			name: "Hautes-Pyrénées",
			region: "Midi-Pyrénées",
			center: {
				latitude: 43.104229,
				longitude: 0.175959
			}
		}, {
			code: "66",
			name: "Pyrénées-Orientales",
			region: "Languedoc",
			center: {
				latitude: 42.619209,
				longitude: 2.467587
			}
		}, {
			code: "67",
			name: "Bas-Rhin",
			region: "Alsace",
			center: {
				latitude: 48.598214,
				longitude: 7.691452
			}
		}, {
			code: "68",
			name: "Haut-Rhin",
			region: "Alsace",
			center: {
				latitude: 47.761518,
				longitude: 7.338690
			}
		}, {
			code: "69",
			name: "Rhône",
			region: "Rhône-Alpes",
			center: {
				latitude: 45.673624,
				longitude: 4.870888
			}
		}, {
			code: "70",
			name: "Haute-Saône",
			region: "Franche-Comté",
			center: {
				latitude: 47.626323,
				longitude: 6.093195
			}
		}, {
			code: "71",
			name: "Saône-et-Loire",
			region: "Bourgogne",
			center: {
				latitude: 46.709622,
				longitude: 4.642818
			}
		}, {
			code: "72",
			name: "Sarthe",
			region: "Pays-de-la-Loire",
			center: {
				latitude: 48.009257,
				longitude: 0.187596
			}
		}, {
			code: "73",
			name: "Savoie",
			region: "Rhône-Alpes",
			center: {
				latitude: 45.524947,
				longitude: 6.475145
			}
		}, {
			code: "74",
			name: "Haute-Savoie",
			region: "Rhône-Alpes",
			center: {
				latitude: 46.099732,
				longitude: 6.468988
			}
		}, {
			code: "75",
			name: "Paris",
			region: "Ile-de-France",
			center: {
				latitude: 48.856431,
				longitude: 2.347232
			}
		}, {
			code: "76",
			name: "Seine-Maritime",
			region: "Haute-Normandie",
			center: {
				latitude: 49.639142,
				longitude: 1.070904
			}
		}, {
			code: "77",
			name: "Seine-et-Marne",
			region: "Ile-de-France",
			center: {
				latitude: 48.647124,
				longitude: 2.981160
			}
		}, {
			code: "78",
			name: "Yvelines",
			region: "Ile-de-France",
			center: {
				latitude: 48.776937,
				longitude: 1.873354
			}
		}, {
			code: "79",
			name: "Deux-Sèvres",
			region: "Poitou-Charente",
			center: {
				latitude: 46.572161,
				longitude: -0.264733
			}
		}, {
			code: "80",
			name: "Somme",
			region: "Picardie",
			center: {
				latitude: 49.900910,
				longitude: 2.302340
			}
		}, {
			code: "81",
			name: "Tarn",
			region: "Midi-Pyrénées",
			center: {
				latitude: 43.885989,
				longitude: 2.170418
			}
		}, {
			code: "82",
			name: "Tarn-et-Garonne",
			region: "Midi-Pyrénées",
			center: {
				latitude: 44.046713,
				longitude: 1.310303
			}
		}, {
			code: "83",
			name: "Var",
			region: "Provence-Alpes-Côte d\"Azur",
			center: {
				latitude: 43.510086,
				longitude: 6.258967
			}
		}, {
			code: "84",
			name: "Vaucluse",
			region: "Provence-Alpes-Côte d\"Azur",
			center: {
				latitude: 44.007126,
				longitude: 5.197715
			}
		}, {
			code: "85",
			name: "Vendée",
			region: "Pays-de-la-Loire",
			center: {
				latitude: 46.667293,
				longitude: -1.295977
			}
		}, {
			code: "86",
			name: "Vienne",
			region: "Poitou-Charente",
			center: {
				latitude: 46.569662,
				longitude: 0.378321
			}
		}, {
			code: "87",
			name: "Haute-Vienne",
			region: "Limousin",
			center: {
				latitude: 45.864626,
				longitude: 1.248192
			}
		}, {
			code: "88",
			name: "Vosges",
			region: "Lorraine",
			center: {
				latitude: 48.178907,
				longitude: 6.333206
			}
		}, {
			code: "89",
			name: "Yonne",
			region: "Bourgogne",
			center: {
				latitude: 47.837701,
				longitude: 3.470768
			}
		}, {
			code: "90",
			name: "Territoire-de-Belfort",
			region: "Franche-Comté",
			center: {
				latitude: 47.633413,
				longitude: 6.886647
			}
		}, {
			code: "91",
			name: "Essonne",
			region: "Ile-de-France",
			center: {
				latitude: 48.497139,
				longitude: 2.232220
			}
		}, {
			code: "92",
			name: "Hauts-de-Seine",
			region: "Ile-de-France",
			center: {
				latitude: 48.851227,
				longitude: 2.207676
			}
		}, {
			code: "93",
			name: "Seine-St-Denis",
			region: "Ile-de-France",
			center: {
				latitude: 48.929108,
				longitude: 2.357787
			}
		}, {
			code: "94",
			name: "Val-de-Marne",
			region: "Ile-de-France",
			center: {
				latitude: 48.777165,
				longitude: 2.461472
			}
		}, {
			code: "95",
			name: "Val-d\"Oise",
			region: "Ile-de-France",
			center: {
				latitude: 49.072840,
				longitude: 2.124515
			}
		}];

		return {
			getValues: function() {
				return departments;
			},
			getDepartmentByCode: function(code) {
				return $filter("filter")(departments, {
					code: code
				})[0];
			}
		};
	});