angular.module('mockModule').value('mockSegment', {
	segmentId: '110E8400-E29B-11D4-A716-446655440000',
	points: [{
		latlng: {
			mb: 45.3,
			nb: 1.3
		},

		elevation: 0,
		distanceFromStart: 0,
		grade: 0,
		segmentId: '110E8400-E29B-11D4-A716-446655440000'
	}, {
		latlng: {
			mb: 45.4,
			nb: 1.4
		},

		elevation: 0,
		distanceFromStart: 0,
		grade: 0,
		segmentId: '110E8400-E29B-11D4-A716-446655440000'
	}],
	distance: 2
});

angular.module('mockModule').value('mockSegments', [{
	segmentId: '110E8400-E29B-11D4-A716-446655440000',
	points: [{
		latlng: {
			mb: 45.4,
			nb: 1.4
		},
		elevation: 0,
		distanceFromStart: 0,
		grade: 0,
		segmentId: '110E8400-E29B-11D4-A716-446655440000'
	}],
	distance: 2
}]);