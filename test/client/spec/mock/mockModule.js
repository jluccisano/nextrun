"use strict";

var mockModule = angular.module("mockModule", []);

mockModule.factory("MockFactory",
	function(
		mockRace,
		mockRoute,
		mockContact,
		mockModalService,
		mockRouteService,
		mockRouteHelperService,
		mockRaceService,
		mockFileReaderService,
		mockContactService,
		mockAuthService,
		mockSharedMetaService,
		mockUser,
		mockCriteria,
		mockSuggestResponse,
		mockGoogleMapsAPIService,
		mockGpxService,
		mockPath,
		mockLegs,
		mockPoint,
		mockSegment,
		mockSegments,
		mockMarkers) {

		return {
			getMockRace: function() {
				return mockRace;
			},
			getMockModalService: function() {
				return mockModalService;
			},
			getMockRoute: function() {
				return mockRoute;
			},
			getMockRouteService: function() {
				return mockRouteService;
			},
			getMockRouteHelperService: function() {
				return mockRouteHelperService;
			},
			getMockRaceService: function() {
				return mockRaceService;
			},
			getMockFileReaderService: function() {
				return mockFileReaderService;
			},
			getMockContactService: function() {
				return mockContactService;
			},
			getMockContact: function() {
				return mockContact;
			},
			getMockAuthService: function() {
				return mockAuthService;
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
				return mockGoogleMapsAPIService;
			},
			getMockGpxService: function() {
				return mockGpxService;
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

		};
	});