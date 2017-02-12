'use strict';

describe('MainController', function() {

	var $scope, $controller, mockAuthServices, mockAlert, mockSharedMetaService;

	beforeEach(module('nextrunApp.main', 'mockModule'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _AuthServices_, _Alert_,_MockFactory_) {
		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		mockAuthServices = _AuthServices_;
		mockAlert = _Alert_;


		$controller('MainController', {
			$scope: $scope,
			SharedMetaService: _MockFactory_.getMockSharedMetaService()
		});
	}));

	describe('isLoggedIn()', function() {
		it('isLoggedIn with success', function() {
			spyOn(mockAuthServices, "isLoggedIn").and.returnValue(true);
			$scope.isLoggedIn();
			expect(mockAuthServices.isLoggedIn()).toEqual(true);
			expect(mockAuthServices.isLoggedIn).toHaveBeenCalled();
		});
	});

	describe('closemockAlert()', function() {
		it('closemockAlert with success', function() {
			spyOn(mockAlert, "closeAlert");
			$scope.closeAlert();
			expect(mockAlert.closeAlert).toHaveBeenCalled();
		});
	});

	describe('handleBroadcastMeta', function() {
		it('handleBroadcastMeta is called with success', function() {
			$scope.$broadcast('handleBroadcastMeta');
			expect($scope.pageTitle).toEqual("home");
			expect($scope.ogTitle).toEqual("home");
			expect($scope.ogUrl).toEqual("/home");
			expect($scope.ogDescription).toEqual("welcome home");
		});
	});
});