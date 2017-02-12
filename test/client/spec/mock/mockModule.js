var mockModule = angular.module('mockModule', []);

mockModule.factory('MockFactory', [
	'mockRace',
	'mockRoute',
	'mockContact',
	'mockModalServices',
	'mockRouteServices',
	'mockRouteHelperServices',
	'mockRaceServices',
	'mockFileReaderServices',
	'mockContactServices',
	'mockAuthServices',
	'mockSharedMetaService',
	'mockUser',
	'mockCriteria',
	'mockSuggestResponse',
	'mockGoogleMapsAPIServices',
	'mockGpxServices',
	'mockPath',
	'mockLegs',
	'mockPoint',
	'mockSegment',
	'mockSegments',
	'mockMarkers',
	function(
		mockRace,
		mockRoute,
		mockContact,
		mockModalServices,
		mockRouteServices,
		mockRouteHelperServices,
		mockRaceServices,
		mockFileReaderServices,
		mockContactServices,
		mockAuthServices,
		mockSharedMetaService,
		mockUser,
		mockCriteria,
		mockSuggestResponse,
		mockGoogleMapsAPIServices,
		mockGpxServices,
		mockPath,
		mockLegs,
		mockPoint,
		mockSegment,
		mockSegments,
		mockMarkers) {

		'use strict';

		return {
			getMockRace: function() {
				return mockRace;
			},
			getMockModalServices: function() {
				return mockModalServices;
			},
			getMockRoute: function() {
				return mockRoute;
			},
			getMockRouteServices: function() {
				return mockRouteServices;
			},
			getMockRouteHelperServices: function() {
				return mockRouteHelperServices;
			},
			getMockRaceServices: function() {
				return mockRaceServices;
			},
			getMockFileReaderServices: function() {
				return mockFileReaderServices;
			},
			getMockContactServices: function() {
				return mockContactServices;
			},
			getMockContact: function() {
				return mockContact;
			},
			getMockAuthServices: function() {
				return mockAuthServices;
			},
			getMockSharedMetaService: function() {
				return mockSharedMetaService;
			},
			getMockUser: function() {
				return mockUser;
			},
			getMockCriteria: function() {
				return mockCriteria;
			},
			getMockSuggestResponse: function() {
				return mockSuggestResponse;
			},
			getMockGoogleMapsAPIServices: function() {
				return mockGoogleMapsAPIServices;
			},
			getMockGpxServices: function() {
				return mockGpxServices;
			},
			getMockPath: function() {
				return mockPath;
			},
			getMockLegs: function() {
				return mockLegs;
			},
			getMockSegments: function() {
				return mockSegments;
			},
			getMockSegment: function() {
				return mockSegment;
			},
			getMockPoint: function() {
				return mockPoint;
			},
			getMockMarkers: function() {
				return mockMarkers;
			},

		}
	}
]);