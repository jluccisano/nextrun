"use strict";

describe("SettingsController", function() {

	var $scope, $controller, $location, $q, mockAuthService, mockAlertService, mockUser, mockMetaService;

	beforeEach(module("nextrunApp.auth", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _AlertService_, _MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		mockMetaService = _MetaService_;
		mockAlertService = _AlertService_;
		mockAuthService = _MockFactory_.getMockAuthService();
		mockUser = _MockFactory_.getMockUser();
	}));

	describe("init()", function() {
		it("get user profile with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				AlertService: mockAlertService
			});

			spyOn(mockAuthService, "getUserProfile").and.callThrough();
			spyOn(mockAlertService, "add");
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
				AlertService: mockAlertService
			});

			spyOn($scope, "reset");
			spyOn(mockAlertService, "add");
			spyOn(mockAuthService, "updateProfile").and.callThrough();

			$scope.updateProfile();
			$scope.$apply();

			expect(mockAlertService.add).toHaveBeenCalled();
			expect($scope.reset).toHaveBeenCalled();
		});
	});

	describe("updatePassword()", function() {
		it("update password with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				AlertService: mockAlertService
			});

			spyOn($scope, "reset");
			spyOn(mockAlertService, "add");
			spyOn(mockAuthService, "updatePassword").and.callThrough();

			$scope.updatePassword();
			$scope.$apply();

			expect(mockAlertService.add).toHaveBeenCalled();
			expect($scope.reset).toHaveBeenCalled();
		});
	});

	describe("deleteAccount()", function() {
		it("delete account with success", function() {
			mockAuthService.setPromiseResponse(true);

			$controller("SettingsController", {
				$scope: $scope,
				AuthService: mockAuthService,
				AlertService: mockAlertService
			});

			spyOn(mockAlertService, "add");
			spyOn($location, "path");
			spyOn(mockAuthService, "deleteAccount").and.callThrough();

			$scope.deleteAccount();
			$scope.$apply();

			expect(mockAlertService.add).toHaveBeenCalled();
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
				AlertService: mockAlertService
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
				AlertService: mockAlertService
			});

			expect(mockMetaService.ready).toHaveBeenCalled();
		});

	});

});