"use strict";

angular.module("nextrunApp.route").factory("GpxService",
	function(XmlService, RouteUtilsService, SegmentService, ElevationService) {

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
			splitTrkptsToSegments: function(route, trkpts) {

				var segments = [];

				if (!trkpts || trkpts.length === 0) {
					throw new Error("trkpts must contain at least one element");
				}

				var offset = parseInt(trkpts.length * 0.05);
				var pointer = 0;

				var segment = {
					segmentId: RouteUtilsService.generateUUID(),
					points: [],
					distance: 0
				};

				_.each(trkpts, function(trkpt, i) {

					//dès que l"on a atteint l"offset on extrait les points pour l"elevation et on calcule la distance du segment
					//enfin on recrée un nouveau segment
					if (pointer === offset || i === (trkpts.length - 1)) {

						//calculate distance
						
						segment.distance = SegmentService.calculateDistanceFromStartForEachPointOfSegment(route, segment);

						//add segment into the list
						segments.push(segment);

						//create new segment
						segment = {
							segmentId: RouteUtilsService.generateUUID(),
							points: [],
							distance: 0
						};

						pointer = 0;
					}
				});
				return segments;
			},


			convertGPXtoRoute: function(gpx) {

				var route = {};
				
				try {
					
					route.segments = [];
					route.elevationPoints = [];
					route.chartConfig = {};
					route.chartConfig.series = [];

					var gpxToJson = XmlService.xml2json(gpx);

					var trkpts = this.getTrkpts(gpxToJson);

					//create first segment with start marker
					var segment1Id = RouteUtilsService.generateUUID();
					var segment1 = {
						segmentId: segment1Id,
						points: [{
							latlng: {
								mb: trkpts[0]._lat,
								nb: trkpts[0]._lon
							},
							elevation: trkpts[0].ele,
							distanceFromStart: 0,
							grade: 0,
							segmentId: segment1Id
						}],
						distance: 0
					};

					route.segments.push(segment1);
					
					route.segments = this.splitTrkptsToSegments(trkpts);

					var sample = parseInt(trkpts.length * 0.05) * 0.001;

					_.each(route.segments, function(segment) {

						var samplePoints = SegmentService.findSamplesPointIntoSegment(segment, sample);

						var samplesLatlng = ElevationService.getAllLatlngFromPoints(samplePoints);

						ElevationService.getElevationFromLocation(samplesLatlng, function(result, status) {

							if (status !== google.maps.ElevationStatus.OK) {
								return;
							}

							for (var k = 0; k < result.length; k++) {

								samplePoints[k].elevation = result[k].elevation;

								var lastElevationPoint = ElevationService.getLastElevationPoint(route.elevationPoints);

								if (lastElevationPoint) {
									ElevationService.setGrade(lastElevationPoint, samplePoints[k]);
								}

								route.elevationPoints.push(samplePoints[k]);
							}


							ElevationService.calculateElevationDataAlongRoute(route);

							ElevationService.addPointsToElevationChart(route.chartConfig.series, samplePoints);

						});

					});

				} catch (ex) {
					throw new Error(ex);
				}

				return route;
			}
		};
	});