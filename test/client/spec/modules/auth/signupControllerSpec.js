'use strict';

describe('SignupController', function() {

	var $scope, $controller, $location, $q, mockAuthServices, mockAlert, metaBuilder;

	beforeEach(module('nextrunApp.auth', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _Alert_, _$location_, _MockFactory_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlert = _Alert_;
		$location = _$location_;
		metaBuilder = _metaBuilder_;

		mockAuthServices = _MockFactory_.getMockAuthServices();

		spyOn(metaBuilder, "ready");

		$controller('SignupController', {
			$scope: $scope,
			AuthServices: mockAuthServices,
			Alert: mockAlert
		});
	}));

	describe('submit()', function() {
		it('submit with success', function() {
			mockAuthServices.setPromiseResponse(true);
			spyOn(mockAuthServices, "register").and.callThrough();
			spyOn(mockAlert, "add");
			spyOn($location, "path");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthServices.register).toHaveBeenCalled();
			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.signup.successfully", 3000);
			expect($location.path).toHaveBeenCalledWith('/');
			expect(metaBuilder.ready).toHaveBeenCalled();
		});

	});
});