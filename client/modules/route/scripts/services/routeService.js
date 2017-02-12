"use strict";

angular.module("nextrunApp.route").factory("RouteService",
	function(
		$log,
		GmapsApiService,
		SegmentService,
		ElevationService,
		MarkerService,
		RouteUtilsService) {
		
		var directionService = GmapsApiService.DirectionsService();

		return {
			onClickMap: function($scope, route, destinationLatlng) {

				var lastLatlngOfLastSegment;

				var isFirstPoint = false;

				if (route.segments.length > 0) {
					lastLatlngOfLastSegment = SegmentService.getLastPointOfLastSegment(route.segments).latlng;
				} else {
					lastLatlngOfLastSegment = {
						mb: destinationLatlng.lat(),
						nb: destinationLatlng.lng()
					};
					isFirstPoint = true;
				}

				if (route.travelMode !== "NONE") {

					var directionsRequest = {
						origin: new google.maps.LatLng(lastLatlngOfLastSegment.mb, lastLatlngOfLastSegment.nb),
						destination: destinationLatlng,
						travelMode: route.travelMode,
						provideRouteAlternatives: false,
						avoidHighways: true,
						avoidTolls: true,
						unitSystem: google.maps.UnitSystem.METRIC

					};

					directionService.route(directionsRequest, function(result, status) {

						if (status === google.maps.DirectionsStatus.OK && directionsRequest.unitSystem === google.maps.UnitSystem.METRIC) {

							var route = result.routes[0];
							var lastPointOfLastSegment;

							var newSegment = SegmentService.createSegment(route.overview_path, route.legs, isFirstPoint);

							lastPointOfLastSegment = SegmentService.getLastPointOfLastSegment(route.segments);

							newSegment.points = SegmentService.calculateDistanceFromStartForEachPointOfSegment(newSegment.points, lastPointOfLastSegment);

							//var samplesPoints = SegmentService.findSamplesPointIntoSegment(route, newSegment, 0.1);

							route.segments.push(newSegment);

							//var newLastPointOfLastSegment = SegmentService.getLastPointOfLastSegment(route.segments);

							//route.distance = updateDistance(newLastPointOfLastSegment);

							//samplesPoints = getElevationFromSamplesPoints($scope, route, segment, result.routes[0].overview_path, samplesPoints);

						}
					});

				} else {

					lastLatlngOfLastSegment = new google.maps.LatLng(lastLatlngOfLastSegment.mb, lastLatlngOfLastSegment.nb);

					var routeSamples = [];
					routeSamples.push(lastLatlngOfLastSegment);
					routeSamples.push(destinationLatlng);

					//var newSegment = createSimpleSegment(lastLatlngOfLastSegment, destinationLatlng);

					//newSegment.points = SegmentService.calculateDistanceFromStartForEachPointOfSegment(route, segment);

					//var samplesPoints = SegmentService.findSamplesPointIntoSegment(route, segment, 0.1);

					//route.segments.push(segment);

					//samplesPoints = getElevationFromSamplesPoints($scope, route, segment, routeSamples, samplesPoints);
				}

				return route;

			},
			drawPolylines: function(segments) {

				var polylines = [];
				var pathArray = [];

				_.each(segments, function(segment, index) {

					var lastPointOfLastSegment;

					if (index > 0) {

						var lastSegment = segments[index - 1];

						if (typeof lastSegment.points[lastSegment.points.length - 1] !== "undefined") {
							lastPointOfLastSegment = lastSegment.points[lastSegment.points.length - 1];
						}

						pathArray.push({
							latitude: lastPointOfLastSegment.latlng.mb,
							longitude: lastPointOfLastSegment.latlng.nb
						});

					}

					_.each(segment.points, function(point) {
						pathArray.push({
							latitude: point.latlng.mb,
							longitude: point.latlng.nb
						});
					});
				});

				var polyLine = {
					id: RouteUtilsService.generateUUID(),
					path: pathArray,
					stroke: {
						color: "red",
						weight: 5
					},
					editable: false,
					draggable: false,
					geodesic: false,
					visible: true
				};

				polylines.push(polyLine);
				return polylines;
			},
			rebuildPolylines: function(segments) {

				var polylines = [];

				_.each(segments, function(segment, index) {

					var pathArray = [];

					var lastPointOfLastSegment;

					if (index > 0) {

						var lastSegment = segments[index - 1];

						if (typeof lastSegment.points[lastSegment.points.length - 1] !== "undefined") {
							lastPointOfLastSegment = lastSegment.points[lastSegment.points.length - 1];
						}

						pathArray.push({
							latitude: lastPointOfLastSegment.latlng.mb,
							longitude: lastPointOfLastSegment.latlng.nb
						});

					}

					_.each(segment.points, function(point) {
						pathArray.push({
							latitude: point.latlng.mb,
							longitude: point.latlng.nb
						});
					});

					var polyLine = {
						id: RouteUtilsService.generateUUID(),
						path: pathArray,
						stroke: {
							color: "red",
							weight: 5
						},
						editable: false,
						draggable: false,
						geodesic: false,
						visible: true
					};

					polylines.push(polyLine);
				});
				return polylines;
			},
			convertRacesLocationToMarkers: function(races) {

				var markers = [];

				_.each(races, function(race) {

					var marker;

					if (race.pin) {
						marker = {
							raceId: race._id,
							raceName: race.name,
							latitude: race.pin.location.lat + (Math.random() - 0.5) / 1500,
							longitude: race.pin.location.lon + (Math.random() - 0.5) / 1500,
							icon: "client/modules/route/images/start.png",
							showWindow: false,
							title: "hello"
						};
					}

					if (marker) {
						markers.push(marker);
					}
				});
				return markers;
			},
			rebuildMarkers: function(segments, showSegment) {

				var markers = [];

				_.each(segments, function(segment, index) {

					var lastPointOfSegment;
					var icon;
					var marker;

					if (typeof segment.points[segment.points.length - 1] !== "undefined") {
						lastPointOfSegment = segment.points[segment.points.length - 1];
					}

					if (index === 0) {
						icon = "client/modules/route/images/start.png";
					} else if (index === (segments.length - 1)) {
						icon = "client/modules/route/images/end.png";
					} else if (showSegment) {
						icon = new google.maps.MarkerImage("client/modules/route/images/segment.png",
							new google.maps.Size(32, 32),
							new google.maps.Point(0, 0),
							new google.maps.Point(8, 8),
							new google.maps.Size(16, 16)
						);
					}

					if (icon) {
						marker = {
							latitude: lastPointOfSegment.latlng.mb,
							longitude: lastPointOfSegment.latlng.nb,
							icon: icon,
							title: "hello"
						};
					}

					if (marker) {
						markers.push(marker);
					}
				});
				return markers;
			},
			rebuildElevationChart: function(route) {

				var datas = [];
				var climbs = {
					climbsInf7: [],
					climbsInf10: [],
					climbsInf15: [],
					climbsSup15: []
				};

				var elevationPoints = _.sortBy(route.elevationPoints, function(elevationPoint) {
					return parseFloat(elevationPoint.distanceFromStart.toFixed(2));
				});

				_.each(elevationPoints, function(elevationPoint, index) {

					var data = {
						x: parseFloat(elevationPoint.distanceFromStart.toFixed(2)),
						y: elevationPoint.elevation,
						grade: elevationPoint.grade,
						color: "blue",
						fillColor: "blue",
						segmentId: elevationPoint.segmentId,
						latlng: elevationPoint.latlng

					};
					datas.push(data);

					climbs = ElevationService.addClimbsToElevationChart(route, elevationPoints, index, climbs);

				});
				route.chartConfig.series[0].data = datas;
				route.chartConfig.series[1].data = climbs.climbsInf7;
				route.chartConfig.series[2].data = climbs.climbsInf10;
				route.chartConfig.series[3].data = climbs.climbsInf15;
				route.chartConfig.series[4].data = climbs.climbsSup15;
			},
			delete: function(route) {

				route.ascendant = 0;
				route.descendant = 0;
				route.minElevation = 0;
				route.maxElevation = 0;
				route.distance = 0.0;
				route.elevationPoints = [];
				route.segments = [];

				route.markers.length = 0;
				route.polylines.length = 0;

				route.chartConfig.series[0].data = [];
				route.chartConfig.series[1].data = [];
				route.chartConfig.series[2].data = [];
				route.chartConfig.series[3].data = [];
				route.chartConfig.series[4].data = [];

			},
			undo: function(route) {

				try {

					if (route.segments.length > 0) {

						var lastSegment = SegmentService.getLastSegment(route.segments);

						SegmentService.removeLastSegment(route);

						MarkerService.removeLastMarker(route.markers);

						//set the new end marker
						if (route.markers.length > 1) {
							var marker = SegmentService.getLastMarker(route.markers);
							marker.icon = "client/modules/route/images/end.png";
						}

						route.elevationPoints = _.difference(route.elevationPoints, _.where(route.elevationPoints, {
							"segmentId": lastSegment.segmentId
						}));


						SegmentService.clearSegment(route);

						ElevationService.removePointsToElevationChartBySegmentId(route, lastSegment.segmentId);
					}

				} catch (ex) {
					$log.error("an error occured during undo", ex.message);
				}
			}
		};
	});