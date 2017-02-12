'use strict';

describe('ForgotPasswordModalController', function() {

	var $scope, $controller, $q, mockAuthServices, mockModal , mockAlert;

	beforeEach(module('nextrunApp.auth', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _Alert_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlert = _Alert_;
		mockModal = _MockFactory_.getMockModalServices();
		mockAuthServices = _MockFactory_.getMockAuthServices();

		spyOn(mockAuthServices, "forgotPassword").and.callThrough();

		$controller('ForgotPasswordModalController', {
			$scope: $scope,
			$modalInstance: mockModal,
			AuthServices: mockAuthServices,
			Alert: mockAlert,
		});
	}));

	describe('submit()', function() {

		it('submit with success', function() {
			mockAuthServices.setPromiseResponse(true);
			spyOn(mockModal, "close");
			spyOn(mockAlert, "add");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthServices.forgotPassword).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
			expect(mockAlert.add).toHaveBeenCalledWith("success", 'message.email.send.successfully', 3000);
		});

		it('submit with error', function() {
			mockAuthServices.setPromiseResponse(false);
			spyOn(mockModal, "close");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthServices.forgotPassword).toHaveBeenCalled();
			expect(mockModal.close).toHaveBeenCalledWith();
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