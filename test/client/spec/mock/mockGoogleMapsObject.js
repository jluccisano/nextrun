angular.module('mockModule').value('mockPath', [new google.maps.LatLng(45.3, 1.3), new google.maps.LatLng(45.4, 1.4)]);

angular.module('mockModule').value('mockLegs', [{
	distance: {
		value: 1000
	}
}, {
	distance: {
		value: 1000
	}
}]);

angular.module('mockModule').value('mockMarkers', [{
	latitude: 44.0,
	longitude: 1.0,
	icon: 'icon.png',
	title: 'icon title'
}, {
	latitude: 45.0,
	longitude: 1.0,
	icon: 'icon.png',
	title: 'icon title'
}]);