angular.module('nextrunApp').controller('MapCtrl', ['$scope', '$location', '$rootScope', 'Auth', 'Alert', '$log', 'RouteFactory', '$window',

	function($scope, $location, $rootScope, Auth, Alert, $log, RouteFactory, window) {
		'use strict';

		$scope.Math = window.Math;

		$scope.chart = {};
		$scope.chart.series = [];
		$scope.chart.series.push({
			data: []
		})


		google.maps.visualRefresh = true;

		$scope.directionService = new google.maps.DirectionsService();
		$scope.elevationService = new google.maps.ElevationService();

		$scope.route = {

			segments: [],
			distance: 0,
			descendant: 0,
			ascendant: 0,
			minElevation: 0,
			maxElevation: 0,
			elevationPoints: [],
			type: null
		}

		$scope.markers = [];

		/*$scope.infoWindow = {
			coords: {
				latitude: 30,
				longitude: -89
			},
			show: true
		};*/

		/*$scope.templatedInfoWindow = {
			coords: {
				latitude: 60,
				longitude: -95
			},
			show: true,
			templateUrl: 'partials/race/mapcontrol',
			templateParameter: {
				message: 'passed in from the opener'
			}
		};*/

		/*$scope.layer = {
			markers: [],
			polylines: [],
			segments: []
		}*/

		$scope.polylines = [];

		$scope.clusterOptions = {
			title: 'Hi I am a Cluster!',
			gridSize: 24,
			ignoreHidden: true,
			minimumClusterSize: 2,
			imageExtension: 'png',
			imagePath: 'http://localhost:3000/img',
			imageSizes: [24]
		};

		$scope.clusterOptionsText = JSON.stringify($scope.clusterOptions);



		$scope.stayOnTheRoad = true;
		$scope.travelMode = google.maps.TravelMode.DRIVING;



		$scope.center = {
			latitude: 46.52863469527167,
			longitude: 2.43896484375,
		};

		$scope.zoom = 13;
		$scope.fit = true;



		$scope.options = {
			//zoom: 5,
			//center: new google.maps.LatLng(46.52863469527167, 2.43896484375),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.HYBRID,
					google.maps.MapTypeId.SATELLITE
				]
			},
			disableDoubleClickZoom: true,
			scrollwheel: true,
			draggableCursor: "crosshair",
			streetViewControl: false,
			zoomControl: true
		};

		$scope.events = {
			click: function(mapModel, eventName, originalEventArgs) {

				$scope.onClickMap(originalEventArgs[0].latLng, $scope.stayOnTheRoad, $scope.travelMode);


			},

			dblclick: function(mapModel, eventName, originalEventArgs) {

			}
		};

		$scope.onMarkerClicked = function(marker) {
			//marker.showWindow = true;
			//window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
		};



		$scope.onClickMap = function(destinationLatlng, stayOnTheRoad, travelMode) {

			var lastLatlngOfLastSegment;

			var isFirstPoint = false;

			if ($scope.route.segments.length > 0) {
				lastLatlngOfLastSegment = RouteFactory.getLastPointOfLastSegment($scope.route).latlng;
			} else {
				lastLatlngOfLastSegment = destinationLatlng;
				isFirstPoint = true;
			}

			if (stayOnTheRoad) {

				var directionsRequest = {
					origin: lastLatlngOfLastSegment,
					destination: destinationLatlng,
					travelMode: travelMode,
					provideRouteAlternatives: false,
					avoidHighways: true,
					avoidTolls: true,
					unitSystem: google.maps.UnitSystem.METRIC

				};

				$scope.directionService.route(directionsRequest, function(result, status) {

					if (status == google.maps.DirectionsStatus.OK && directionsRequest.unitSystem == google.maps.UnitSystem.METRIC) {

						var segment = $scope.createSegment(result.routes[0], isFirstPoint);

						$scope.calculateDistanceFromStartForEachPointOfSegment(segment);

						var samplesPoints = $scope.findSamplesPointIntoSegment(segment, 0.1);

						//_this.getRoute().addSegment(segment);
						//$scope.route.segments.push(segment);

						//_this.getLayer().addSegment(segment);
						$scope.route.segments.push(segment);

						//samplesPoints = _this.getElevationFromSamplesPoints(segment, result.routes[0].overview_path, samplesPoints, _this);
						samplesPoints = $scope.getElevationFromSamplesPoints(segment, result.routes[0].overview_path, samplesPoints);
					}
				});

			} else {

				var route = [];
				route.push(lastLatlngOfLastSegment);
				route.push(destinationLatlng);

				var segment = $scope.createSimpleSegment(lastLatlngOfLastSegment, destinationLatlng);

				//this.calculateDistanceFromStartForEachPointOfSegment(segment, this);
				$scope.calculateDistanceFromStartForEachPointOfSegment(segment);

				//var samplesPoints = this.findSamplesPointIntoSegment(segment, 0.1, this);
				var samplesPoints = $scope.findSamplesPointIntoSegment(segment, 0.1);

				//this.getRoute().addSegment(segment);
				$scope.route.segments.push(segment);

				//this.getLayer().addSegment(segment);
				//$scope.layer.segments.push(segment);

				//samplesPoints = this.getElevationFromSamplesPoints(segment, route, samplesPoints, this);
				samplesPoints = $scope.getElevationFromSamplesPoints(segment, route, samplesPoints);


			}

		};

		$scope.createSegment = function(route, isFirstPoint) {

			var path = route.overview_path;
			var legs = route.legs;

			//var segment = new Segment();
			var segment = {
				segmentId: $scope.generateUUID(),
				points: [],
				distance: 0
			};

			var segmentPoints = [];

			var startIndex = 1;
			if (isFirstPoint == true) {
				startIndex = 0
			}

			//ne pas prendre le premier point car il s'agit du dernier point du dernier segment
			for (var k = startIndex; k < path.length; k++) {

				//var point = new Point();
				//point.setSegmentId(segment.getSegmentId());
				//point.setLatlng(path[k]);
				var point = {
					latlng: path[k],
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: segment.segmentId
				}
				//point.segmentId = segment.segmentId;
				//point.latlng = path[k];

				segmentPoints.push(point);
			}
			//segment.setDistance($scope.calculateDistanceOfSegment(legs));
			//segment.setPoints(segmentPoints);

			segment.distance = $scope.calculateDistanceOfSegment(legs);

			segment.points = segmentPoints;

			return segment;
		};

		$scope.createSimpleSegment = function(latLngOfLastSegment, destinationLatlng) {

			//var segment = new Segment();
			var segment = {
				segmentId: $scope.generateUUID(),
				points: [],
				distance: 0
			};

			var segmentPoints = [];

			//var point = new Point();
			//point.setSegmentId(segment.getSegmentId());
			//point.setLatlng(destinationLatlng);

			var point = {
				latlng: destinationLatlng,
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: segment.segmentId
			};

			segmentPoints.push(point);

			var segmentDistance = parseFloat($scope.calculateDistanceBetween2Points(latLngOfLastSegment, destinationLatlng));
			segment.distance = segmentDistance;
			segment.points = segmentPoints;

			return segment;

		};

		$scope.calculateDistanceOfSegment = function(legs) {

			var distance = 0.0;
			var segmentDistance = 0.0;

			for (var i = 0; i < legs.length; i++) {
				distance = legs[i].distance.value / 1000;
				segmentDistance += distance;
			}
			return segmentDistance;
		};

		$scope.calculateDistanceBetween2Points = function(p1, p2) {

			var R = 6371; // earth's mean radius in km
			var dLat = $scope.rad(p2.lat() - p1.lat());
			var dLong = $scope.rad(p2.lng() - p1.lng());

			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos($scope.rad(p1.lat())) * Math.cos($scope.rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;

			return d.toFixed(3);
		};

		$scope.generateUUID = function() {

			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
			});
			return uuid;
		};

		$scope.rad = function(x) {
			return x * Math.PI / 180;
		};

		$scope.calculateDistanceFromStartForEachPointOfSegment = function(segment) {

			var distanceBetween2Points = 0.0;
			//var segmentPoints = segment.getPoints();
			var segmentPoints = segment.points;
			var lastPoint = null;
			var cumulatedDistance = 0;

			if ($scope.route.segments.length > 0) {
				//lastPoint = $scope.route.getLastPointOfLastSegment();
				lastPoint = RouteFactory.getLastPointOfLastSegment($scope.route);
				cumulatedDistance = $scope.route.distance;
			}


			if (lastPoint) {
				for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

					if (k == 0) {

						distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(lastPoint.latlng, segmentPoints[k].latlng));

					} else {

						distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(segmentPoints[k - 1].latlng, segmentPoints[k].latlng));
					}

					cumulatedDistance += distanceBetween2Points;

					segmentPoints[k].distanceFromStart = cumulatedDistance;
				}
			}

			if ($scope.route) {
				$scope.route.distance = cumulatedDistance;
			}


		};

		$scope.findSamplesPointIntoSegment = function(segment, samples) {

			var distanceBetween2Points = 0.0;
			var samplesPoints = [];
			var segmentPoints = segment.points;
			var lastPoint = null;

			if ($scope.route.segments.length > 0) {
				lastPoint = RouteFactory.getLastPointOfLastSegment($scope.route);
			}

			var cursor = lastPoint;

			if (lastPoint) {
				for (var k = 0, lk = segmentPoints.length; k < lk; k++) {

					distanceBetween2Points = parseFloat($scope.calculateDistanceBetween2Points(cursor.latlng, segmentPoints[k].latlng));

					if (k == (segmentPoints.length - 1) || distanceBetween2Points >= samples) {
						samplesPoints.push(segmentPoints[k]);
						cursor = segmentPoints[k];
					}
				}
			} else {
				if (segmentPoints.length == 1) {
					samplesPoints.push(segmentPoints[0]);
				}
			}

			return samplesPoints;

		};

		$scope.getElevationFromSamplesPoints = function(segment, path, samplesPoints) {

			var samplesLatlng = RouteFactory.getAllLatlngFromPoints(samplesPoints);

			$scope.getElevationFromLocation(samplesLatlng, function(result, status) {

				if (status != google.maps.ElevationStatus.OK) {
					return;
				}

				for (var k = 0; k < result.length; k++) {

					samplesPoints[k].elevation = result[k].elevation;

					var lastPoint = RouteFactory.getLastElevationPoint($scope.route.elevationPoints);

					if (lastPoint) {
						var diffElevation = (parseFloat(samplesPoints[k].elevation) - parseFloat(lastPoint.elevation));
						var distanceWithLastPoint = samplesPoints[k].distanceFromStart - lastPoint.distanceFromStart;
						var grade = 0;
						if (distanceWithLastPoint != 0 && diffElevation != 0) {
							grade = ((diffElevation / (distanceWithLastPoint * 1000)) * 100).toFixed(1);
						}
						samplesPoints[k].grade = grade;
					}

					//_this.getRoute().addElevationPoint(samplesPoints[k]);
					$scope.route.elevationPoints.push(samplesPoints[k]);
				}

				$scope.addPointsToElevationChart(samplesPoints);

				RouteFactory.calculateElevationDataAlongRoute($scope.route);

				//_this.display.refreshRouteInformation(_this.getRoute());

				$scope.drawSegment(segment, path);

			});

			return samplesPoints;
		};

		$scope.getElevationFromLocation = function(locations, cb) {
			var positionalRequest = {
				locations: locations
			}

			$scope.elevationService.getElevationForLocations(positionalRequest, cb);
		};

		$scope.drawSegment = function(segment, path) {

			$scope.createMarker(segment, path);

			$scope.createPolyLine(path);
		},

		$scope.createMarker = function(segment, path, _this) {

			if ($scope.route.segments.length == 1) {

				//create start marker
				/*var icon = new google.maps.MarkerImage("../../img/start.png",
					new google.maps.Size(128, 128),
					new google.maps.Point(0, 0),
					new google.maps.Point(20, 40),
					new google.maps.Size(40, 40)
				);*/

				var marker = {
					latitude: path[path.length - 1].lat(),
					longitude: path[path.length - 1].lng(),
					icon: "../../../img/start.png",
					title: "hello"

				}

			} else {

				$scope.replaceLastMarkerBySegmentPoint();

				/*var icon = new google.maps.MarkerImage("../../img/end.png",
					new google.maps.Size(128, 128),
					new google.maps.Point(0, 0),
					new google.maps.Point(20, 40),
					new google.maps.Size(40, 40)
				);*/

				var marker = {
					latitude: path[path.length - 1].lat(),
					longitude: path[path.length - 1].lng(),
					icon: "../../../img/end.png",
					title: "hello"

				}
			}

			/*var marker = new google.maps.Marker({
				position: path[path.length - 1],
				//map: _this.display.getMap(),
				icon: icon
			});*/



			//_this.getLayer().addMarker(marker);
			$scope.markers.push(marker);

			$scope.$apply();

			/*google.maps.event.addListener(marker, 'dblclick', function(event) {
				_this.deleteLastSegment(_this);
			});*/

		};

		$scope.replaceLastMarkerBySegmentPoint = function(_this) {

			/*var icon = new google.maps.MarkerImage("../../img/segment.png",
				new google.maps.Size(32, 32),
				new google.maps.Point(0, 0),
				new google.maps.Point(8, 8),
				new google.maps.Size(16, 16)
			);*/

			var icon = "../../../img/segment.png";

			//var markers = _this.getLayer().getMarkers();

			if ($scope.markers.length > 1) {
				//markers[markers.length - 1].setIcon(icon);
				$scope.markers[$scope.markers.length - 1].icon = icon;
				$scope.$apply();

				//google.maps.event.clearListeners(markers[markers.length - 1], 'dblclick');
				//google.maps.event.clearListeners(markers[0], 'dblclick');
			}
		},

		$scope.createPolyLine = function(path) {

			/*var polyLine = new google.maps.Polyline({
				//map: _this.display.getMap(),
				strokeColor: "red",
				strokeWeight: 5
			});*/


			var pathArray = [];
			_.each(path, function(point) {
				pathArray.push({
					latitude: point.lat(),
					longitude: point.lng()
				})
			});


			var polyLine = {
				path: pathArray,
				stroke: {
					color: "red",
					weight: 5
				},
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true

			}

			//polyLine.setPath(path);

			$scope.polylines.push(polyLine);

			$scope.$apply();

			//_this.getLayer().addPolyLine(polyLine);
			//$scope.layer.polylines.push(polyLine);
		};


		$scope.removeLastMarker = function() {


			if ($scope.markers.length > 0) {
				$scope.markers[$scope.markers.length - 1];
				$scope.markers.splice($scope.markers.length - 1, 1);
			}

			if ($scope.markers.length > 1) {

				/*var icon = new google.maps.MarkerImage("../../img/end.png",
					new google.maps.Size(128, 128),
					new google.maps.Point(0, 0),
					new google.maps.Point(20, 40),
					new google.maps.Size(40, 40)
				);*/



				var marker = $scope.getMarkerByIndex($scope.markers.length - 1);

				marker.icon = "../../../img/end.png";

				/*google.maps.event.addListener(marker, 'dblclick', function(event) {
					_this.deleteLastSegment(_this);
				});*/
			}

			if ($scope.markers.length == 1) {

				var marker = $scope.getMarkerByIndex(0);

				/*google.maps.event.addListener(marker, 'dblclick', function(event) {
					_this.deleteLastSegment(_this);
				});*/
			}
		};

		$scope.getMarkerByIndex = function(index) {
			if ($scope.markers.length <= 0 && index < $scope.markers.length) {
				throw new Error("marker must not be null");
			}
			return $scope.markers[index];
		},

		$scope.removeLastSegment = function() {

			$scope.route.segments.splice($scope.route.segments.length - 1, 1);

			if ($scope.polylines.length > 0) {
				$scope.polylines[$scope.polylines.length - 1];
				$scope.polylines.splice($scope.polylines.length - 1, 1);
			}
		};

		$scope.removeElevationPointsBySegmentId = function(segmentId) {

			/*for (var k = this.elevationPoints.length - 1; k >= 0; k--) {
				if (this.elevationPoints[k].getSegmentId() == segmentId) {
					this.elevationPoints.splice(k, 1);
				}
			}*/
		};


		$scope.clearSegment = function() {

			//var lastSegment = RouteFactory.getLastSegment($scope.route.segments);

			//this.removeElevationPointsBySegmentId(lastSegment.getSegmentId());
			//this.removeLastSegment();

			//$scope.route.segments.splice($scope.route.segments.length - 1, 1);
			//this.removePointsBySegmentId(segmentId);

			var lastPointOfLastSegment = RouteFactory.getLastPointOfLastSegment($scope.route);

			if (lastPointOfLastSegment) {

				//this.setDistance(this.getLastPointOfLastSegment().getDistanceFromStart());

				$scope.route.distance = lastPointOfLastSegment.distanceFromStart;

				RouteFactory.calculateElevationDataAlongRoute($scope.route);

			} else {
				$scope.route.ascendant = 0;
				$scope.route.descendant = 0;
				$scope.route.minElevation = 0;
				$scope.route.maxElevation = 0;
				$scope.route.distance = 0.0;
			}
		},

		$scope.undo = function() {

			if ($scope.route.segments.length > 0) {

				var lastSegment = RouteFactory.getLastSegment($scope.route.segments);

				$scope.removeLastSegment();


				//$scope.removeLastMarker(lastSegment.segmentId);
				$scope.removeLastMarker();

				$scope.route.elevationPoints = _.difference($scope.route.elevationPoints, _.where($scope.route.elevationPoints, {
					'segmentId': lastSegment.segmentId
				}));


				$scope.clearSegment();



				$scope.removePointsToElevationChartBySegmentId(lastSegment.segmentId);

				//_this.getRoute().calculateElevationDataAlongRoute();

				//_this.display.refreshRouteInformation(this.getRoute());
			}


		};



		$scope.delete = function() {

			//this.getRoute().clear();
			$scope.route.ascendant = 0;
			$scope.route.descendant = 0;
			$scope.route.minElevation = 0;
			$scope.route.maxElevation = 0;
			$scope.route.distance = 0.0;
			$scope.route.elevationPoints = [];
			$scope.route.segments = [];

			//this.getLayer().clear();

			$scope.markers.length = 0;
			$scope.polylines.length = 0;

			//$scope.layer.markers = [];
			//$scope.layer.polylines = [];
			//$scope.layer.segments = [];

			$scope.redrawElevationChart();
			//this.display.refreshRouteInformation(this.getRoute());

		};

		$scope.addPointsToElevationChart = function(samplesPoints) {

			var datas = [];

			for (var k = 0; k < samplesPoints.length; k++) {

				var data = {
					x: parseFloat(samplesPoints[k].distanceFromStart.toFixed(2)),
					y: samplesPoints[k].elevation,
					grade: samplesPoints[k].grade,
					color: 'blue',
					fillColor: 'blue',
					segmentId: samplesPoints[k].segmentId,
					latlng: samplesPoints[k].latlng
				};


				//datas.push(data);
				$scope.chartConfig.series[0].data.push(data);
				//addPoint(data, false, false, true);
			}

			//$scope.chartConfig.series[0].data.push(datas);

			//$scope.chart.redraw();
		},

		$scope.removePointsToElevationChartBySegmentId = function(segmentId) {


			$scope.chartConfig.series[0].data = _.difference($scope.chartConfig.series[0].data, _.where($scope.chartConfig.series[0].data, {
				'segmentId': segmentId
			}));

			/*for (var k = data.length - 1; k >= 0; k--) {
				if (data[k].segmentId === segmentId) {
					//data[k].remove(false);
					//data.splice(k, 1)
				}
			}*/
			//$scope.chart.redraw();
		},

		$scope.redrawElevationChart = function() {
			//$scope.chartConfig.series[0].setData([]);
			$scope.chartConfig.series[0].data = [];

			//$scope.chart.series[0].redraw();
			//$scope.chart.redraw();
		},


		$scope.chartConfig = {
			loading: false,
			options: {
				chart: {
					type: 'area'
				},
				plotOptions: {
					series: {
						marker: {
							enabled: false
						},
						point: {
							events: {
								mouseOver: function() {

									/*var icon = new google.maps.MarkerImage("../../img/segment.png",
									new google.maps.Size(32, 32),
									new google.maps.Point(0, 0),
									new google.maps.Point(8, 8),
									new google.maps.Size(16, 16)
								);*/

									/*cursorMarker = new google.maps.Marker({
									position: new google.maps.LatLng(this.latlng.mb, this.latlng.nb),
									map: themap,
									icon: icon
								});*/

								},

								mouseOut: function() {

									/*if (cursorMarker instanceof google.maps.Marker) {
									cursorMarker.setMap(null);
								}*/
								}

							}
						},
						events: {
							mouseOut: function() {
								/*if (cursorMarker instanceof google.maps.Marker) {
								cursorMarker.setMap(null);
							}*/
							}
						}
					},
					column: {
						colorByPoint: true
					}
				},
				tooltip: {
					shared: true,
					useHTML: true,
					headerFormat: '<table>',
					pointFormat: '<tr>' +
						'<td>Distance: </td>' +
						'<td style="text-align: right"><b>{point.x} Km</b></td>' +
						'</tr>' +
						'<tr>' +
						'<td>Altitude: </td>' +
						'<td style="text-align: right"><b>{point.y} m</b></td>' +
						'</tr>' +
						'<tr>' +
						'<td>Pente: </td>' +
						'<td style="text-align: right"><b>{point.grade} %</b></td>' +
						'</tr>',
					footerFormat: '</table>',
					valueDecimals: 0
				}
			},
			series: [{
				name: "Altitude (m)",
				data: []
			}],
			xAxis: {
				title: {
					text: 'Distance (km)',
					align: 'middle'
				}
			},
			yAxis: {
				title: {
					text: 'Altitude (m)',
					align: 'middle'
				}
			},
			title: {
				text: ''
			}



		};


	}
]);

