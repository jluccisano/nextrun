"use strict";

angular.module("nextrunApp.route").factory("GpxService",
	function(x2js, RouteService, RouteUtilsService, RouteHelperService) {

		return {

			getTrkpts: function(gpxToJson) {

				if (_.isNull(gpxToJson) || _.isUndefined(gpxToJson) || _.isUndefined(gpxToJson.gpx) || _.isUndefined(gpxToJson.gpx.trk) || _.isUndefined(gpxToJson.gpx.trk.trkseg) || _.isUndefined(gpxToJson.gpx.trk.trkseg.trkpt)) {
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

				_.each(trkpts, function(trkpt, i) {

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


			convertGPXtoRoute: function($scope, routeType, gpx) {
				var routeViewModel = {};

				var routeDataModel = {
					type: routeType,
					segments: [],
					elevationPoints: []
				};

				var center = RouteUtilsService.setCenter($scope, routeDataModel);

				routeViewModel = new routeBuilder.Route(routeDataModel,
					RouteHelperService.getChartConfig($scope),
					RouteHelperService.getGmapsConfig(), center);

				routeViewModel.addClickListener($scope.onClickMap);

				try {

					var gpxToJson = x2js.xml_str2json(gpx);

					var trkpts = this.getTrkpts(gpxToJson);

					var segmentsDataModel = this.splitTrkptsToSegments(trkpts);

					_.each(segmentsDataModel, function(segmentDataModel) {

						var segmentViewModel = routeViewModel.addSegment(segmentDataModel);

						RouteService.getElevation(segmentViewModel).then(function(data) {
							routeViewModel.addElevationPoints(data.samplingPoints, data.elevations);
						});
					});

					//var sample = parseInt(trkpts.length * 0.05) * 0.001;



				} catch (ex) {
					throw new Error(ex);
				}

				return routeViewModel;
			}
		};
	});