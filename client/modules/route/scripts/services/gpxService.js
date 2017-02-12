"use strict";

angular.module("nextrunApp.route").factory("GpxService",
	function(x2js, RouteService, RouteUtilsService, MarkerService, PolylineService, ElevationService) {

		return {

			getTrkpts: function(gpxToJson) {

				if (!angular.isObject(gpxToJson) || angular.isUndefined(gpxToJson.gpx) || angular.isUndefined(gpxToJson.gpx.trk) || angular.isUndefined(gpxToJson.gpx.trk.trkseg) || angular.isUndefined(gpxToJson.gpx.trk.trkseg.trkpt)) {
					throw new Error("parse.gpx.error");
				}

				return gpxToJson.gpx.trk.trkseg.trkpt;
			},

			/**
			 * Cette fonction split la liste des trkpts contenu dans le gpx en un nombre de segment
			 * Cela permettra d"éditer plus facilement la route. La taille du segment est définit par la taille
			 * de la liste des trkpts.
			 * @param  trkpts
			 * @throws {Error} If trkpts must contain at least one element
			 * @returns an array of {Segment}
			 */
			splitTrkptsToSegments: function(trkpts) {

				var segmentsDataModel = [];

				if (!trkpts || trkpts.length === 0) {
					throw new Error("trkpts must contain at least one element");
				}

				var offset = parseInt(trkpts.length * 0.05);
				var pointer = 0;

				var segmentDataModel = {
					id: routeBuilder.generateUUID(),
					distance: 0,
					points: []
				};

				angular.forEach(trkpts, function(trkpt, i) {

					if (pointer === offset || i === (trkpts.length - 1)) {

						segmentDataModel = {
							id: routeBuilder.generateUUID(),
							distance: 0,
							points: []
						};

						segmentsDataModel.push(segmentDataModel);

						pointer = 0;
					}

					var point = {
						lat: parseFloat(trkpt._lat),
						lng: parseFloat(trkpt._lon),
						elevation: 0,
						distanceFromStart: 0,
						grade: 0
					};

					segmentDataModel.points.push(point);

					pointer++;

				});
				return segmentsDataModel;
			},

			convertRouteToGPX: function(route, name) {

				var gpxToXML;

				var content = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";

				var json = {
					"gpx": {
						"_xmlns": "http://www.topografix.com/GPX/1/1",
						"_creator": "nextrun.fr",
						"_version": "1.1",
						"_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
						"_xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
						"trk": {
							"name": name,
							"trkseg": {}
						}
					}
				};

				var arrayOfTrkpt = [];

				angular.forEach(route.getSegments(), function(segment) {

					angular.forEach(segment.getPoints(), function(point) {

						var trkpt = {
							"_lat": point.getLatitude(),
							"_lon": point.getLongitude()
						};

						arrayOfTrkpt.push(trkpt);

					});

				});

				json.gpx.trk.trkseg.trkpt = arrayOfTrkpt;

				gpxToXML = x2js.json2xml_str(json);

				return content + gpxToXML;
			},

			convertGPXtoRoute: function(routeViewModel, gpx) {

				try {

					var gpxToJson = x2js.xml_str2json(gpx);

					var trkpts = this.getTrkpts(gpxToJson);

					var segmentsDataModel = this.splitTrkptsToSegments(trkpts);

					angular.forEach(segmentsDataModel, function(segmentDataModel) {

						var segmentViewModel = routeViewModel.addSegment(segmentDataModel);

						var segmentPath = RouteUtilsService.convertPointsToPath(segmentViewModel.data.points);

						MarkerService.addMarkerToRoute(routeViewModel, segmentPath);

						PolylineService.createPolyline(routeViewModel, segmentPath, false, false, false, true, "red", 5);

						ElevationService.getElevation(segmentViewModel).then(function(data) {
							routeViewModel.addElevationPoints(data.samplingPoints, data.elevations);
						});
					});

				} catch (ex) {
					throw new Error(ex);
				}

				return routeViewModel;
			}
		};
	});