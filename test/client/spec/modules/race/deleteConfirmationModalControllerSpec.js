'use strict';

describe('DeleteConfirmationModalController', function() {

	var $scope, $controller, $q, mockModal, mockRaceService, mockAlertService;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _AlertService_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlertService = _AlertService_;
		mockModal = _MockFactory_.getMockModalService();
		mockRaceService = _MockFactory_.getMockRaceService();

		spyOn(mockRaceService, "delete").and.callThrough();

		$controller('DeleteConfirmationModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			RaceService: mockRaceService,
			AlertService: mockAlertService,
			race: {
				_id: 1
			}
		});
	}));

	describe('submit()', function() {

		it('deleteRace with success', function() {
			mockRaceService.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockAlertService, "add");
			$scope.deleteRace();
			$scope.$apply();
			expect(mockRaceService.delete).toHaveBeenCalledWith(1);
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockAlertService.add).toHaveBeenCalledWith("success", "message.delete.successfully", 3000);
		});
	});

	describe('cancel()', function() {

		it('cancel with success', function() {
			spyOn(mockModal, "dismiss");
			$scope.cancel();
			expect(mockModal.dismiss).toHaveBeenCalledWith('cancel');
		});
	});
});