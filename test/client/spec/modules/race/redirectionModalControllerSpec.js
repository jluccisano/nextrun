'use strict';

describe('RedirectionModalController', function() {

	var $scope, $controller, $location, mockModal, mockRaceId;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$location_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$location = _$location_;

		mockRaceId = "12345";
		mockModal = _MockFactory_.getMockModalService();

		$controller('RedirectionModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			raceId: mockRaceId
		});
	}));

	describe('goToEdit()', function() {

		it('goToEdit with success', function() {
			spyOn(mockModal, "close");
			spyOn($location, "path");
			$scope.goToEdit();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect($location.path).toHaveBeenCalledWith('/races/edit/' + mockRaceId);
		});
	});

	describe('goToMyRaces()', function() {

		it('goToEdit with success', function() {
			spyOn(mockModal, "close");
			spyOn($location, "path");
			$scope.goToMyRaces();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect($location.path).toHaveBeenCalledWith('/myraces');
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