'use strict';

describe('ChangeTypeConfirmationModalController', function() {

	var $scope, $controller, mockModal;

	beforeEach(module('nextrunApp.race', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;

		mockModal = _MockFactory_.getMockModalService();

		$controller('ChangeTypeConfirmationModalController', {
			$scope: $scope,
			$modalInstance: mockModal
		});
	}));

	describe('continue()', function() {

		it('continue with success', function() {
			spyOn(mockModal, "close");
			$scope.continue();
			expect(mockModal.close).toHaveBeenCalled();
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