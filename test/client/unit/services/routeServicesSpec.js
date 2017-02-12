'use strict';

describe('routeServices', function() {
	var RouteFactory;
	var $httpBackend;

	beforeEach(function() {
		module('nextrunApp');
	});

	beforeEach(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
		RouteFactory = $injector.get('RouteFactory');
	}));

	describe('drawPolylines', function() {

		it('should return a polylines', function() {

			var segments = [];

			segments.push({
				segmentId: 1,
				points: [{
					latlng: {
						mb: 42,
						nb: 1.5
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: 1
				}],
				distance: 0
			});

			segments.push({
				segmentId: 2,
				points: [{
					latlng: {
						mb: 43.1,
						nb: 1.6
					},
					elevation: 0,
					distanceFromStart: 0,
					grade: 0,
					segmentId: 2
				}],
				distance: 0
			});



			var polyLine = {
				id: 1,
				path: [],
				stroke: {
					color: "red",
					weight: 5
				},
				editable: false,
				draggable: false,
				geodesic: false,
				visible: true
			}


			expect(RouteFactory.drawPolylines(segments)).toBeDefined();
		});


	});

});