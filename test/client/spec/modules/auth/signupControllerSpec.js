"use strict";

describe("SignupController", function() {

	var $scope, $controller, $location, $q, mockAuthService, mockAlertService, mockMetaService;

	beforeEach(module("nextrunApp.auth", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _AlertService_, _$location_, _MockFactory_, _MetaService_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$q = _$q_;
		mockAlertService = _AlertService_;
		$location = _$location_;
		mockMetaService = _MetaService_;

		mockAuthService = _MockFactory_.getMockAuthService();

		spyOn(mockMetaService, "ready");

		$controller("SignupController", {
			$scope: $scope,
			AuthService: mockAuthService,
			AlertService: mockAlertService
		});
	}));

	describe("submit()", function() {
		it("submit with success", function() {
			mockAuthService.setPromiseResponse(true);
			spyOn(mockAuthService, "register").and.callThrough();
			spyOn(mockAlertService, "add");
			spyOn($location, "path");
			$scope.submit();
			$scope.$apply();
			expect(mockAuthService.register).toHaveBeenCalled();
			expect(mockAlertService.add).toHaveBeenCalled();
			expect($location.path).toHaveBeenCalledWith("/");
			expect(mockMetaService.ready).toHaveBeenCalled();
		});

	});
});