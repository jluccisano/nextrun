'use strict';

describe('alerting', function() {

	var $scope, $timeout, AlertService;

	beforeEach(module('nextrunApp.commons'));

	beforeEach(inject(function(_$rootScope_, _$timeout_, _AlertService_) {
		$scope = _$rootScope_.$new();
		AlertService = _AlertService_;
		$timeout = _$timeout_;
	}));

	describe('add()', function() {
		it('add alert with success', function() {
			AlertService.add("success", "successfully", 3000);
			expect($scope.alerts.length).toBe(1);
		});
	});

	describe('closeAlert()', function() {
		it('close alert when clicking on close button', function() {
			AlertService.add("success", "successfully", 3000);
			expect($scope.alerts.length).toBe(1);
			$scope.alerts[0].close();
			expect($scope.alerts.length).toBe(0);
		});

		it('close alert when timeout is flush;', function() {
			AlertService.add("success", "successfully", 3000);
			expect($scope.alerts.length).toBe(1);
			$timeout.flush();
			expect($scope.alerts.length).toBe(0);
		});
	});
});
