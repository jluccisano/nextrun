"use strict";

describe("ForgotPasswordModalController", function() {

	var $scope, $controller, $q, mockAuthService, mockModal , mockAlertService;

	beforeEach(module("nextrunApp.auth", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _AlertService_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlertService = _AlertService_;
		mockModal = _MockFactory_.getMockModalService();
		mockAuthService = _MockFactory_.getMockAuthService();
		
		spyOn(mockAuthService, "forgotPassword").and.callThrough();

		$controller("ForgotPasswordModalController", {
			$scope: $scope,
			$modalInstance: mockModal,
			AuthService: mockAuthService,
			AlertService: mockAlertService,
		});
	}));

	describe("submit()", function() {

		it("submit with success", function() {
			mockAuthService.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockAlertService, "add");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthService.forgotPassword).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockAlertService.add).toHaveBeenCalledWith("success", "message.email.send.successfully", 3000);
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