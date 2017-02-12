'use strict';

describe('LoginController', function() {

	var $scope, $controller, $location, $q, $modal, mockAuthServices, mockModal, mockUser, mockAlert, metaBuilder;

	beforeEach(module('nextrunApp.auth', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _MockFactory_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		$modal = _$modal_;
		metaBuilder = _metaBuilder_;

		mockAuthServices = _MockFactory_.getMockAuthServices();
		mockUser = _MockFactory_.getMockUser();
		mockModal = _MockFactory_.getMockModalServices();
	}));

	describe('submit()', function() {

		it('login with success', function() {

			spyOn(mockAuthServices, "login").and.callThrough();

			$controller('LoginController', {
				$scope: $scope,
				AuthServices: mockAuthServices
			});

			mockAuthServices.setPromiseResponse(true);
			spyOn($location, "path");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthServices.login).toHaveBeenCalled();
			expect($location.path).toHaveBeenCalledWith('/myraces');
		});

	});

	describe('signup()', function() {

		it('signup with success', function() {

			$controller('LoginController', {
				$scope: $scope
			});

			spyOn($location, "path");
			$scope.signup();
			expect($location.path).toHaveBeenCalledWith('/signup');
		});

	});

	describe('ready()', function() {
		it('loading with success', function() {
			spyOn(metaBuilder, "ready");

			$controller('LoginController', {
				$scope: $scope
			});

			expect(metaBuilder.ready).toHaveBeenCalled();
		});

	});

	describe('open modal()', function() {
		it('should return to /login when the modal close is called', function() {
			spyOn($modal, 'open').and.returnValue(mockModal);
			spyOn($location, 'path');

			$controller('LoginController', {
				$scope: $scope
			});

			$scope.open();
			$scope.modalInstance.close();
			expect($location.path).toHaveBeenCalledWith('/login');
		});
	});
});