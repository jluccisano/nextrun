"use strict";

describe("SettingsController", function() {

	var $scope, $controller, $location, $q, mockAuthService, mockNotificationService, mockUser, mockMetaService;

	beforeEach(module("nextrunApp.auth", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _notificationService_, _MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		mockMetaService = _MetaService_;
		mockNotificationService = _notificationService_;
		mockAuthService = _MockFactory_.getMockAuthService();
		mockUser = _MockFactory_.getMockUser();
	}));

	describe("init()", function() {
		it("get user profile with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				notificationService: mockNotificationService
			});

			spyOn(mockAuthService, "getUserProfile").and.callThrough();
			spyOn(mockNotificationService, "success");
			spyOn($scope, "reset");

			$scope.init();
			$scope.$apply();

			expect($scope.reset).toHaveBeenCalled();
		});
	});


	describe("updateProfile()", function() {
		it("update profile with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				notificationService: mockNotificationService
			});

			spyOn($scope, "reset");
			spyOn(mockNotificationService, "success");
			spyOn(mockAuthService, "updateProfile").and.callThrough();

			$scope.updateProfile();
			$scope.$apply();

			expect(mockNotificationService.success).toHaveBeenCalled();
			expect($scope.reset).toHaveBeenCalled();
		});
	});

	describe("updatePassword()", function() {
		it("update password with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				notificationService: mockNotificationService
			});

			spyOn($scope, "reset");
			spyOn(mockNotificationService, "success");
			spyOn(mockAuthService, "updatePassword").and.callThrough();

			$scope.updatePassword();
			$scope.$apply();

			expect(mockNotificationService.success).toHaveBeenCalled();
			expect($scope.reset).toHaveBeenCalled();
		});
	});

	describe("deleteAccount()", function() {
		it("delete account with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				notificationService: mockNotificationService
			});

			spyOn(mockNotificationService, "success");
			spyOn($location, "path");
			spyOn(mockAuthService, "deleteAccount").and.callThrough();

			$scope.deleteAccount();
			$scope.$apply();

			expect(mockNotificationService.success).toHaveBeenCalled();
			expect($location.path).toHaveBeenCalledWith("/");
		});
	});

	describe("isUnchanged()", function() {
		it("isUnchanged with success", function() {
			$scope.master = mockUser;

			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				notificationService: mockNotificationService
			});

			spyOn(angular, "equals").and.returnValue(true);

			$scope.isUnchanged(mockUser);

			expect($scope.isUnchanged(mockUser)).toBe(true);
		});
	});

	describe("ready()", function() {
		it("loading with success", function() {
			spyOn(mockMetaService, "ready");

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				notificationService: mockNotificationService
			});

			expect(mockMetaService.ready).toHaveBeenCalled();
		});

	});

});