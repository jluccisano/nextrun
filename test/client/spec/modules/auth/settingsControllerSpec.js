'use strict';

describe('SettingsController', function() {

	var $scope, $controller, $location, $q, mockAuthServices, mockAlert, mockUser, metaBuilder;

	beforeEach(module('nextrunApp.auth', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _Alert_, _MockFactory_, _metaBuilder_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		metaBuilder = _metaBuilder_;
		mockAlert = _Alert_;
		mockAuthServices = _MockFactory_.getMockAuthServices();
		mockUser = _MockFactory_.getMockUser();
	}));

	describe('init()', function() {
		it('get user profile with success', function() {
			mockAuthServices.setPromiseResponse(true);

			$controller('SettingsController', {
				$scope: $scope,
				AuthServices: mockAuthServices,
				Alert: mockAlert
			});

			spyOn(mockAuthServices, "getUserProfile").and.callThrough();
			spyOn(mockAlert, "add");
			spyOn($scope, "reset");

			$scope.init();
			$scope.$apply();

			expect($scope.reset).toHaveBeenCalled();
		});
	});


	describe('updateProfile()', function() {
		it('update profile with success', function() {
			mockAuthServices.setPromiseResponse(true);

			$controller('SettingsController', {
				$scope: $scope,
				AuthServices: mockAuthServices,
				Alert: mockAlert
			});

			spyOn($scope, "reset");
			spyOn(mockAlert, "add");
			spyOn(mockAuthServices, "updateProfile").and.callThrough();

			$scope.updateProfile();
			$scope.$apply();

			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.update.successfully", 3000);
			expect($scope.reset).toHaveBeenCalled();
		});
	});

	describe('updatePassword()', function() {
		it('update password with success', function() {
			mockAuthServices.setPromiseResponse(true);

			$controller('SettingsController', {
				$scope: $scope,
				AuthServices: mockAuthServices,
				Alert: mockAlert
			});

			spyOn($scope, "reset");
			spyOn(mockAlert, "add");
			spyOn(mockAuthServices, "updatePassword").and.callThrough();

			$scope.updatePassword();
			$scope.$apply();

			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.update.successfully", 3000);
			expect($scope.reset).toHaveBeenCalled();
		});
	});

	describe('deleteAccount()', function() {
		it('delete account with success', function() {
			mockAuthServices.setPromiseResponse(true);

			$controller('SettingsController', {
				$scope: $scope,
				AuthServices: mockAuthServices,
				Alert: mockAlert
			});

			spyOn(mockAlert, "add");
			spyOn($location, "path");
			spyOn(mockAuthServices, "deleteAccount").and.callThrough();

			$scope.deleteAccount();
			$scope.$apply();

			expect(mockAlert.add).toHaveBeenCalledWith("success", "message.account.deleted.successfully", 3000);
			expect($location.path).toHaveBeenCalledWith("/");
		});
	});

	describe('isUnchanged()', function() {
		it('isUnchanged with success', function() {
			$scope.master = mockUser;

			mockAuthServices.setPromiseResponse(true);

			$controller('SettingsController', {
				$scope: $scope,
				AuthServices: mockAuthServices,
				Alert: mockAlert
			});

			spyOn(angular, "equals").and.returnValue(true);

			$scope.isUnchanged(mockUser);

			expect($scope.isUnchanged(mockUser)).toBe(true);
		});
	});

	describe('ready()', function() {
		it('loading with success', function() {
			spyOn(metaBuilder, "ready");

			$controller('SettingsController', {
				$scope: $scope,
				AuthServices: mockAuthServices,
				Alert: mockAlert
			});

			expect(metaBuilder.ready).toHaveBeenCalled();
		});

	});

});