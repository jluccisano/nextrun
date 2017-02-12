"use strict";

angular.module("nextrunApp.route").factory("ElevationService",
	function(GmapsApiService, RouteUtilsService) {

		return {
			getElevation: function(segment) {

				var defer = $q.defer();

				var samplingPoints = segment.getSamplingPoints();
				var samplesLatlng = RouteUtilsService.getAllLatlngFromPoints(samplingPoints);

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
			addClimbToSerie = function(previousElevationPoint, nextElevationPoint, serie) {

				var previousData;

				//get previous point
				if (previousElevationPoint) {
					previousData = {
						x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
						y: Math.floor(previousElevationPoint.elevation),
						grade: previousElevationPoint.grade,
						segmentId: previousElevationPoint.segmentId,
						lat: previousElevationPoint.lat,
						lng: previousElevationPoint.lng


					};
					serie.push(previousData);
				}

				serie.push({
					x: parseFloat(nextElevationPoint.distanceFromStart.toFixed(2)),
					y: Math.floor(nextElevationPoint.elevation),
					grade: nextElevationPoint.grade,
					segmentId: nextElevationPoint.segmentId,
					lat: nextElevationPoint.lat,
					lng: nextElevationPoint.lng

				});
			},
			createClimbsDataModel: function(elevationPointsDataModel) {

				var climbsDataModel = {
					climbsInf7: [],
					climbsInf10: [],
					climbsInf15: [],
					climbsSup15: []
				};

				for (var k = 0; k < elevationPointsDataModel.length; k++) {

					var previousElevationPoint;

					if (k > 0) {
						previousElevationPoint = elevationPointsDataModel[k - 1];
					}

					if (elevationPointsDataModel[k].grade > 5 && elevationPointsDataModel[k].grade <= 7) {

						this.addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsInf7);

					} else if (elevationPointsDataModel[k].grade > 7 && elevationPointsDataModel[k].grade <= 10) {

						this.addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsInf10);

					} else if (elevationPointsDataModel[k].grade > 10 && elevationPointsDataModel[k].grade <= 15) {

						this.addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsInf15);

					} else if (elevationPointsDataModel[k].grade > 15) {

						this.addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsSup15);

					} else {

						var point0 = {
							x: parseFloat(elevationPointsDataModel[k].distanceFromStart.toFixed(2)),
							y: null,
							grade: elevationPointsDataModel[k].grade,
							segmentId: elevationPointsDataModel[k].segmentId,
							lat: elevationPointsDataModel[k].lat,
							lng: elevationPointsDataModel[k].lng

						};
						climbsDataModel.climbsInf7.push(point0);
						climbsDataModel.climbsInf10.push(point0);
						climbsDataModel.climbsInf15.push(point0);
						climbsDataModel.climbsSup15.push(point0);
					}

				}

				return climbsDataModel;
			},
		};
	});