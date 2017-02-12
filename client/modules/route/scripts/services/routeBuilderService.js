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

		var currentRoute = null;

		return {
			setCurrentRoute: function(route) {
				currentRoute = route;
			},
			getCurrentRoute: function() {
				return currentRoute;
			},
			removeCurrentRoute: function() {
				currentRoute = null;
			},
			createRouteViewModel: function(route, chartConfig, gmapsConfig, showSegment) {
				var routeDataModel;

				if (!angular.isObject(route)) {
					routeDataModel = {
						type: "Vélo", //TO be defined
						segments: [],
						elevationPoints: []
					};
				} else {
					routeDataModel = route;
				}

				var routeViewModel = new routeBuilder.Route(routeDataModel, angular.copy(chartConfig), angular.copy(gmapsConfig), showSegment);

				return routeViewModel;

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

					var travelMode = google.maps.TravelMode.WALKING;

					switch (route.data.type) {
						case "Vélo":
							travelMode = google.maps.TravelMode.BICYCLING;
							break;
						case "Natation":
						case "Course à pied":
						case "Trail":
						case "Ski de Fond":
						case "VTT":
							travelMode = google.maps.TravelMode.WALKING;
							break;
						default:
							travelMode = google.maps.TravelMode.WALKING;
							break;
					}

					var directionsRequest = {
						origin: lastLatlngOfLastSegment,
						destination: destinationLatlng,
						travelMode: travelMode,
						provideRouteAlternatives: false,
						avoidHighways: true,
						avoidTolls: true,
						unitSystem: google.maps.UnitSystem.METRIC
					};

					SegmentService.getDirection(route, directionsRequest, isFirstPoint).then(function(result) {
						MarkerService.addMarkerToRoute(route, result.path);

						if (!isFirstPoint) {
							PolylineService.createPolyline(route, result.path, false, false, false, true, "red", 5);
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

				angular.forEach(races, function(race) {

					var marker;

					if (race.place) {
						marker = {
							id: routeBuilder.generateUUID(),
							name: race.name,
							ref: "/races/view/" + race._id,
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
			},
			convertRoutesLocationToMarkers: function(routes) {

				var markers = [];

				angular.forEach(routes, function(route) {

					var marker;

					if (route.startPlace) {
						marker = {
							id: routeBuilder.generateUUID(),
							name: route.name,
							ref: "/routes/" + route._id + "/view",
							latitude: route.startPlace.location.latitude + (Math.random() - 0.5) / 1500,
							longitude: route.startPlace.location.longitude + (Math.random() - 0.5) / 1500,
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