'use strict';

describe('MyRacesController', function() {

	var $scope, $controller, $location, $q, $modal, mockRaceService, mockRace, mockModal, mockNotificationService, MetaService;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _notificationService_,_MockFactory_,_MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		MetaService = _MetaService_;
		$modal = _$modal_;
		mockNotificationService = _notificationService_;
		mockRace = _MockFactory_.getMockRace();
		mockModal = _MockFactory_.getMockModalService();
		mockRaceService = _MockFactory_.getMockRaceService();

		$controller('MyRacesController', {
			$scope: $scope,
			RaceService: mockRaceService,
			notificationService: mockNotificationService
		});

	}));

	describe('init()', function() {

		it('init with success', function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockNotificationService, "success");
			spyOn(mockRaceService, "find").and.callThrough();
			spyOn(MetaService, "ready");

			$scope.init();
			$scope.$apply();

			expect(MetaService.ready).toHaveBeenCalled();
			expect($scope.races.length).toBe(1);
		});

	});

	describe('addNewRace()', function() {

		it('go to view new race with success', function() {
			spyOn($location, "path");

			$scope.addNewRace();

			expect($location.path).toHaveBeenCalledWith('/races/create');
		});

	});

	describe('publish()', function() {

		it('publish with success', function() {
			mockRaceService.setPromiseResponse(true);

			spyOn(mockRaceService, "publish").and.callThrough();
			spyOn($scope, "init");
			spyOn(mockNotificationService, "success");

			$scope.publish(mockRace, true);
			$scope.$apply();

			expect($scope.init).toHaveBeenCalled();
			expect(mockNotificationService.success).toHaveBeenCalled();
		});

	});

});