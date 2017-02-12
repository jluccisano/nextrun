"use strict";

angular.module("nextrunApp.route").factory("RouteService",
	function(
		$q,
		$log,
		GmapsApiService,
		RouteUtilsService,
		RaceTypeEnum,
		SegmentService, 
		ElevationService,
		MarkerService,
		PolylineService) {


		//TO BE REMOVED
		/*var getAllLatlngFromPoints = function(points) {
			var samplesLatlng = [];

			_.each(points, function(point) {
				samplesLatlng.push(GmapsApiService.LatLng(point.lat, point.lng));
			});

			return samplesLatlng;
		};*/

		return {
			//TO BE REMOVED
			/*getElevation: function(segment) {

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

			},*/

			//KEEP
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

						var route = new routeBuilder.Route(currentRoute, angular.copy(chartConfig), angular.copy(gmapsConfig));

						route.setCenter(RouteUtilsService.getCenter(race));

						routesViewModel.push(route);

					});

					routesViewModel[0].setVisible(true);

				}
				return routesViewModel;

			},

			createNewSegment: function(route, destinationLatlng, modeManu) {

				var lastLatlngOfLastSegment;

				var isFirstPoint = false;

				if (route.segments.length > 0) {
					var lastPointOfLastSegment = route.getLastPointOfLastSegment();
					lastLatlngOfLastSegment = GmapsApiService.LatLng(lastPointOfLastSegment.getLatitude(), lastPointOfLastSegment.getLongitude());
				} else {
					lastLatlngOfLastSegment = destinationLatlng;
					isFirstPoint = true;
				}

				if (!modeManu) {

					var directionsRequest = {
						origin: lastLatlngOfLastSegment,
						destination: destinationLatlng,
						travelMode: google.maps.TravelMode.DRIVING,
						provideRouteAlternatives: false,
						avoidHighways: true,
						avoidTolls: true,
						unitSystem: google.maps.UnitSystem.METRIC
					};

					SegmentService.getDirection(route, directionsRequest, isFirstPoint).then(function(result) {

						//add pôlylines to map 
						//call draw polylines

						//draw segment
						MarkerService.addMarkerToRoute(route, result.path);

						if (!isFirstPoint) {
							route.addPolyline(result.path, false, false, false, true, "red", 5);
						}

						return ElevationService.getElevation(result.segment);

					}).then(function(data) {

						//add point to chart

						route.addElevationPoints(data.samplingPoints, data.elevations);


					});
				} else {

					var segmentDataModel = SegmentService.createSimpleSegmentDataModel(lastLatlngOfLastSegment, destinationLatlng);

					var segment = route.addSegment(segmentDataModel);

					var path = [];
					path.push(lastLatlngOfLastSegment);
					path.push(destinationLatlng);

					MarkerService.addMarkerToRoute(route, path);

					if (!isFirstPoint) {
						PolylineService.createPolyline(path, false, false, false, true, "red", 5);
					}

					ElevationService.getElevation(segment).then(function(data) {

						route.addElevationPoints(data.samplingPoints, data.elevations);

					});
				}
			},

			//KEEP
			resetRoute: function(routeViewModel) {
				routeViewModel.reset();
			},

			//KEEP
			deleteLastSegment: function(routeViewModel) {
				try {

					if (routeViewModel.getSegments().length > 0) {

						var lastSegment = routeViewModel.getLastSegment();

						routeViewModel.removeLastSegment();

						routeViewModel.removeLastMarker();

						//set the new end marker
						if (routeViewModel.getMarkers().length > 1) {
							var marker = routeViewModel.getLastMarker();
							marker.icon = "client/modules/route/images/end.png";
						}

						routeViewModel.data.elevationPoints = _.difference(routeViewModel.data.elevationPoints, _.where(routeViewModel.data.elevationPoints, {
							"segmentId": lastSegment.getId()
						}));


						routeViewModel.clearSegment();

						routeViewModel.removePointsToElevationChartBySegmentId(lastSegment.getId());
					}

				} catch (ex) {
					$log.error("an error occured during undo", ex.message);
				}
			},

			//TO BE REMOVED
			/*getDirection: function(route, directionsRequest, isFirstPoint) {

				var defer = $q.defer();

				GmapsApiService.DirectionsService().route(directionsRequest, function(result, status) {
					if (status === google.maps.DirectionsStatus.OK) {

						var path = result.routes[0].overview_path;
						var legs = result.routes[0].legs;

						var segmentDataModel = SegmentService.createSegmentDataModel(path, legs);

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
			},*/

			//MAYBE MOVED TO UTILS
			convertRacesLocationToMarkers: function(races) {

				var markers = [];

				_.each(races, function(race) {

					var marker;

					if (race.place) {
						marker = {
							id: routeBuilder.generateUUID(),
							raceId: race._id,
							raceName: race.name,
							latitude: race.place.location.latitude + (Math.random() - 0.5) / 1500,
							longitude: race.place.location.longitude + (Math.random() - 0.5) / 1500,
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
			}
		};
	});