"use strict";

describe("HeaderController", function() {

	var $scope, $controller, $location, $q, mockAuthService;

	beforeEach(module("nextrunApp", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _$location_, _MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		$location = _$location_;

		mockAuthService =  _MockFactory_.getMockAuthService();

		$controller("HeaderController", {
			$scope: $scope,
			AuthService: mockAuthService
		});
	}));

	describe("logout()", function() {

		it("logout with success", function() {
			mockAuthService.setPromiseResponse(true);
			spyOn(mockAuthService, "logout").and.callThrough();
			spyOn($location, "path");
			$scope.logout();
			$scope.$apply();
			expect(mockAuthService.logout).toHaveBeenCalled();
			expect($location.path).toHaveBeenCalledWith("/login");
		});

	});

	describe("login()", function() {

		it("go to login with success", function() {
			spyOn($location, "path");
			$scope.login();
			expect($location.path).toHaveBeenCalledWith("/login");
		});
	});
});