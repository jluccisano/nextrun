"use strict";

angular.module("nextrunApp.route").factory("RouteService",
	function(
		$q,
		$log,
		GmapsApiService,
		RouteUtilsService,
		RouteHelperService,
		RaceTypeEnum) {



		var getAllLatlngFromPoints = function(points) {
			var samplesLatlng = [];

			_.each(points, function(point) {
				samplesLatlng.push(GmapsApiService.LatLng(point.lat, point.lng));
			});

			return samplesLatlng;
		};

		return {

			getElevation: function(segment) {

				var defer = $q.defer();

				var samplingPoints = segment.getSamplingPoints();
				var samplesLatlng = getAllLatlngFromPoints(samplingPoints);

				GmapsApiService.ElevationService().getElevationForLocations({
					"locations": samplesLatlng
				}, function(result, status) {
					if (status === google.maps.ElevationStatus.OK) {

						var data = {
							samplingPoints: samplingPoints,
							elevations: result
						};

						defer.resolve(data);
					} else {
						defer.reject(status);
					}
				});
				return defer.promise;

			},

			createRoutesViewModel: function(race, chartConfig, gmapsConfig) {

				var routesViewModel = [];

				if (race) {
					var raceType = RaceTypeEnum.getRaceTypeByName(race.type);

					_.each(raceType.routes, function(routeType, index) {

						var currentRoute;

						if (!_.isUndefined(race.routes[index])) {
							currentRoute = race.routes[index];
						} else {
							currentRoute = {
								type: routeType,
								segments: [],
								elevationPoints: []
							};
						}

						var route = new routeBuilder.Route(currentRoute, chartConfig, gmapsConfig);

						route.setCenter(RouteUtilsService.getCenter(race));

						routesViewModel.push(route);

					});

					routesViewModel[0].setVisible(true);

				}
				return routesViewModel;

			},


			createNewSegment: function(route, destinationLatlng) {

				var lastLatlngOfLastSegment;

				var isFirstPoint = false;

				var _this = this;

				if (route.segments.length > 0) {
					var lastPointOfLastSegment = route.getLastPointOfLastSegment();
					lastLatlngOfLastSegment = GmapsApiService.LatLng(lastPointOfLastSegment.getLatitude(), lastPointOfLastSegment.getLongitude());
				} else {
					lastLatlngOfLastSegment = destinationLatlng;
					isFirstPoint = true;
				}

				if (route.getTravelMode() !== "NONE") {

					var directionsRequest = {
						origin: lastLatlngOfLastSegment,
						destination: destinationLatlng,
						travelMode: route.getTravelMode(),
						provideRouteAlternatives: false,
						avoidHighways: true,
						avoidTolls: true,
						unitSystem: google.maps.UnitSystem.METRIC
					};

					this.getDirection(route, directionsRequest, isFirstPoint).then(function(result) {

						//add pôlylines to map 
						//call draw polylines

						//draw segment
						route.addMarkerToRoute(result.path);

						if (!isFirstPoint) {
							route.addPolyline(result.path, false, false, false, true, "red", 5);
						}

						return _this.getElevation(result.segment);

					}).then(function(data) {

						//add point to chart

						route.addElevationPoints(data.samplingPoints, data.elevations);


					});
				}
			},
			resetRoute: function(route) {
				route.data.ascendant = 0;
				route.data.descendant = 0;
				route.data.minElevation = 0;
				route.data.maxElevation = 0;
				route.data.distance = 0.0;
				route.data.elevationPoints = [];
				route.data.segments = [];
				route.segments = [];
				route.elevationPoints = [];

				route._markers.length = 0;
				route._polylines.length = 0;
				route._climbs = [];

				route._chartConfig.series[0].data = [];
				route._chartConfig.series[1].data = [];
				route._chartConfig.series[2].data = [];
				route._chartConfig.series[3].data = [];
				route._chartConfig.series[4].data = [];
			},

			deleteLastSegment: function(route) {
				try {

					if (route.getSegments().length > 0) {

						var lastSegment = route.getLastSegment();

						route.removeLastSegment();

						route.removeLastMarker();

						//set the new end marker
						if (route.getMarkers().length > 1) {
							var marker = route.getLastMarker();
							marker.icon = "client/modules/route/images/end.png";
						}

						route.data.elevationPoints = _.difference(route.data.elevationPoints, _.where(route.data.elevationPoints, {
							"segmentId": lastSegment.getId()
						}));


						route.clearSegment();

						route.removePointsToElevationChartBySegmentId(lastSegment.getId());
					}

				} catch (ex) {
					$log.error("an error occured during undo", ex.message);
				}
			},

			getDirection: function(route, directionsRequest, isFirstPoint) {

				var defer = $q.defer();

				GmapsApiService.DirectionsService().route(directionsRequest, function(result, status) {
					if (status === google.maps.DirectionsStatus.OK) {

						var path = result.routes[0].overview_path;
						var legs = result.routes[0].legs;

						var points = RouteUtilsService.convertPathToPoints(path, isFirstPoint);
						var distance = RouteUtilsService.calculateDistanceFromLegs(legs);

						var segmentDataModel = {
							id: routeBuilder.generateUUID(),
							distance: distance,
							points: points
						};

						var segment = route.addSegment(segmentDataModel);

						var data = {
							segment: segment,
							path: path
						};

						defer.resolve(data);
					} else {
						defer.reject(status);
					}
				});
				return defer.promise;
			},



			/********************************/


			/*onClickMap: function(route, destinationLatlng) {

				var lastLatlngOfLastSegment;

				var isFirstPoint = false;

				if (route.segments.length > 0) {
					lastLatlngOfLastSegment = route.getLastPointOfLastSegment(route.segments).latlng;
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

							this.addSegment(route.overview_path, route.legs, isFirstPoint);


							//lastPointOfLastSegment = SegmentService.getLastPointOfLastSegment(route.segments);

							//newSegment.points = SegmentService.calculateDistanceFromStartForEachPointOfSegment(newSegment.points, lastPointOfLastSegment);

							//var samplesPoints = SegmentService.findSamplesPointIntoSegment(route, newSegment, 0.1);

							//route.segments.push(newSegment);

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
			/*drawPolylines: function(segments) {

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
			},*/
			/*rebuildPolylines: function(segments) {

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
			},*/
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
			/*rebuildMarkers: function(segments, showSegment) {

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
			},*/
			/*rebuildElevationChart: function(route) {

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
			},*/
			/*undo: function(route) {

				
			}*/
		};
	});