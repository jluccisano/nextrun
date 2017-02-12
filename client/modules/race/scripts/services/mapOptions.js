angular.module("nextrurApp.race").value("mapOptions", {
	isVisible: false,
	editMode: true,
	segments: [],
	zoom: 6,
	fit: true,
	markers: [],
	polylines: [],
	center: {
		latitude: 46.52863469527167,
		longitude: 2.43896484375,
	},
	options: {
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
	},
	clusterOptions: {
		gridSize: 60,
		ignoreHidden: true,
		minimumClusterSize: 2
	},
	doClusterMarkers: true
});