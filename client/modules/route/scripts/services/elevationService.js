"use strict";

angular.module("nextrunApp.route").factory("ElevationService",
	function(GmapsApiService) {

		var gmElevationService = GmapsApiService.ElevationService();

		return {
			setGrade: function(lastElevationPoint, newElevationPoint) {

				var grade = 0;

				var diffElevation = (parseFloat(newElevationPoint.elevation) - parseFloat(lastElevationPoint.elevation));

				var distanceWithLastPoint = newElevationPoint.distanceFromStart - lastElevationPoint.distanceFromStart;

				if (distanceWithLastPoint !== 0 && diffElevation !== 0) {
					grade = ((diffElevation / (distanceWithLastPoint * 1000)) * 100).toFixed(1);
				}

				newElevationPoint.grade = grade;

			},
			getElevationFromSamplesPoints: function($scope, route, segment, path, samplesPoints) {

				var samplesLatlng = this.getAllLatlngFromPoints(samplesPoints);

				this.getElevationFromLocation(samplesLatlng, function(result, status) {

					if (status !== google.maps.ElevationStatus.OK) {
						return;
					}

					for (var k = 0; k < result.length; k++) {

						samplesPoints[k].elevation = result[k].elevation;

						var lastPoint = this.getLastElevationPoint(route.elevationPoints);

						if (lastPoint) {
							var diffElevation = (parseFloat(samplesPoints[k].elevation) - parseFloat(lastPoint.elevation));
							var distanceWithLastPoint = samplesPoints[k].distanceFromStart - lastPoint.distanceFromStart;
							var grade = 0;
							if (distanceWithLastPoint !== 0 && diffElevation !== 0) {
								grade = ((diffElevation / (distanceWithLastPoint * 1000)) * 100).toFixed(1);
							}
							samplesPoints[k].grade = grade;
						}

						route.elevationPoints.push(samplesPoints[k]);
					}

					this.addPointsToElevationChart(route, samplesPoints);

					this.calculateElevationDataAlongRoute(route);


					//SegmentService.drawSegment(route, path);

					$scope.$apply();

				});

				return samplesPoints;
			},
			getElevationFromLocation: function(locations, cb) {
				var positionalRequest = {
					locations: locations
				};

				gmElevationService.getElevationForLocations(positionalRequest, cb);
			},
			getAllLatlngFromPoints: function(points) {
				var samplesLatlng = [];

				for (var k = 0; k < points.length; k++) {
					samplesLatlng.push(GmapsApiService.LatLng(points[k].latlng.mb, points[k].latlng.nb));
				}

				return samplesLatlng;
			},
			getLastElevationPoint: function(elevationPoints) {
				return elevationPoints[elevationPoints.length - 1];
			},
			removePointsToElevationChartBySegmentId: function(route, segmentId) {
				route.chartConfig.series[0].data = _.difference(route.chartConfig.series[0].data, _.where(route.chartConfig.series[0].data, {
					"segmentId": segmentId
				}));
				route.chartConfig.series[1].data = _.difference(route.chartConfig.series[1].data, _.where(route.chartConfig.series[1].data, {
					"segmentId": segmentId
				}));
				route.chartConfig.series[2].data = _.difference(route.chartConfig.series[2].data, _.where(route.chartConfig.series[2].data, {
					"segmentId": segmentId
				}));
				route.chartConfig.series[3].data = _.difference(route.chartConfig.series[3].data, _.where(route.chartConfig.series[3].data, {
					"segmentId": segmentId
				}));
				route.chartConfig.series[4].data = _.difference(route.chartConfig.series[4].data, _.where(route.chartConfig.series[4].data, {
					"segmentId": segmentId
				}));
			},
			calculateElevationDataAlongRoute: function(route) {

				route.ascendant = 0;
				route.descendant = 0;
				route.minElevation = route.elevationPoints[0].elevation;
				route.maxElevation = route.elevationPoints[0].elevation;

				if (route.elevationPoints.length > 0) {


					for (var k = 1, lk = route.elevationPoints.length; k < lk; ++k) {

						var diffElevation = (parseFloat(route.elevationPoints[k].elevation) - parseFloat(route.elevationPoints[k - 1].elevation));

						if (diffElevation > 0) {
							route.ascendant = (route.ascendant + diffElevation);
						} else {
							route.descendant = (route.descendant + diffElevation);
						}

						if (route.elevationPoints[k - 1].elevation > route.maxElevation) {
							route.maxElevation = (route.elevationPoints[k - 1].elevation);
						}

						if (route.elevationPoints[k - 1].elevation < route.minElevation) {
							route.minElevation = (route.elevationPoints[k - 1].elevation);
						}
					}
				}
			},
			addPointsToElevationChart: function(series, elevationPoints) {

				var datas = [];
				var climbs = {
					climbsInf7: [],
					climbsInf10: [],
					climbsInf15: [],
					climbsSup15: []
				};

				var sortedElevationPoints = _.sortBy(elevationPoints, function(elevationPoint) {
					return parseFloat(elevationPoint.distanceFromStart.toFixed(2));
				});

				for (var k = 0; k < sortedElevationPoints.length; k++) {

					var data = {
						x: parseFloat(sortedElevationPoints[k].distanceFromStart.toFixed(2)),
						y: sortedElevationPoints[k].elevation,
						grade: sortedElevationPoints[k].grade,
						color: "blue",
						fillColor: "blue",
						segmentId: sortedElevationPoints[k].segmentId,
						latlng: sortedElevationPoints[k].latlng
					};

					datas.push(data);

					climbs = this.addClimbsToElevationChart(sortedElevationPoints, k, climbs);
				}

				series[0].data = datas;
				series[1].data = series[1].data.concat(climbs.climbsInf7);
				series[2].data = series[2].data.concat(climbs.climbsInf10);
				series[3].data = series[3].data.concat(climbs.climbsInf15);
				series[4].data = series[4].data.concat(climbs.climbsSup15);
			},
			addClimbsToElevationChart: function(elevationPoints, index, climbs) {

				var previousElevationPoint;
				var previousData;

				if (elevationPoints[index].grade > 5 && elevationPoints[index].grade <= 7) {

					//get previous point
					if (index > 0) {
						previousElevationPoint = elevationPoints[index - 1];
						previousData = {
							x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
							y: previousElevationPoint.elevation,
							grade: previousElevationPoint.grade,
							segmentId: previousElevationPoint.segmentId,
							latlng: previousElevationPoint.latlng

						};
						climbs.climbsInf7.push(previousData);
					}

					climbs.climbsInf7.push({
						x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
						y: elevationPoints[index].elevation,
						grade: elevationPoints[index].grade,
						segmentId: elevationPoints[index].segmentId,
						latlng: elevationPoints[index].latlng

					});
				} else if (elevationPoints[index].grade > 7 && elevationPoints[index].grade <= 10) {
					//get previous point
					if (index > 0) {
						previousElevationPoint = elevationPoints[index - 1];
						previousData = {
							x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
							y: previousElevationPoint.elevation,
							grade: previousElevationPoint.grade,
							segmentId: previousElevationPoint.segmentId,
							latlng: previousElevationPoint.latlng

						};
						climbs.climbsInf10.push(previousData);
					}

					climbs.climbsInf10.push({
						x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
						y: elevationPoints[index].elevation,
						grade: elevationPoints[index].grade,
						segmentId: elevationPoints[index].segmentId,
						latlng: elevationPoints[index].latlng

					});
				} else if (elevationPoints[index].grade > 10 && elevationPoints[index].grade <= 15) {
					//get previous point
					if (index > 0) {
						previousElevationPoint = elevationPoints[index - 1];
						previousData = {
							x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
							y: previousElevationPoint.elevation,
							grade: previousElevationPoint.grade,
							segmentId: previousElevationPoint.segmentId,
							latlng: previousElevationPoint.latlng

						};
						climbs.climbsInf15.push(previousData);
					}

					climbs.climbsInf15.push({
						x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
						y: elevationPoints[index].elevation,
						grade: elevationPoints[index].grade,
						segmentId: elevationPoints[index].segmentId,
						latlng: elevationPoints[index].latlng

					});

				} else if (elevationPoints[index].grade > 15) {
					//get previous point
					if (index > 0) {
						previousElevationPoint = elevationPoints[index - 1];
						previousData = {
							x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
							y: previousElevationPoint.elevation,
							grade: previousElevationPoint.grade,
							segmentId: previousElevationPoint.segmentId,
							latlng: previousElevationPoint.latlng

						};
						climbs.climbsSup15.push(previousData);
					}

					climbs.climbsSup15.push({
						x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
						y: elevationPoints[index].elevation,
						grade: elevationPoints[index].grade,
						segmentId: elevationPoints[index].segmentId,
						latlng: elevationPoints[index].latlng

					});

				} else {

					var point0 = {
						x: parseFloat(elevationPoints[index].distanceFromStart.toFixed(2)),
						y: null,
						grade: elevationPoints[index].grade,
						segmentId: elevationPoints[index].segmentId,
						latlng: elevationPoints[index].latlng

					};
					climbs.climbsInf7.push(point0);
					climbs.climbsInf10.push(point0);
					climbs.climbsInf15.push(point0);
					climbs.climbsSup15.push(point0);
				}
				return climbs;
			}
		};
	});