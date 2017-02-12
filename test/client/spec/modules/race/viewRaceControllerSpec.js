'use strict';

describe('ViewRaceController', function() {

	var $scope,
		$controller,
		$location,
		$q,
		$timeout,
		$modal,
		mockRaceService,
		mockRace,
		mockNotificationService,
		mockModal,
		mockRaceTypeEnum,
		mockRouteHelperService,
		MetaService;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$timeout_, _notificationService_, _$modal_, _MockFactory_, _RaceTypeEnum_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		MetaService = _MetaService_;
		$timeout = _$timeout_;
		$modal = _$modal_;
		mockNotificationService = _notificationService_;
		mockRaceTypeEnum = _RaceTypeEnum_;
		mockModal = _MockFactory_.getMockModalService();
		mockRace = _MockFactory_.getMockRace();
		mockRaceService = _MockFactory_.getMockRaceService();
		mockRouteHelperService = _MockFactory_.getMockRouteHelperService();

		mockRouteHelperService = jasmine.createSpyObj("mockRouteHelperService", ["getChartConfig", "getGmapsConfig"]);	

		$controller('ViewRaceController', {
			$scope: $scope,
			RaceService: mockRaceService,
			notificationService: mockNotificationService,
			RouteHelperService: mockRouteHelperService
		});
	}));

	describe('init()', function() {
		/*it('load race with success', function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockRaceService, "retrieve").and.callThrough();

			spyOn(mockRaceTypeEnum, "getRaceTypeByName").and.returnValue({
				i18n: "Course à pied",
				name: 'running',
				distances: [{
					name: '3km',
					i18n: '3km'
				}, {
					name: '5km',
					i18n: '5km'
				}, {
					name: '10km',
					i18n: '10km'
				}, {
					name: 'Semi-Marathon',
					i18n: 'Semi-Marathon - 21,1km'
				}, {
					name: 'Marathon',
					i18n: 'Marathon - 42,195km'
				}, {
					name: '100km',
					i18n: '100km'
				}],
				routes: [{
					name: 'running',
					i18n: 'Course à pied'
				}]
			});

			spyOn(MetaService, "ready");

			$scope.raceId = "12345";

			$scope.init();
			$scope.$apply();
			expect(MetaService.ready).toHaveBeenCalled();
			expect($scope.race.name).toEqual(mockRace.name);

		});*/
	});

	describe('open feedback modal()', function() {
		/*it('should call init when the modal close is called', function() {
			spyOn($modal, 'open').and.returnValue(mockModal);
			$scope.openFeedbackModal("12345");
		});*/
	});
});