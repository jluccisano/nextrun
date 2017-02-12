"use strict";
/**
 * Route builder
 * @author Joseph Luccisano
 */

/*jshint -W079 */
var routeBuilder = {};

(function() {


	routeBuilder.Route = function(dataModel, chartConfig, gmapsConfig) {

		this.data = dataModel;

		if (!this.data.distance) {
			this.data.distance = 0;
		}

		this.getLastPointOfLastSegment = function() {

			var lastPointOfLastSegment;
			var segmentIndex = 0;
			var pointIndex = 0;
			var segments = this.segments;

			if (segments.length > 0) {
				segmentIndex = segments.length - 1;
			}

			var lastSegment = segments[segmentIndex];

			if (lastSegment) {
				var pointsOfLastSegment = lastSegment.getPoints();

				if (pointsOfLastSegment.length > 0) {
					pointIndex = pointsOfLastSegment.length - 1;
				}

				lastPointOfLastSegment = pointsOfLastSegment[pointIndex];
			}

			return lastPointOfLastSegment;
		};

		this.getLastPointOfLastSegmentDataModel = function() {

			var lastPointOfLastSegment;
			var segmentIndex = 0;
			var pointIndex = 0;
			var segments = this.data.segments;

			if (segments.length > 0) {
				segmentIndex = segments.length - 1;
			}

			var lastSegment = segments[segmentIndex];

			if (lastSegment) {
				var pointsOfLastSegment = lastSegment.points;

				if (pointsOfLastSegment.length > 0) {
					pointIndex = pointsOfLastSegment.length - 1;
				}

				lastPointOfLastSegment = pointsOfLastSegment[pointIndex];
			}

			return lastPointOfLastSegment;
		};

		this._createSegmentsViewModel = function(segmentsDataModel) {
			var segmentsViewModel = [];

			var _this = this;


			_.each(segmentsDataModel, function(segmentDataModel) {
				segmentsViewModel.push(new routeBuilder.Segment(segmentDataModel, _this.getLastPointOfLastSegmentDataModel()));
			});

			return segmentsViewModel;
		};

		this.addSegment = function(segmentDataModel) {

			var newSegment = new routeBuilder.Segment(segmentDataModel, this.getLastPointOfLastSegmentDataModel());

			this.data.segments.push(segmentDataModel);

			this.segments.push(newSegment);

			this._updateDistance();

			return newSegment;
		};

		//TO BE REMOVED
		/*this.createSimpleSegmentDataModel = function(startLatlng, destinationLatlng) {

			if (!startLatlng) {
				throw new Error("start Latlng is undefined");
			}

			if (!destinationLatlng) {
				throw new Error("destination Latlng is undefined");
			}

			if (!(startLatlng instanceof google.maps.LatLng)) {
				throw new Error("start Latlng is not instance of google.maps.Latlng");
			}

			if (!(destinationLatlng instanceof google.maps.LatLng)) {
				throw new Error("destination Latlng is not instance of google.maps.Latlng");
			}

			var segmentDataModel = {
				segmentId: routeBuilder.generateUUID(),
				points: [],
				distance: 0
			};

			var segmentPoints = [];
			segmentPoints.push({
				lat: destinationLatlng.lat(),
				lng: destinationLatlng.lng(),
				elevation: 0,
				distanceFromStart: 0,
				grade: 0,
				segmentId: segmentDataModel.segmentId
			});

			try {
				segmentDataModel.distance = parseFloat(routeBuilder.calculateDistanceBetween2Points(startLatlng, destinationLatlng));
			} catch (ex) {
				console.log(ex.message);
			}

			segmentDataModel.points = segmentPoints;

			return segmentDataModel;
		};*/

		//KEEP
		this.removeLastSegment = function() {

			this.data.segments.splice(this.data.segments.length - 1, 1);

			this.segments.splice(this.segments.length - 1, 1);

			if (this._polylines.length > 0) {
				this._polylines.splice(this._polylines.length - 1, 1);
			}
		};

		//KEEP
		this.clearSegment = function() {

			var lastPointOfLastSegment = this.getLastPointOfLastSegment();

			if (lastPointOfLastSegment) {

				this.data.distance = lastPointOfLastSegment.getDistanceFromStart();

				this._calculateElevationDataAlongRoute();

			} else {
				this.data.ascendant = 0;
				this.data.descendant = 0;
				this.data.minElevation = 0;
				this.data.maxElevation = 0;
				this.data.distance = 0.0;
			}
		};

		//KEEP
		this.getLastSegment = function() {
			var lastSegment;

			if (this.segments.length > 0) {
				lastSegment = this.segments[this.segments.length - 1];
			}
			return lastSegment;
		};



		this._calculateElevationDataAlongRoute = function() {

			this.data.ascendant = 0;
			this.data.descendant = 0;
			this.data.minElevation = 0;
			this.data.maxElevation = 0;

			if (this.data.elevationPoints.length > 0) {

				this.data.minElevation = this.data.elevationPoints[0].elevation;
				this.data.maxElevation = this.data.elevationPoints[0].elevation;

				for (var k = 1, lk = this.data.elevationPoints.length; k < lk; ++k) {

					var diffElevation = (parseFloat(this.data.elevationPoints[k].elevation) - parseFloat(this.data.elevationPoints[k - 1].elevation));

					if (diffElevation > 0) {
						this.data.ascendant = this.data.ascendant + diffElevation;
					} else {
						this.data.descendant = this.data.descendant + diffElevation;
					}

					if (this.data.elevationPoints[k - 1].elevation > this.data.maxElevation) {
						this.data.maxElevation = this.data.elevationPoints[k - 1].elevation;
					}

					if (this.data.elevationPoints[k - 1].elevation < this.data.minElevation) {
						this.data.minElevation = this.data.elevationPoints[k - 1].elevation;
					}
				}
			}
		};

		this._createElevationPointsViewModel = function(elevationPointsDataModel) {

			var elevationPointsViewModel = [];

			_.each(elevationPointsDataModel, function(elevationPointDataModel) {
				elevationPointsViewModel.push(new routeBuilder.Point(elevationPointDataModel));
			});

			return elevationPointsViewModel;
		};

		this._createElevationsDataModel = function(elevationPointsDataModel) {

			var elevationsDataModel = [];

			_.each(elevationPointsDataModel, function(elevationPoint) {

				var data = {
					x: parseFloat(elevationPoint.distanceFromStart.toFixed(2)),
					y: elevationPoint.elevation,
					grade: elevationPoint.grade,
					color: "blue",
					fillColor: "blue",
					segmentId: elevationPoint.segmentId,
					lat: elevationPoint.lat,
					lng: elevationPoint.lng

				};
				elevationsDataModel.push(data);
			});

			return elevationsDataModel;
		};

		this.getLastElevationPoint = function() {
			return this.elevationPoints[this.elevationPoints.length - 1];
		};

		this.addElevationPoints = function(samplingPoints, result) {
			for (var k = 0; k < result.length; k++) {

				samplingPoints[k].elevation = result[k].elevation;

				var lastPoint = this.getLastElevationPoint();

				if (lastPoint) {
					var diffElevation = (parseFloat(samplingPoints[k].elevation) - parseFloat(lastPoint.elevation));
					var distanceWithLastPoint = samplingPoints[k].distanceFromStart - lastPoint.distanceFromStart;
					var grade = 0;
					if (distanceWithLastPoint !== 0 && diffElevation !== 0) {
						grade = Math.floor((diffElevation / (distanceWithLastPoint * 1000)) * 100);
					}
					samplingPoints[k].grade = grade;
				}

				this.data.elevationPoints.push(samplingPoints[k]);

				this.elevationPoints.push(samplingPoints[k]);
			}

			this._calculateElevationDataAlongRoute();

			this._addPointsToElevationChart(samplingPoints);
		};



		this._createPolylinesDataModel = function(segmentsViewModel) {
			var polylinesDataModel = [];
			var pathArray = [];

			_.each(segmentsViewModel, function(segment, index) {

				var lastPointOfLastSegment;

				if (index > 0) {

					var previousSegment = segmentsViewModel[index - 1];

					if (typeof previousSegment.points[previousSegment.points.length - 1] !== "undefined") {
						lastPointOfLastSegment = previousSegment.points[previousSegment.points.length - 1];
					}

					pathArray.push({
						latitude: lastPointOfLastSegment.getLatitude(),
						longitude: lastPointOfLastSegment.getLongitude()
					});

				}

				_.each(segment.points, function(point) {
					pathArray.push({
						latitude: point.getLatitude(),
						longitude: point.getLongitude()
					});
				});
			});

			if (pathArray.length > 0) {
				var polyline = {
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

				polylinesDataModel.push(polyline);
			}

			return polylinesDataModel;
		};

		//NEW
		this.addPolyline = function(polylineDataModel) {
			this._polylines.push(polylineDataModel);
		}

		//TO BE REMOVED
		/*this.addPolyline = function(path, editable, draggable, geodesic, visible, color, weight) {

			var pathArray = [];

			_.each(path, function(point) {

				if (!(point instanceof google.maps.LatLng)) {
					throw new Error("point is not instance of google.maps.Latlng");
				}

				pathArray.push({
					latitude: point.lat(),
					longitude: point.lng()
				});
			});

			if (pathArray.length > 1) {
				var polyline = {
					id: routeBuilder.generateUUID(),
					path: pathArray,
					stroke: {
						color: (color) ? color : "red",
						weight: (weight) ? weight : 5
					},
					editable: (editable) ? editable : false,
					draggable: (draggable) ? draggable : false,
					geodesic: (geodesic) ? geodesic : false,
					visible: (visible) ? visible : true
				};
				this._polylines.push(polyline);

			} else {
				throw new Error("polyline must contain at least two point");
			}
		};*/



		this._createMarkersDataModel = function(segmentsViewModel, showSegment) {
			var markersDataModel = [];

			_.each(segmentsViewModel, function(segment, index) {

				var lastPointOfSegment;
				var icon;
				var marker;

				if (typeof segment.points[segment.points.length - 1] !== "undefined") {
					lastPointOfSegment = segment.points[segment.points.length - 1];
				}

				if (index === 0) {
					icon = "client/modules/route/images/start.png";
				} else if (index === (segmentsViewModel.length - 1)) {
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
						id: routeBuilder.generateUUID(),
						latitude: lastPointOfSegment.getLatitude(),
						longitude: lastPointOfSegment.getLongitude(),
						icon: icon,
						title: "hello"
					};
				}

				if (marker) {
					markersDataModel.push(marker);
				}
			});

			return markersDataModel;
		};

		//TO BE REMOVED
		/*this._createMarker = function(latLng, icon, title) {

			if (!(latLng instanceof google.maps.LatLng)) {
				throw new Error("latLng is not instance of google.maps.Latlng");
			}

			var marker = {
				id: routeBuilder.generateUUID(),
				latitude: latLng.lat(),
				longitude: latLng.lng(),
				icon: icon,
				title: title
			};

			return marker;
		};*/

		//KEEP
		this.getLastMarker = function() {
			return this._markers[this._markers.length - 1];
		};

		//KEEP
		this.removeLastMarker = function() {
			this.getMarkers().splice(this.getMarkers().length - 1, 1);
		};

		//TO BE REMOVED
		/*this.addMarkerToRoute = function(path) {
			try {

				var marker = {};

				var lastLatLng = this._getLastLatLngOfPath(path);

				if (this.segments.length === 1) {

					marker = this._createMarker(lastLatLng, "client/modules/route/images/start.png", "first point");

				} else {

					if (this.segments.length > 2) {
						//replace last marker by segment point
						var segmentIcon = new google.maps.MarkerImage("client/modules/route/images/segment.png",
							new google.maps.Size(32, 32),
							new google.maps.Point(0, 0),
							new google.maps.Point(8, 8),
							new google.maps.Size(16, 16)
						);

						var lastMarker = this.getLastMarker();
						lastMarker.icon = segmentIcon;

					}

					//create the new last marker
					marker = this._createMarker(lastLatLng, "client/modules/route/images/end.png", "end point");
				}

				this._markers.push(marker);

			} catch (ex) {
				console.log("an error occured during add marker to route", ex.message);
			}
		};*/

		//NEW
		this.addMarker = function() {
			this._markers.push(marker);
		}


		//TO BE REMOVED
		/*this._addClimbToSerie = function(previousElevationPoint, nextElevationPoint, serie) {

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
		};*/

		//TO BE REMOVED
		/*this._createClimbsDataModel = function(elevationPointsDataModel) {

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

					this._addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsInf7);

				} else if (elevationPointsDataModel[k].grade > 7 && elevationPointsDataModel[k].grade <= 10) {

					this._addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsInf10);

				} else if (elevationPointsDataModel[k].grade > 10 && elevationPointsDataModel[k].grade <= 15) {

					this._addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsInf15);

				} else if (elevationPointsDataModel[k].grade > 15) {

					this._addClimbToSerie(previousElevationPoint, elevationPointsDataModel[k], climbsDataModel.climbsSup15);

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
		};*/

		this.removePointsToElevationChartBySegmentId = function(segmentId) {
			_.each(this.getChartConfig().series, function(serie) {
				serie.data = _.difference(serie.data, _.where(serie.data, {
					"segmentId": segmentId
				}));
			});

			/*this.getChartConfig().series[0].data = _.difference(this.getChartConfig().series[0].data, _.where(this.getChartConfig().series[0].data, {
				"segmentId": segmentId
			}));
			this.getChartConfig().series[1].data = _.difference(this.getChartConfig().series[1].data, _.where(this.getChartConfig().series[1].data, {
				"segmentId": segmentId
			}));
			this.getChartConfig().series[2].data = _.difference(this.getChartConfig().series[2].data, _.where(this.getChartConfig().series[2].data, {
				"segmentId": segmentId
			}));
			this.getChartConfig().series[3].data = _.difference(this.getChartConfig().series[3].data, _.where(this.getChartConfig().series[3].data, {
				"segmentId": segmentId
			}));
			this.getChartConfig().series[4].data = _.difference(this.getChartConfig().series[4].data, _.where(this.getChartConfig().series[4].data, {
				"segmentId": segmentId
			}));*/
		};

		this._addPointsToElevationChart = function(elevationPointsDataModel) {

			var datas = [];
			var climbs = {
				climbsInf7: [],
				climbsInf10: [],
				climbsInf15: [],
				climbsSup15: []
			};

			var sortedElevationPoints = _.sortBy(elevationPointsDataModel, function(elevationPoint) {
				return parseFloat(elevationPoint.distanceFromStart.toFixed(2));
			});

			for (var k = 0; k < sortedElevationPoints.length; k++) {

				var data = {
					x: parseFloat(sortedElevationPoints[k].distanceFromStart.toFixed(2)),
					y: Math.floor(sortedElevationPoints[k].elevation),
					grade: sortedElevationPoints[k].grade,
					color: "blue",
					fillColor: "blue",
					segmentId: sortedElevationPoints[k].segmentId,
					lat: sortedElevationPoints[k].lat,
					lng: sortedElevationPoints[k].lng,

				};

				datas.push(data);
			}

			climbs = this._createClimbsDataModel(elevationPointsDataModel);

			this._chartConfig.series[0].data = this._chartConfig.series[0].data.concat(datas);
			this._chartConfig.series[1].data = this._chartConfig.series[1].data.concat(climbs.climbsInf7);
			this._chartConfig.series[2].data = this._chartConfig.series[2].data.concat(climbs.climbsInf10);
			this._chartConfig.series[3].data = this._chartConfig.series[3].data.concat(climbs.climbsInf15);
			this._chartConfig.series[4].data = this._chartConfig.series[4].data.concat(climbs.climbsSup15);
		};


		//KEEP
		this.addClickListener = function(callback) {
			var _this = this;
			this._events = {
				click: function(mapModel, eventName, originalEventArgs) {
					callback(_this, originalEventArgs[0].latLng);
				}
			};
		};

		this._updateDistance = function() {
			this.setDistance(this.getLastPointOfLastSegmentDataModel().distanceFromStart);
		};

		//TO BE REMOVED
		/*this._getLastLatLngOfPath = function(path) {

			var lastLatLng;

			if (!path || path.length === 0) {
				throw new Error("path is must contain at least one LatLng");
			}

			lastLatLng = path[path.length - 1];


			if (!(lastLatLng instanceof google.maps.LatLng)) {
				throw new Error("Last LatLng is not instance of google.maps.Latlng");
			}

			return lastLatLng;
		};*/

		this._visible = false;
		this._zoom = 13;
		this._editMode = true;
		this._travelMode = google.maps.TravelMode.DRIVING;
		this._fit = true;
		this._options = gmapsConfig;
		this._events = null;
		this._chartConfig = chartConfig;
		this._type = null;
		this._mode = false;

		this.segments = this._createSegmentsViewModel(this.data.segments);
		this.elevationPoints = this._createElevationPointsViewModel(this.data.elevationPoints);

		this._markers = this._createMarkersDataModel(this.segments);
		this._polylines = this._createPolylinesDataModel(this.segments);

		this.data.elevationPoints = _.sortBy(this.data.elevationPoints, function(elevationPoint) {
			return parseFloat(elevationPoint.distanceFromStart.toFixed(2));
		});

		this._elevations = this._createElevationsDataModel(this.data.elevationPoints);
		this._climbs = this._createClimbsDataModel(this.data.elevationPoints);

		this._chartConfig.series[0].data = this._elevations;
		this._chartConfig.series[1].data = this._climbs.climbsInf7;
		this._chartConfig.series[2].data = this._climbs.climbsInf10;
		this._chartConfig.series[3].data = this._climbs.climbsInf15;
		this._chartConfig.series[4].data = this._climbs.climbsSup15;

		this._chartConfig.title = this.data.type;

		this._calculateElevationDataAlongRoute();

		this.getId = function() {
			return this.data._id;
		};

		this.getEvents = function() {
			return this._events;
		};

		this.getCenter = function() {
			return this._center;
		};

		this.setCenter = function(center) {
			this._center = center;
		};

		this.getElevationPoints = function() {
			return this.data.elevationPoints;
		};

		this.isVisible = function() {
			return this._visible;
		};

		this.setVisible = function(visible) {
			this._visible = visible;
		};

		this.getZoom = function() {
			return this._zoom;
		};

		this.setZoom = function(zoom) {
			this._zoom = zoom;
		};

		this.isEditMode = function() {
			return this._editMode;
		};

		this.setEditMode = function(editMode) {
			this._editMode = editMode;
		};

		this.setFit = function(fit) {
			this._fit = fit;
		};

		this.getFit = function() {
			return this._fit;
		};

		this.setTravelMode = function(travelMode) {
			this._travelMode = travelMode;
		};

		this.getTravelMode = function() {
			return this._travelMode;
		};

		this.setOptions = function(options) {
			this._options = options;
		};

		this.getOptions = function() {
			return this._options;
		};

		this.getChartConfig = function() {
			return this._chartConfig;
		};

		this.getType = function() {
			return this.data.type;
		};

		this.getPolylines = function() {
			return this._polylines;
		};

		this.getMarkers = function() {
			return this._markers;
		};


		this.setDistance = function(distance) {
			this.data.distance = distance;
		};

		this.getDistance = function() {
			return this.data.distance;
		};

		this.setMinElevation = function(minElevation) {
			this.data.minElevation = minElevation;
		};

		this.getMinElevation = function() {
			return this.data.minElevation;
		};

		this.setMaxElevation = function(maxElevation) {
			this.data.minElevation = maxElevation;
		};

		this.getMaxElevation = function() {
			return this.data.maxElevation;
		};

		this.setAscendant = function(ascendant) {
			this.data.ascendant = ascendant;
		};

		this.getAscendant = function() {
			return this.data.ascendant;
		};

		this.setDescendant = function(descendant) {
			this.data.descendant = descendant;
		};

		this.getDescendant = function() {
			return this.data.descendant;
		};

		this.getSegments = function() {
			return this.segments;
		};

		//KEEP
		this.reset = function() {
			this.data.ascendant = 0;
			this.data.descendant = 0;
			this.data.minElevation = 0;
			this.data.maxElevation = 0;
			this.data.distance = 0.0;
			this.data.elevationPoints = [];
			this.data.segments = [];
			this.segments = [];
			this.elevationPoints = [];

			this._markers.length = 0;
			this._polylines.length = 0;
			this._climbs = [];

			this._chartConfig.series[0].data = [];
			this._chartConfig.series[1].data = [];
			this._chartConfig.series[2].data = [];
			this._chartConfig.series[3].data = [];
			this._chartConfig.series[4].data = [];
		};


	};

	routeBuilder.Segment = function(dataModel, lastPointOfLastSegment) {

		this.data = dataModel;


		if (!this.data.id) {
			this.data.id = routeBuilder.generateUUID();
		}

		if (!this.data.distance) {
			this.data.distance = 0;
		}

		this.getId = function() {
			return this.data.id;
		};

		this.lastPointOfLastSegment = lastPointOfLastSegment;

		this.getLastPointOfLastSegment = function() {
			return this.lastPointOfLastSegment;
		};

		this._createPointsViewModel = function(pointsDataModel) {
			var pointsViewModel = [];
			var distanceBetween2Points = 0.0;
			var cumulatedDistance = 0;

			var lastPointOfLastSegment = this.getLastPointOfLastSegment();

			if (lastPointOfLastSegment) {

				cumulatedDistance = lastPointOfLastSegment.distanceFromStart;

				for (var k = 0, lk = pointsDataModel.length; k < lk; k++) {

					if (k === 0) {
						distanceBetween2Points = parseFloat(routeBuilder.calculateDistanceBetween2Points(lastPointOfLastSegment, pointsDataModel[k]));
					} else {
						distanceBetween2Points = parseFloat(routeBuilder.calculateDistanceBetween2Points(pointsDataModel[k - 1], pointsDataModel[k]));
					}

					cumulatedDistance += distanceBetween2Points;

					pointsDataModel[k].distanceFromStart = cumulatedDistance;

					pointsViewModel.push(new routeBuilder.Point(pointsDataModel[k], this.getId()));
				}

			} else {
				pointsViewModel.push(new routeBuilder.Point(pointsDataModel[0], this.getId()));
			}

			return pointsViewModel;
		};


		this._createSamplingPointsViewModel = function() {

			var distanceBetween2Points = 0.0;
			var samplingPointsViewModel = [];
			var lastPoint = this.getLastPointOfLastSegment();
			var samples = 0.1;


			var cursor = lastPoint;

			if (lastPoint) {
				for (var k = 0, lk = this.data.points.length; k < lk; k++) {

					distanceBetween2Points = parseFloat(routeBuilder.calculateDistanceBetween2Points(cursor, this.points[k].data));

					if (k === (this.points.length - 1) || distanceBetween2Points >= samples) {
						samplingPointsViewModel.push(this.data.points[k]);
						cursor = this.data.points[k];
					}
				}
			} else {
				if (this.data.points.length === 1) {
					samplingPointsViewModel.push(this.data.points[0]);
				}
			}
			return samplingPointsViewModel;
		};

		this.points = this._createPointsViewModel(this.data.points);
		this.samplingPoints = this._createSamplingPointsViewModel();

		this.getPoints = function() {
			return this.points;
		};

		this.getSamplingPoints = function() {
			return this.samplingPoints;
		};

		this.getDistance = function() {
			return this.data.distance;
		};

	};

	routeBuilder.Point = function(dataModel, segmentId) {

		this.data = dataModel;

		this.data.segmentId = segmentId;


		this.getLatitude = function() {
			return this.data.lat;
		};

		this.getLongitude = function() {
			return this.data.lng;
		};

		this.getDistanceFromStart = function() {
			return this.data.distanceFromStart;
		};

		this.getElevation = function() {
			return this.data.elevation;
		};

		this.getGrade = function() {
			return this.data.grade;
		};

		this.getSegmentId = function() {
			return this.data.segmentId;
		};

	};

	//TO BE REMOVED
	routeBuilder.rad = function(x) {
		return (x * Math.PI) / 180;
	};
	//TO BE REMOVED
	routeBuilder.calculateDistanceBetween2Points = function(p1, p2) {

		if ((!p1 || (p1.lat >= 180 || p1.lat <= -180)) || (!p2 || (p2.lat >= 180 || p2.lat <= -180))) {
			throw new Error("invalid longitude");
		}

		if ((!p1 || (p1.lng >= 90 || p1.lng <= -90)) || (!p2 || (p2.lng >= 90 || p2.lng <= -90))) {
			throw new Error("invalid latitude");
		}

		var R = 6371; // earth"s mean radius in km
		var dLat = routeBuilder.rad(p2.lat - p1.lat);
		var dLong = routeBuilder.rad(p2.lng - p1.lng);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(routeBuilder.rad(p1.lat)) * Math.cos(routeBuilder.rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;

		return d.toFixed(3);
	};

	//KEEP
	routeBuilder.generateUUID = function() {
		var d = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === "x" ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	};


})();