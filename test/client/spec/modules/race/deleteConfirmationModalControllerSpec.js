'use strict';

describe('DeleteConfirmationModalController', function() {

	var $scope, $controller, $q, mockModal, mockRaceServices, mockAlert;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _Alert_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlert = _Alert_;
		mockModal = _MockFactory_.getMockModalServices();
		mockRaceServices = _MockFactory_.getMockRaceServices();

		spyOn(mockRaceServices, "delete").and.callThrough();

		$controller('DeleteConfirmationModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			RaceServices: mockRaceServices,
			Alert: mockAlert,
			race: {
				_id: 1
			}
		});
	}));

	describe('submit()', function() {

		it('deleteRace with success', function() {
			mockRaceServices.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockAlert, "add");
			$scope.deleteRace();
			$scope.$apply();
			expect(mockRaceServices.delete).toHaveBeenCalledWith(1);
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.delete.successfully", 3000);
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