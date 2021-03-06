"use strict";

describe("MainController", function() {

	var $scope, $controller, mockAuthService, mockNotificationService, mockSharedMetaService;

	beforeEach(module("nextrunApp", "mockModule"));

	beforeEach(inject(function(_$rootScope_, _$controller_, _AuthService_, _notificationService_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		mockAuthService = _AuthService_;
		mockNotificationService = _notificationService_;


		$controller("MainController", {
			$scope: $scope,
			SharedMetaService: _MockFactory_.getMockSharedMetaService(),
			AuthService: mockAuthService
		});
	}));

	describe("isLoggedIn()", function() {
		it("isLoggedIn with success", function() {
			spyOn(mockAuthService, "isLoggedIn").and.returnValue(true);
			$scope.isLoggedIn();
			expect(mockAuthService.isLoggedIn()).toEqual(true);
			expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
		});
	});
	
	describe("handleBroadcastMeta", function() {
		it("handleBroadcastMeta is called with success", function() {
			$scope.$broadcast("handleBroadcastMeta");
			expect($scope.pageTitle).toEqual("home");
			expect($scope.ogTitle).toEqual("home");
			expect($scope.ogUrl).toEqual("/home");
			expect($scope.ogDescription).toEqual("welcome home");
		});
	});
});