/*
angular.module('nextrunApp').factory('LayerFactory', function($http) {
	'use strict';

	return {
		getLastPointOfLastSegment: function(segments) {
			var segmentIndex = 0;
			var pointIndex = 0;

			if (segments.length > 0) {
				segmentIndex = segments.length - 1;
			}

			var lastSegment = segments[segmentIndex];
			var pointsOfLastSegment = lastSegment.points;

			if (pointsOfLastSegment.length > 0) {
				pointIndex = pointsOfLastSegment.length - 1;
			}

			var lastPointOfLastSegment = pointsOfLastSegment[pointIndex];

			return lastPointOfLastSegment;
		}

	};
});*/

angular.module('nextrunApp').factory('RouteFactory', function() {
	'use strict';

	return {
		getLastPointOfLastSegment: function(route) {

			var lastPointOfLastSegment = null;
			var segmentIndex = 0;
			var pointIndex = 0;

			if (route.segments.length > 0) {
				segmentIndex = route.segments.length - 1;
			}

			var lastSegment = route.segments[segmentIndex];

			if (lastSegment) {
				var pointsOfLastSegment = lastSegment.points;

				if (pointsOfLastSegment.length > 0) {
					pointIndex = pointsOfLastSegment.length - 1;
				}

				var lastPointOfLastSegment = pointsOfLastSegment[pointIndex];
			}

			return lastPointOfLastSegment;
		},
		getAllLatlngFromPoints: function(points) {
			var samplesLatlng = [];

			for (var k = 0; k < points.length; k++) {
				samplesLatlng.push(points[k].latlng);
			}

			return samplesLatlng;

		},
		getLastElevationPoint: function(elevationPoints) {
			return elevationPoints[elevationPoints.length - 1];
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
		getLastSegment: function(segments) {
			var segmentIndex = 0;
			if (segments.length > 0) {
				segmentIndex = segments.length - 1;
			}
			var lastSegment = segments[segmentIndex];
			return lastSegment;
		},
	}
});

/*
angular.module('nextrunApp').factory('PointFactory', function() {
	'use strict';
	return {
		createPoint: function(point) {

			var newPoint = {
				latlng: new google.maps.LatLng(point.latlng.mb, point.latlng.nb),
				elevation: point.elevation,
				distanceFromStart: point.distanceFromStart,
				grade: point.grade,
				segmentId: point.segmentId
			}
			return newPoint;
		}
	};
});*/
