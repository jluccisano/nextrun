'use strict';

describe('FeedbackModalController', function() {

	var $scope, $controller, $q, mockModal, mockContactService, mockNotificationService,  mockRaceId;

	beforeEach(module('nextrunApp.race','mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _notificationService_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockNotificationService = _notificationService_;
		mockRaceId = "12345";
		mockModal = _MockFactory_.getMockModalService();
		mockContactService = _MockFactory_.getMockContactService();

		spyOn(mockContactService, "sendFeedback").and.callThrough();

		$controller('FeedbackModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			ContactService: mockContactService,
			notificationService: mockNotificationService,
			raceId: mockRaceId
		});
	}));

	describe('submit()', function() {

		it('submit with success', function() {
			mockContactService.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockNotificationService, "success");
			$scope.submit();
			$scope.$apply();
			expect(mockContactService.sendFeedback).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockNotificationService.success).toHaveBeenCalled();
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