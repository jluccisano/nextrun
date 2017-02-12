angular.module('nextrunApp').factory('RouteServices', function() {
	'use strict';

	var route = {
		ascendant: 0,
		descendant: 0,
		minElevation: 0,
		maxElevation: 0,
		distance: 0,
		type: null,
		elevationPoints: [],
		segments: []
	};


	return {
		initialize: function(theroute) {

			if (theroute) {
				route.ascendant = theroute.ascendant;
				route.descendant = theroute.descendant;
				route.minElevation = theroute.minElevation;
				route.maxElevation = theroute.maxElevation;
				route.distance = theroute.distance;
				route.type = theroute.type;

				//init elevation points
				route.elevationPoints = [];
				for (var y = 0; y < theroute.elevationPoints.length; y++) {
					addElevationPoint(new Point(theroute.elevationPoints[y]));
				}

				//init segments
				route.segments = [];
				for (var z = 0; z < route.segments.length; z++) {
					addSegment(new Segment(theroute.segments[z]));
				}
			} else {
				route.ascendant = 0;
				route.descendant = 0;
				route.minElevation = 0;
				route.maxElevation = 0;
				route.distance = 0.0;
				route.elevationPoints = [];
				route.segments = [];
				route.type = null;
			}

		},

		fixed: function() {
			setMinElevation(Math.floor(this.minElevation));
			setMaxElevation(Math.floor(this.maxElevation));
			setAscendant(Math.floor(this.ascendant));
			setDescendant(Math.floor(this.descendant));
			setDistance(this.distance.toFixed(2));
			//return this;
		},

		addSegment: function(segment) {
			route.segments.push(segment);
		},

		addElevationPoint: function(elevationPoint) {
			route.elevationPoints.push(elevationPoint);
		},

		calculateElevationDataAlongRoute: function() {

			route.ascendant = 0;
			route.descendant = 0;
			route.minElevation = route.elevationPoints[0].getElevation();
			route.maxElevation = route.elevationPoints[0].getElevation();

			if (route.elevationPoints.length > 0) {


				for (var k = 1, lk = route.elevationPoints.length; k < lk; ++k) {

					diffElevation = (parseFloat(route.elevationPoints[k].getElevation()) - parseFloat(route.elevationPoints[k - 1].getElevation()));

					if (diffElevation > 0) {
						setAscendant(route.getAscendant() + diffElevation);
					} else {
						setDescendant(route.getDescendant() + diffElevation);
					}

					if (route.elevationPoints[k - 1].getElevation() > this.getMaxElevation()) {
						setMaxElevation(this.elevationPoints[k - 1].getElevation());
					}

					if (route.elevationPoints[k - 1].getElevation() < route.getMinElevation()) {
						setMinElevation(route.elevationPoints[k - 1].getElevation());
					}
				}
			}
		},

		getType: function() {
			return route.type;
		},

		setType: function(type) {
			route.type = type;
		},

		getSegments: function() {
			return route.segments;
		},

		getSegment: function(index) {
			return route.segments[index];
		},

		addSegments: function(segments) {
			route.segments = segments;
		},

		getElevationPoints: function() {
			return route.elevationPoints;
		},

		setDistance: function(distance) {
			route.distance = distance;
		},

		getDistance: function() {
			return route.distance;
		},

		getLastElevationPoint: function() {
			return route.elevationPoints[route.elevationPoints.length - 1];
		},

		getAscendant: function() {
			return route.ascendant;
		},

		setAscendant: function(ascendant) {
			route.ascendant = ascendant;
		},

		getDescendant: function() {
			return route.descendant;
		},

		setDescendant: function(descendant) {
			route.descendant = descendant;
		},

		setMaxElevation: function(maxElevation) {
			route.maxElevation = maxElevation;
		},

		getMaxElevation: function() {
			return route.maxElevation;
		},

		setMinElevation: function(minElevation) {
			route.minElevation = minElevation;
		},

		getMinElevation: function() {
			return route.minElevation;
		},

		removeElevationPointsBySegmentId: function(segmentId) {
			for (var k = route.elevationPoints.length - 1; k >= 0; k--) {
				if (route.elevationPoints[k].getSegmentId() === segmentId) {
					route.elevationPoints.splice(k, 1);
				}
			}
		},

		removeLastSegment: function() {
			route.segments.splice(route.segments.length - 1, 1);
		},

		clearSegment: function() {

			var lastSegment = getLastSegment();
			route.removeElevationPointsBySegmentId(lastSegment.getSegmentId());
			route.removeLastSegment();
			//this.removePointsBySegmentId(segmentId);

			if (getLastPointOfLastSegment()) {
				setDistance(getLastPointOfLastSegment().getDistanceFromStart());
				calculateElevationDataAlongRoute();
			} else {
				setDistance(0);
				setMaxElevation(0);
				setMinElevation(0);
				setAscendant(0);
				setDescendant(0);
			}
		},

		getLastSegment: function() {
			var segmentIndex = 0;
			if (segments.length > 0) {
				segmentIndex = this.segments.length - 1;
			}
			var lastSegment = this.segments[segmentIndex];
			return lastSegment;
		},

		getLastPointOfLastSegment: function() {

			var lastPointOfLastSegment = null;
			var segmentIndex = 0;
			var pointIndex = 0;

			if (route.segments.length > 0) {
				segmentIndex = route.segments.length - 1;
			}

			var lastSegment = route.segments[segmentIndex];

			if (lastSegment) {
				var pointsOfLastSegment = lastSegment.getPoints();

				if (pointsOfLastSegment.length > 0) {
					pointIndex = pointsOfLastSegment.length - 1;
				}

				lastPointOfLastSegment = pointsOfLastSegment[pointIndex];
			}

			return lastPointOfLastSegment;
		},

		clear: function() {
			route.ascendant = 0;
			route.descendant = 0;
			route.minElevation = 0;
			route.maxElevation = 0;
			route.distance = 0.0;
			route.elevationPoints = [];
			route.segments = [];
		}


	};
});