'use strict';

describe('alerting', function() {

	var $scope, $timeout, Alert;

	beforeEach(module('alerting'));

	beforeEach(inject(function(_$rootScope_, _$timeout_, _Alert_) {
		$scope = _$rootScope_.$new();
		Alert = _Alert_;
		$timeout = _$timeout_;
	}));

	describe('add()', function() {
		it('add alert with success', function() {
			Alert.add("success", "successfully", 3000);
			expect($scope.alerts.length).toBe(1);
		});
	});

	describe('closeAlert()', function() {
		it('close alert when clicking on close button', function() {
			Alert.add("success", "successfully", 3000);
			expect($scope.alerts.length).toBe(1);
			$scope.alerts[0].close();
			expect($scope.alerts.length).toBe(0);
		});

		it('close alert when timeout is flush;', function() {
			Alert.add("success", "successfully", 3000);
			expect($scope.alerts.length).toBe(1);
			$timeout.flush();
			expect($scope.alerts.length).toBe(0);
		});
	});
});
