"use strict";

angular.module("nextrunApp.route").factory("RouteBuilderService",
	function(
		$q,
		$log,
		GmapsApiService,
		RouteUtilsService,
		RaceTypeEnum,
		SegmentService, 
		ElevationService,
		MarkerService,
		PolylineService,
		underscore) {
		return {
			createRoutesViewModel: function(race, chartConfig, gmapsConfig) {
				var routesViewModel = [];

				if (race) {
					var raceType = RaceTypeEnum.getRaceTypeByName(race.type);

					underscore.each(raceType.routes, function(routeType, index) {
						var currentRoute;

						if (!underscore.isUndefined(race.routes[index])) {
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
						MarkerService.addMarkerToRoute(route, result.path);

						if (!isFirstPoint) {
							PolylineService.createPolyline(route,result.path, false, false, false, true, "red", 5);
						}
						return ElevationService.getElevation(result.segment);

					}).then(function(data) {
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
						PolylineService.createPolyline(route, path, false, false, false, true, "red", 5);
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

						routeViewModel.data.elevationPoints = underscore.difference(routeViewModel.data.elevationPoints, underscore.where(routeViewModel.data.elevationPoints, {
							"segmentId": lastSegment.getId()
						}));

						routeViewModel.clearSegment();
						routeViewModel.removePointsToElevationChartBySegmentId(lastSegment.getId());
					}
				} catch (ex) {
					$log.error("an error occured during undo", ex.message);
				}
			},
			//MAYBE MOVED TO UTILS
			convertRacesLocationToMarkers: function(races) {

				var markers = [];

				underscore.each(races, function(race) {

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