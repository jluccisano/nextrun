'use strict';

describe('MyRacesController', function() {

	var $scope, $controller, $location, $q, $modal, mockRaceServices, mockRace, mockModal, mockAlert, metaBuilder;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _Alert_,_MockFactory_,_metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		metaBuilder = _metaBuilder_;
		$modal = _$modal_;
		mockAlert = _Alert_;
		mockRace = _MockFactory_.getMockRace();
		mockModal = _MockFactory_.getMockModalServices();
		mockRaceServices = _MockFactory_.getMockRaceServices();

		$controller('MyRacesController', {
			$scope: $scope,
			RaceServices: mockRaceServices,
			Alert: mockAlert
		});

	}));

	describe('init()', function() {

		it('init with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(mockAlert, "add");
			spyOn(mockRaceServices, "find").and.callThrough();
			spyOn(metaBuilder, "ready");

			$scope.init();
			$scope.$apply();

			expect(metaBuilder.ready).toHaveBeenCalled();
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
			mockRaceServices.setPromiseResponse(true);

			spyOn(mockRaceServices, "publish").and.callThrough();
			spyOn($scope, "init");
			spyOn(mockAlert, "add");

			$scope.publish(mockRace, true);
			$scope.$apply();

			expect($scope.init).toHaveBeenCalled();
			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.publish.successfully", 3000);

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