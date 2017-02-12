"use strict";

describe("LoginController", function() {

	var $scope, $controller, $location, $q, $modal, mockAuthService, mockModal, mockUser, mockMetaService;

	beforeEach(module("nextrunApp.auth", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _$modal_, _MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;
		$modal = _$modal_;
		mockMetaService = _MetaService_;

		mockAuthService = _MockFactory_.getMockAuthService();
		mockUser = _MockFactory_.getMockUser();
		mockModal = _MockFactory_.getMockModalServices();
	}));

	describe("submit()", function() {

		it("login with success", function() {

			spyOn(mockAuthService, "login").and.callThrough();

			$controller("LoginController", {
				$scope: $scope,
				AuthService: mockAuthService
			});

			mockAuthService.setPromiseResponse(true);
			spyOn($location, "path");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthService.login).toHaveBeenCalled();
			expect($location.path).toHaveBeenCalledWith("/myraces");
		});

	});

	describe("signup()", function() {

		it("signup with success", function() {

			$controller("LoginController", {
				$scope: $scope
			});

			spyOn($location, "path");
			$scope.signup();
			expect($location.path).toHaveBeenCalledWith("/signup");
		});

	});

	describe("ready()", function() {
		it("loading with success", function() {
			spyOn(mockMetaService, "ready");

			$controller("LoginController", {
				$scope: $scope
			});

			expect(mockMetaService.ready).toHaveBeenCalled();
		});

	});

	describe("open modal()", function() {
		it("should return to /login when the modal close is called", function() {
			spyOn($modal, "open").and.returnValue(mockModal);
			spyOn($location, "path");

			$controller("LoginController", {
				$scope: $scope
			});

			$scope.open();
			$scope.modalInstance.close();
			expect($location.path).toHaveBeenCalledWith("/login");
		});
	});
});