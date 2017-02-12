'use strict';

describe('HeaderController', function() {

	var $scope, $controller, $location, $q, mockAuthServices;

	beforeEach(module('nextrunApp.main', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;

		mockAuthServices =  _MockFactory_.getMockAuthServices();

		$controller('HeaderController', {
			$scope: $scope,
			AuthServices: mockAuthServices
		});
	}));

	describe('logout()', function() {

		it('logout with success', function() {
			mockAuthServices.setPromiseResponse(true);
			spyOn(mockAuthServices, "logout").and.callThrough();
			spyOn($location, "path");
			$scope.logout();
			$scope.$apply();
			expect(mockAuthServices.logout).toHaveBeenCalled();
			expect($location.path).toHaveBeenCalledWith('/login');
		});

	});

	describe('login()', function() {

		it('go to login with success', function() {
			spyOn($location, "path");
			$scope.login();
			expect($location.path).toHaveBeenCalledWith('/login');
		});
	});
});