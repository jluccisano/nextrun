'use strict';

describe('FeedbackModalController', function() {

	var $scope, $controller, $q, mockModal, mockContactServices, mockAlert,  mockRaceId;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _Alert_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlert = _Alert_;
		mockRaceId = "12345";
		mockModal = _MockFactory_.getMockModalServices();
		mockContactServices = _MockFactory_.getMockContactServices();

		spyOn(mockContactServices, "sendFeedback").and.callThrough();

		$controller('FeedbackModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			ContactServices: mockContactServices,
			Alert: mockAlert,
			raceId: mockRaceId
		});
	}));

	describe('submit()', function() {

		it('submit with success', function() {
			mockContactServices.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockAlert, "add");
			$scope.submit();
			$scope.$apply();
			expect(mockContactServices.sendFeedback).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockAlert.add).toHaveBeenCalledWith("success", 'message.sendFeedback.successfully', 3000);
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