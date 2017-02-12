"use strict";

describe("ForgotPasswordModalController", function() {

	var $scope, $controller, $q, mockAuthService, mockModal, mockNotificationService;

	beforeEach(module("nextrunApp.auth", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _notificationService_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockNotificationService = _notificationService_;
		mockModal = _MockFactory_.getMockModalService();
		mockAuthService = _MockFactory_.getMockAuthService();

		spyOn(mockAuthService, "forgotPassword").and.callThrough();

		$controller("ForgotPasswordModalController", {
			$scope: $scope,
			$modalInstance: mockModal,
			AuthService: mockAuthService,
			notificationService: mockNotificationService,
		});
	}));

	describe("submit()", function() {

		it("submit with success", function() {
			mockAuthService.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockNotificationService, "success");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthService.forgotPassword).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockNotificationService.success).toHaveBeenCalled();
		});

		it("submit with error", function() {
			mockAuthService.setPromiseResponse(false);
			spyOn(mockModal, "close");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthService.forgotPassword).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
		});
	});

	describe("cancel()", function() {

		it("cancel with success", function() {
			spyOn(mockModal, "dismiss");
			$scope.cancel();
			expect(mockModal.dismiss).toHaveBeenCalledWith("cancel");
		});
	});
});