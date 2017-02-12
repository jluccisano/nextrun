'use strict';

describe('FeedbackModalController', function() {

	var $scope, $controller, $q, mockModal, mockContactService, mockAlertService,  mockRaceId;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _AlertService_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlertService = _AlertService_;
		mockRaceId = "12345";
		mockModal = _MockFactory_.getMockModalService();
		mockContactService = _MockFactory_.getMockContactService();

		spyOn(mockContactService, "sendFeedback").and.callThrough();

		$controller('FeedbackModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			ContactService: mockContactService,
			AlertService: mockAlertService,
			raceId: mockRaceId
		});
	}));

	describe('submit()', function() {

		it('submit with success', function() {
			mockContactService.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockAlertService, "add");
			$scope.submit();
			$scope.$apply();
			expect(mockContactService.sendFeedback).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockAlertService.add).toHaveBeenCalled();
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