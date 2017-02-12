'use strict';

describe('MyRacesController', function() {

	var $scope, $controller, $location, $q, $modal, mockRaceService, mockRace, mockModal, mockAlertService, MetaService;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _AlertService_,_MockFactory_,_MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		MetaService = _MetaService_;
		$modal = _$modal_;
		mockAlertService = _AlertService_;
		mockRace = _MockFactory_.getMockRace();
		mockModal = _MockFactory_.getMockModalService();
		mockRaceService = _MockFactory_.getMockRaceService();

		$controller('MyRacesController', {
			$scope: $scope,
			RaceService: mockRaceService,
			AlertService: mockAlertService
		});

	}));

	describe('init()', function() {

		it('init with success', function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockAlertService, "add");
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
			spyOn(mockAlertService, "add");

			$scope.publish(mockRace, true);
			$scope.$apply();

			expect($scope.init).toHaveBeenCalled();
			expect(mockAlertService.add).toHaveBeenCalled();
		});

	});

	describe('open modal()', function() {
		it('should call init when the modal close is called', function() {
			spyOn($modal, 'open').and.returnValue(mockModal);
			spyOn($scope, 'init');

			$scope.openDeleteConfirmation(mockRace);
			$scope.modalInstance.close();
			expect($scope.init).toHaveBeenCalled();
		});
	});

});