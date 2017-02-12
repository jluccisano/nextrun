"use strict";
/**
 * Route builder
 * @author Joseph Luccisano
 */
 
/*jshint -W079 */
var routeBuilder = {}; 

(function() {


	routeBuilder.Route = function(dataModel, chartConfig, gmapsConfig, center) {

		this.data = dataModel;

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
						this.setAscendant(this.getAscendant() + diffElevation);
					} else {
						this.setDescendant(this.getDescendant() + diffElevation);
					}

					if (this.data.elevationPoints[k - 1].elevation > this.getMaxElevation()) {
						this.setMaxElevation(this.data.elevationPoints[k - 1].elevation);
					}

					if (this.data.elevationPoints[k - 1].elevation < this.getMinElevation()) {
						this.setMinElevation(this.data.elevationPoints[k - 1].elevation);
					}
				}
			}
		};

		this._createSegmentsViewModel = function(segmentsDataModel) {
			var segmentsViewModel = [];

			_.each(segmentsDataModel, function(segmentDataModel) {
				segmentsViewModel.push(new routeBuilder.Segment(segmentDataModel));
			});

			return segmentsViewModel;
		};

		this._createElevationPointsViewModel = function(elevationPointsDataModel) {

			var elevationPointsViewModel = [];

			_.each(elevationPointsDataModel, function(elevationPointDataModel) {
				elevationPointsViewModel.push(new routeBuilder.Point(elevationPointDataModel));
			});

			return elevationPointsViewModel;
		};

		this._createPolylinesDataModel = function(segmentsDataModel) {
			var polylinesDataModel = [];
			var pathArray = [];

			_.each(segmentsDataModel, function(segment, index) {

				var lastPointOfLastSegment;

				if (index > 0) {

					var previousSegment = segmentsDataModel[index - 1];

					if (typeof previousSegment.points[previousSegment.points.length - 1] !== "undefined") {
						lastPointOfLastSegment = previousSegment.points[previousSegment.points.length - 1];
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

			return polylinesDataModel;
		};

		this._createMarkersDataModel = function(segmentsDataModel, showSegment) {
			var markersDataModel = [];

			_.each(segmentsDataModel, function(segment, index) {

				var lastPointOfSegment;
				var icon;
				var marker;

				if (typeof segment.points[segment.points.length - 1] !== "undefined") {
					lastPointOfSegment = segment.points[segment.points.length - 1];
				}

				if (index === 0) {
					icon = "client/modules/route/images/start.png";
				} else if (index === (segmentsDataModel.length - 1)) {
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
					markersDataModel.push(marker);
				}
			});

			return markersDataModel;
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
					latlng: elevationPoint.latlng

				};
				elevationsDataModel.push(data);
			});

			return elevationsDataModel;
		};

		this._addClimbToSerie = function(elevationPointsDataModel, index, serie) {

			var previousElevationPoint;
			var previousData;

			//get previous point
			if (index > 0) {
				previousElevationPoint = elevationPointsDataModel[index - 1];
				previousData = {
					x: parseFloat(previousElevationPoint.distanceFromStart.toFixed(2)),
					y: previousElevationPoint.elevation,
					grade: previousElevationPoint.grade,
					segmentId: previousElevationPoint.segmentId,
					latlng: previousElevationPoint.latlng

				};
				serie.push(previousData);
			}

			serie.push({
				x: parseFloat(elevationPointsDataModel[index].distanceFromStart.toFixed(2)),
				y: elevationPointsDataModel[index].elevation,
				grade: elevationPointsDataModel[index].grade,
				segmentId: elevationPointsDataModel[index].segmentId,
				latlng: elevationPointsDataModel[index].latlng

			});
		};

		this._createClimbsDataModel = function(elevationPointsDataModel) {

			var climbsDataModel = {
				climbsInf7: [],
				climbsInf10: [],
				climbsInf15: [],
				climbsSup15: []
			};

			_.each(elevationPointsDataModel, function(elevationPoint, index) {

				if (elevationPointsDataModel[index].grade > 5 && elevationPointsDataModel[index].grade <= 7) {

					this._addClimbToSerie(elevationPointsDataModel, index, climbsDataModel.climbsInf7);

				} else if (elevationPointsDataModel[index].grade > 7 && elevationPointsDataModel[index].grade <= 10) {

					this._addClimbToSerie(elevationPointsDataModel, index, climbsDataModel.climbsInf10);

				} else if (elevationPointsDataModel[index].grade > 10 && elevationPointsDataModel[index].grade <= 15) {

					this._addClimbToSerie(elevationPointsDataModel, index, climbsDataModel.climbsInf15);

				} else if (elevationPointsDataModel[index].grade > 15) {

					this._addClimbToSerie(elevationPointsDataModel, index, climbsDataModel.climbsSup15);

				} else {

					var point0 = {
						x: parseFloat(elevationPointsDataModel[index].distanceFromStart.toFixed(2)),
						y: null,
						grade: elevationPointsDataModel[index].grade,
						segmentId: elevationPointsDataModel[index].segmentId,
						latlng: elevationPointsDataModel[index].latlng

					};
					climbsDataModel.climbsInf7.push(point0);
					climbsDataModel.climbsInf10.push(point0);
					climbsDataModel.climbsInf15.push(point0);
					climbsDataModel.climbsSup15.push(point0);
				}

			});

			return climbsDataModel;

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
						grade = ((diffElevation / (distanceWithLastPoint * 1000)) * 100).toFixed(1);
					}
					samplingPoints[k].grade = grade;
				}

				this.data.elevationPoints.push(samplingPoints[k]);

				this.elevationPoints.push(new routeBuilder.Point(samplingPoints[k]));
			}
		};

		this.addClickListener = function(callback) {
			var _this = this;
			this._events = {
				click: function(mapModel, eventName, originalEventArgs) {
					callback(_this, originalEventArgs[0].latLng);
				}
			};
		};

		this.addSegment = function(segmentDataModel) {

			this.data.segments.push(segmentDataModel);

			var newSegment = new routeBuilder.Segment(segmentDataModel, this.getLastPointOfLastSegment());

			this.segments.push(newSegment);

			//createPolyline

			//createMarker

			return newSegment;
		};

		this.createSimpleSegment = function(startLatlng, destinationLatlng) {

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
				latlng: {
					mb: destinationLatlng.lat(),
					nb: destinationLatlng.lng()
				},
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

			this.data.segments.push(segmentDataModel);

			this.segments.push(new routeBuilder.Segment(segmentDataModel));
		};

		this.getLastPointOfLastSegment = function() {

			var lastPointOfLastSegment;
			var segmentIndex = 0;
			var pointIndex = 0;
			var segments = this.getSegments();

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

		this._createMarker = function(latLng, icon, title) {

			if (!(latLng instanceof google.maps.LatLng)) {
				throw new Error("latLng is not instance of google.maps.Latlng");
			}

			var marker = {
				latitude: latLng.lat(),
				longitude: latLng.lng(),
				icon: icon,
				title: title
			};

			return marker;
		};

		this._getLastLatLngOfPath = function(path) {

			var lastLatLng;

			if (!path || path.length >= 0) {
				throw new Error("path is must contain at least one LatLng");
			}

			lastLatLng = path[path.length - 1];


			if (!(lastLatLng instanceof google.maps.LatLng)) {
				throw new Error("Last LatLng is not instance of google.maps.Latlng");
			}

			return lastLatLng;
		};

		this.addMarkerToRoute = function(path) {

			try {

				var marker = {};

				var lastLatLng = this._getLastLatLngOfPath(path);

				if (this.segments.length === 1) {

					this._createMarker(lastLatLng, "client/modules/route/images/start.png", "first point");

				} else {

					//replace last marker by segment point
					var segmentIcon = new google.maps.MarkerImage("client/modules/route/images/segment.png",
						new google.maps.Size(32, 32),
						new google.maps.Point(0, 0),
						new google.maps.Point(8, 8),
						new google.maps.Size(16, 16)
					);

					var lastMarker = this._getLastMarker(this.markers);
					lastMarker.icon = segmentIcon;

					//create the new last marker
					this._createMarker(lastLatLng, "client/modules/route/images/end.png", "end point");
				}

				this._markers.push(marker);

			} catch (ex) {
				console.log("an error occured during add marker to route", ex.message);
			}


		};

		this._getLastMarker = function() {
			return this.markers[this._markers.length - 1];
		};

		this._removeLastMarker = function() {
			this.getMarkers().splice(this.getMarkers().length - 1, 1);
		};

		this.removePointsToElevationChartBySegmentId = function(segmentId) {
			this.getChartConfig().series[0].data = _.difference(this.getChartConfig().series[0].data, _.where(this.getChartConfig().series[0].data, {
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
			}));
		};

		this._removeLastSegment = function() {

			this.data.segments.splice(this.data.segments.length - 1, 1);

			this.segments.splice(this.segments.length - 1, 1);

			if (this.polylines.length > 0) {
				this.polylines.splice(this.polylines.length - 1, 1);
			}
		};

		this._clearSegment = function() {

			var lastPointOfLastSegment = this.getLastPointOfLastSegment(this.segments);

			if (lastPointOfLastSegment) {

				this.data.distance = lastPointOfLastSegment.distanceFromStart;

				//ElevationServices.calculateElevationDataAlongRoute(route);

			} else {
				this.data.ascendant = 0;
				this.data.descendant = 0;
				this.data.minElevation = 0;
				this.data.maxElevation = 0;
				this.data.distance = 0.0;
			}
		};

		this._getLastSegment = function() {
			var lastSegment;

			if (this.segments.length > 0) {
				lastSegment = this.segments[this.segments.length - 1];
			}
			return lastSegment;
		};

		this.addPolyline = function(path, editable, draggable, geodesic, visible, color, weight) {

			var pathArray = [];
			var polyline;

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
				polyline = {
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
			} else {
				throw new Error("polyline must contain at least two point");
			}

			this.polylines.push(polyline);
		};


		this._visible = false;
		this._zoom = 13;
		this._editMode = true;
		this._travelMode = google.maps.TravelMode.DRIVING;
		this._fit = true;
		this._options = gmapsConfig;
		this._events = null;
		this._chartConfig = chartConfig;
		this._type = null;
		this._center = center;

		this.segments = this._createSegmentsViewModel(this.data.segments);
		this.elevationPoints = this._createElevationPointsViewModel(this.data.elevationPoints);

		this._markers = this._createMarkersDataModel(this.data.segments);
		this._polylines = this._createPolylinesDataModel(this.data.segments);

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

		this._calculateElevationDataAlongRoute();

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

		this.setChartConfig = function(chartConfig) {
			this._chartConfig = chartConfig;
		};

		this.getChartConfig = function() {
			return this._chartConfig;
		};

		this.getType = function() {
			return this._type;
		};

		this.setType = function(type) {
			this._type = type;
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


	};

	routeBuilder.Segment = function(dataModel, lastPointOfLastSegment) {

		this.data = dataModel;

		if (!this.data.id) {
			this.data.id = routeBuilder.generateUUID();
		}

		if (!this.data.distance) {
			this.data.distance = 0;
		}

		this.lastPointOfLastSegment = lastPointOfLastSegment;

		this._createPointsViewModel = function(pointsDataModel) {
			var pointsViewModel = [];
			var distanceBetween2Points = 0.0;
			var cumulatedDistance = 0;

			cumulatedDistance = this.getLastPointOfLastSegment().distanceFromStart;

			for (var k = 0, lk = pointsDataModel.length; k < lk; k++) {

				if (k === 0) {
					distanceBetween2Points = parseFloat(routeBuilder.calculateDistanceBetween2Points(this.getLastPointOfLastSegment().latlng, pointsDataModel[k].latlng));
				} else {
					distanceBetween2Points = parseFloat(routeBuilder.calculateDistanceBetween2Points(pointsDataModel[k - 1].latlng, pointsDataModel[k].latlng));
				}

				cumulatedDistance += distanceBetween2Points;

				pointsDataModel[k].distanceFromStart = cumulatedDistance;

				pointsDataModel.push(new routeBuilder.Point(pointsDataModel[k], this.getId()));
			}

			return pointsViewModel;
		};

		this._createSamplingPointsViewModel = function(pointsDataModel) {

			var distanceBetween2Points = 0.0;
			var samplingPointsViewModel = [];
			var lastPoint = null;
			var samples = 0.1;

			var cursor = lastPoint;

			if (lastPoint) {
				for (var k = 0, lk = pointsDataModel.length; k < lk; k++) {

					distanceBetween2Points = parseFloat(routeBuilder.calculateDistanceBetween2Points(cursor.latlng, pointsDataModel[k].latlng));

					if (k === (pointsDataModel.length - 1) || distanceBetween2Points >= samples) {
						samplingPointsViewModel.push(new routeBuilder.Point(pointsDataModel[k], this.getId()));
						cursor = pointsDataModel[k];
					}
				}
			} else {
				if (pointsDataModel.length === 1) {
					samplingPointsViewModel.push(new routeBuilder.Point(pointsDataModel[0], this.getId()));
				}
			}
		};

		this.points = this._createPointsViewModel(this.data.points);
		this.samplingPoints = this._createSamplingPointsViewModel(this.data.points);

		this.calculateDistanceOfSegment();


		this.getId = function() {
			return this.data.id;
		};

		this.getLastPointOfLastSegment = function() {
			return this.lastPointOfLastSegment;
		};

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
			return this.data.latlng.mb;
		};

		this.getLongitude = function() {
			return this.data.latlng.nb;
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


	routeBuilder.rad = function(x) {
		return (x * Math.PI) / 180;
	};

	routeBuilder.calculateDistanceBetween2Points = function(p1, p2) {

		if ((!p1 || (p1.mb >= 180 || p1.mb <= -180)) || (!p2 || (p2.mb >= 180 || p2.mb <= -180))) {
			throw new Error("invalid longitude");
		}

		if ((!p1 || (p1.nb >= 90 || p1.nb <= -90)) || (!p2 || (p2.nb >= 90 || p2.nb <= -90))) {
			throw new Error("invalid latitude");
		}

		var R = 6371; // earth"s mean radius in km
		var dLat = routeBuilder.rad(p2.mb - p1.mb);
		var dLong = routeBuilder.rad(p2.nb - p1.nb);

		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(routeBuilder.rad(p1.mb)) * Math.cos(routeBuilder.rad(p2.mb)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;

		return d.toFixed(3);
	};

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