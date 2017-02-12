'use strict';

describe('passwordMatch', function() {

	var $scope, $compile, element, form;

	beforeEach(module('passwordMatch'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$scope = _$rootScope_.$new();
	}));

	var template = '<form name="form">' +
		'<div>' +
		'<input type="password" name="password" ng-model="password">' +
		'<input type="password" name="confirmPassword" ng-model="confirmPassword" match="password">' +
		'</div>' +
		'</form>';

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		element = angular.element(template);
		$compile(element)($scope);
		form = $scope.form;
	}));

	it('should match', function() {
		$scope.password = "1234";
		$scope.confirmPassword = "1234";
		$scope.$digest();
		expect(form.confirmPassword.$valid).toBe(true);
		expect(form.confirmPassword.$error.match).toBe(false);
	});

	it('should not match', function() {
		$scope.password = "12345";
		$scope.confirmPassword = "1234";
		$scope.$digest();
		expect(form.confirmPassword.$valid).toBe(false);
		expect(form.confirmPassword.$error.match).toBe(true);
	});
});